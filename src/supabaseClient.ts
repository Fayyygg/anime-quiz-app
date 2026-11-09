import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export type PlayerProfile = {
	id: number
	username: string | null
	first_name: string
	photo_url: string | null
	coins: number
	total_wins: number
	games_played: number
	created_at: string
}

export type WeeklyActivity = {
	date: string
	label: string
	games: number
	isToday: boolean
}

type Database = {
	public: {
		Tables: {
			profiles: {
				Row: PlayerProfile
				Insert: {
					id: number
					username?: string | null
					first_name?: string
					photo_url?: string | null
					coins?: number
					total_wins?: number
					games_played?: number
					created_at?: string
				}
				Update: Partial<Omit<PlayerProfile, 'id' | 'created_at'>>
				Relationships: []
			}
			quiz_activity: {
				Row: { id: number; player_id: number; score: number; played_at: string }
				Insert: { player_id: number; score: number; played_at?: string }
				Update: Partial<{ player_id: number; score: number; played_at: string }>
				Relationships: []
			}
		}
		Views: Record<never, never>
		Functions: {
			record_quiz_result: {
				Args: { p_player_id: number; p_score: number }
				Returns: PlayerProfile[]
			}
		}
		Enums: Record<never, never>
		CompositeTypes: Record<never, never>
	}
}

let client: SupabaseClient<Database> | undefined

function getClient() {
	if (!supabaseUrl || !supabaseAnonKey) {
		throw new Error('Не заданы VITE_SUPABASE_URL и VITE_SUPABASE_ANON_KEY')
	}

	client ??= createClient<Database>(supabaseUrl, supabaseAnonKey)
	return client
}

export async function loadProfile(
	id: number,
	firstName: string,
	username: string | null,
	photoUrl: string | null,
): Promise<PlayerProfile> {
	const supabase = getClient()
	const { data, error } = await supabase
		.from('profiles')
		.upsert({ id, first_name: firstName, username, photo_url: photoUrl }, { onConflict: 'id' })
		.select('id, username, first_name, photo_url, coins, total_wins, games_played, created_at')
		.single()
	if (error) throw error

	return data
}

export async function recordQuizResult(profile: PlayerProfile, score: number): Promise<PlayerProfile> {
	const { data, error } = await getClient()
		.rpc('record_quiz_result', { p_player_id: profile.id, p_score: score })
		.single()
	if (error) throw error

	return data
}

export async function loadWeeklyActivity(playerId: number): Promise<WeeklyActivity[]> {
	const today = new Date()
	const firstDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 6)
	const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
	const { data, error } = await getClient()
		.from('quiz_activity')
		.select('played_at')
		.eq('player_id', playerId)
		.gte('played_at', firstDay.toISOString())
		.lte('played_at', today.toISOString())
	if (error) throw error

	const dayCounts = new Map<string, number>()
	for (const activity of data) {
		const playedAt = new Date(activity.played_at)
		const key = `${playedAt.getFullYear()}-${String(playedAt.getMonth() + 1).padStart(2, '0')}-${String(playedAt.getDate()).padStart(2, '0')}`
		dayCounts.set(key, (dayCounts.get(key) ?? 0) + 1)
	}

	return Array.from({ length: 7 }, (_, index) => {
		const day = new Date(firstDay.getFullYear(), firstDay.getMonth(), firstDay.getDate() + index)
		const key = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, '0')}-${String(day.getDate()).padStart(2, '0')}`
		return {
			date: key,
			label: day.toLocaleDateString('ru-RU', { weekday: 'short' }),
			games: dayCounts.get(key) ?? 0,
			isToday: key === todayKey,
		}
	})
}

export async function loadLeaderboard(): Promise<PlayerProfile[]> {
	const { data, error } = await getClient()
		.from('profiles')
		.select('id, username, first_name, photo_url, coins, total_wins, games_played, created_at')
		.order('total_wins', { ascending: false })
		.order('coins', { ascending: false })
		.limit(100)
	if (error) throw error

	return data
}