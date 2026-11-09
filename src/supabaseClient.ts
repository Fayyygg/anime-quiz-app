import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export type PlayerProfile = {
	id: string
	first_name: string
	coins: number
	total_wins: number
}

type Database = {
	public: {
		Tables: {
			profiles: {
				Row: PlayerProfile & { created_at: string }
				Insert: { id: string; first_name?: string; coins?: number; total_wins?: number; created_at?: string }
				Update: Partial<PlayerProfile & { created_at: string }>
				Relationships: []
			}
		}
		Views: Record<never, never>
		Functions: {
			record_quiz_result: { Args: { p_score: number }; Returns: PlayerProfile[] }
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

export async function loadProfile(firstName: string): Promise<PlayerProfile> {
	const supabase = getClient()
	const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
	if (sessionError) throw sessionError

	let userId = sessionData.session?.user.id
	if (!userId) {
		const { data, error } = await supabase.auth.signInAnonymously()
		if (error) throw error
		if (!data.user) throw new Error('Supabase не вернул пользователя')
		userId = data.user.id
	}

	const { error: insertError } = await supabase
		.from('profiles')
		.upsert({ id: userId, first_name: firstName }, { onConflict: 'id', ignoreDuplicates: true })
	if (insertError) throw insertError

	const { data: profile, error: profileError } = await supabase
		.from('profiles')
		.select('id, first_name, coins, total_wins')
		.eq('id', userId)
		.single()
	if (profileError) throw profileError

	return profile
}

export async function recordQuizResult(score: number): Promise<PlayerProfile> {
	const { data, error } = await getClient()
		.rpc('record_quiz_result', { p_score: score })
		.single()
	if (error) throw error

	return data
}