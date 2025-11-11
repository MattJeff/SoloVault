import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

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
