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
		}
		Views: Record<never, never>
		Functions: Record<never, never>
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
	const correctAnswers = Math.max(0, Math.min(10, Math.trunc(score)))
	const { data, error } = await getClient()
		.from('profiles')
		.update({
			coins: profile.coins + correctAnswers * 100,
			total_wins: profile.total_wins + correctAnswers,
			games_played: profile.games_played + 1,
		})
		.eq('id', profile.id)
		.select('id, username, first_name, photo_url, coins, total_wins, games_played, created_at')
		.single()
	if (error) throw error

	return data
}