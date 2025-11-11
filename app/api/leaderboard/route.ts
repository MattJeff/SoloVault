import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Get top 50 users sorted by points descending
    const { data: leaderboard, error } = await supabase
      .from('user_progress')
      .select('email, points, level, badges')
      .order('points', { ascending: false })
      .limit(50);

    if (error) throw error;

    return NextResponse.json(leaderboard || []);

  } catch (error) {
    console.error('Error reading leaderboard:', error);
    return NextResponse.json(
      { error: 'Failed to read leaderboard' },
      { status: 500 }
    );
  }
}
