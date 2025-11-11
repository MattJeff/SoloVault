import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Vérifier si Supabase est configuré
    if (!supabase) {
      console.warn('Supabase not configured, returning empty leaderboard');
      return NextResponse.json([]);
    }

    // Get top 50 users sorted by points descending
    const { data: leaderboard, error } = await supabase
      .from('user_progress')
      .select('email, points, level, badges')
      .order('points', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json([]);
    }

    return NextResponse.json(leaderboard || []);

  } catch (error) {
    console.error('Error reading leaderboard:', error);
    // Retourner un tableau vide au lieu d'une erreur 500
    return NextResponse.json([]);
  }
}
