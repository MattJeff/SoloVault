import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Créer le client Supabase seulement si les clés sont configurées
export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// Log si Supabase n'est pas configuré
if (!supabase && typeof window !== 'undefined') {
  console.warn('⚠️ Supabase not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local')
  console.warn('📖 See SUPABASE_SETUP_GUIDE.md for instructions')
}

// Database Types
export interface UserProgress {
  id?: string
  email: string
  points: number
  badges: string[]
  level: number
  actions: {
    emailSubmitted: boolean
    quizCompleted: boolean
    projectsViewed: number
    dataDownloaded: boolean
    referrals: number
  }
  created_at?: string
  last_activity?: string
}

export interface ReferralData {
  id?: string
  email: string
  referral_code: string
  referred_by?: string
  referred_users: string[]
  call_earned: boolean
  created_at?: string
}

export interface QuizResponse {
  id?: string
  email: string
  answers: Record<string, string>
  result_type: string
  created_at?: string
}
