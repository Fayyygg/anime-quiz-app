import { createHmac, timingSafeEqual } from 'node:crypto'
import type { IncomingMessage, ServerResponse } from 'node:http'
import { createClient } from '@supabase/supabase-js'

type RequestWithBody = IncomingMessage & { body?: unknown }

type RewardsDatabase = {
	public: {
		Tables: Record<never, never>
		Views: Record<never, never>
		Functions: {
			claim_daily_reward: {
				Args: { p_player_id: number }
				Returns: { new_coins: number; claim_date: string; claimed: boolean }[]
			}
			claim_subscription_reward: {
				Args: { p_player_id: number }
				Returns: { new_coins: number; claimed: boolean }[]
			}
		}
		Enums: Record<never, never>
		CompositeTypes: Record<never, never>
	}
}

function sendJson(response: ServerResponse, status: number, body: unknown) {
	response.statusCode = status
	response.setHeader('Content-Type', 'application/json; charset=utf-8')
	response.setHeader('Cache-Control', 'no-store')
	response.end(JSON.stringify(body))
}

async function readBody(request: RequestWithBody): Promise<unknown> {
	if (request.body !== undefined) {
		return typeof request.body === 'string' ? JSON.parse(request.body) : request.body
	}

	const chunks: Buffer[] = []
	for await (const chunk of request) {
		chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
	}
	return JSON.parse(Buffer.concat(chunks).toString('utf8'))
}

function verifyTelegramUser(initData: string, botToken: string): { id: number } | null {
	const params = new URLSearchParams(initData)
	const receivedHash = params.get('hash')
	if (!receivedHash || !/^[a-f0-9]{64}$/i.test(receivedHash)) return null

	params.delete('hash')
	const dataCheckString = [...params.entries()]
		.sort(([left], [right]) => left.localeCompare(right))
		.map(([key, value]) => `${key}=${value}`)
		.join('\n')
	const secretKey = createHmac('sha256', 'WebAppData').update(botToken).digest()
	const expectedHash = createHmac('sha256', secretKey).update(dataCheckString).digest()
	const actualHash = Buffer.from(receivedHash, 'hex')
	if (actualHash.length !== expectedHash.length || !timingSafeEqual(actualHash, expectedHash)) return null

	const authDate = Number(params.get('auth_date'))
	const now = Math.floor(Date.now() / 1000)
	if (!Number.isFinite(authDate) || authDate > now + 30 || now - authDate > 86400) return null

	try {
		const user = JSON.parse(params.get('user') ?? '') as { id?: number }
		return Number.isSafeInteger(user.id) && Number(user.id) > 0 ? { id: Number(user.id) } : null
	} catch {
		return null
	}
}

export default async function handler(request: RequestWithBody, response: ServerResponse) {
	if (request.method !== 'POST') {
		return sendJson(response, 405, { error: 'method_not_allowed' })
	}

	const botToken = process.env.TELEGRAM_BOT_TOKEN
	const supabaseUrl = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL
	const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
	if (!botToken || !supabaseUrl || !serviceRoleKey) {
		return sendJson(response, 503, { error: 'rewards_not_configured' })
	}

	try {
		const body = await readBody(request) as { initData?: unknown; task?: unknown }
		if (typeof body.initData !== 'string' || (body.task !== 'daily' && body.task !== 'subscription')) {
			return sendJson(response, 400, { error: 'invalid_request' })
		}

		const user = verifyTelegramUser(body.initData, botToken)
		if (!user) return sendJson(response, 401, { error: 'invalid_telegram_data' })

		if (body.task === 'subscription') {
			const membershipResponse = await fetch(`https://api.telegram.org/bot${botToken}/getChatMember`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ chat_id: '@animequiznews', user_id: user.id }),
			})
			const membership = await membershipResponse.json() as {
				ok?: boolean
				result?: { status?: string; is_member?: boolean }
			}
			if (!membershipResponse.ok || !membership.ok) {
				return sendJson(response, 502, { error: 'telegram_membership_check_failed' })
			}

			const member = membership.result?.status === 'member'
				|| membership.result?.status === 'administrator'
				|| membership.result?.status === 'creator'
				|| (membership.result?.status === 'restricted' && membership.result.is_member === true)
			if (!member) return sendJson(response, 403, { error: 'not_subscribed' })
		}

		const supabase = createClient<RewardsDatabase>(supabaseUrl, serviceRoleKey, {
			auth: { autoRefreshToken: false, persistSession: false },
		})
		if (body.task === 'daily') {
			const result = await supabase.rpc('claim_daily_reward', { p_player_id: user.id }).single()
			if (result.error) {
				console.error('Daily reward claim failed:', result.error.message)
				return sendJson(response, 500, { error: 'reward_claim_failed' })
			}
			if (!result.data) return sendJson(response, 404, { error: 'profile_not_found' })

			return sendJson(response, 200, {
				task: 'daily',
				coins: result.data.new_coins,
				daily_claimed_on: result.data.claim_date,
				claimed: result.data.claimed,
			})
		}

		const result = await supabase.rpc('claim_subscription_reward', { p_player_id: user.id }).single()
		if (result.error) {
			console.error('Subscription reward claim failed:', result.error.message)
			return sendJson(response, 500, { error: 'reward_claim_failed' })
		}
		if (!result.data) return sendJson(response, 404, { error: 'profile_not_found' })

		return sendJson(response, 200, {
			task: 'subscription',
			coins: result.data.new_coins,
			subscription_reward_claimed: true,
			claimed: result.data.claimed,
		})
	} catch (error) {
		console.error('Rewards API error:', error)
		return sendJson(response, 400, { error: 'invalid_request' })
	}
}