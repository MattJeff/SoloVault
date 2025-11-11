import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    if (!supabase) {
      return NextResponse.json({
        error: 'Supabase not configured',
        fallback: true
      });
    }

    // Récupérer toutes les données en parallèle
    const [
      usersResult,
      progressResult,
      quizResult,
      referralsResult
    ] = await Promise.all([
      supabase.from('users').select('*'),
      supabase.from('user_progress').select('*'),
      supabase.from('quiz_responses').select('*'),
      supabase.from('referrals').select('*')
    ]);

    // Stats utilisateurs
    const users = usersResult.data || [];
    const totalUsers = users.length;
    
    // Utilisateurs par jour (derniers 7 jours)
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toISOString().split('T')[0];
    });

    const usersByDay = last7Days.map(date => {
      const count = users.filter(u => 
        u.created_at?.startsWith(date)
      ).length;
      return { date, count };
    });

    // Stats progression
    const progressData = progressResult.data || [];
    const totalPoints = progressData.reduce((sum, p) => sum + (p.points || 0), 0);
    const avgPoints = progressData.length > 0 ? Math.round(totalPoints / progressData.length) : 0;
    
    // Top users par points
    const topUsers = progressData
      .sort((a, b) => (b.points || 0) - (a.points || 0))
      .slice(0, 10)
      .map(p => ({
        email: p.email,
        points: p.points || 0,
        level: p.level || 1,
        badges: (p.badges || []).length
      }));

    // Distribution des badges
    const allBadges = progressData.flatMap(p => p.badges || []);
    const badgeCount: { [key: string]: number } = {};
    allBadges.forEach(badge => {
      badgeCount[badge] = (badgeCount[badge] || 0) + 1;
    });

    // Stats quiz
    const quizData = quizResult.data || [];
    const totalQuizResponses = quizData.length;
    
    // Distribution des types de résultats
    const resultTypes: { [key: string]: number } = {};
    quizData.forEach(q => {
      const type = q.result_type || 'unknown';
      resultTypes[type] = (resultTypes[type] || 0) + 1;
    });

    // Stats parrainage
    const referralData = referralsResult.data || [];
    const totalReferrals = referralData.reduce((sum, r) => 
      sum + (r.referred_users?.length || 0), 0
    );
    const callsEarned = referralData.filter(r => r.call_earned).length;
    
    // Top referrers
    const topReferrers = referralData
      .sort((a, b) => (b.referred_users?.length || 0) - (a.referred_users?.length || 0))
      .slice(0, 5)
      .map(r => ({
        email: r.email,
        referrals: r.referred_users?.length || 0,
        callEarned: r.call_earned || false
      }));

    // Actions par type
    const actionStats = {
      emailSubmitted: progressData.filter(p => p.actions?.emailSubmitted).length,
      quizCompleted: progressData.filter(p => p.actions?.quizCompleted).length,
      dataDownloaded: progressData.filter(p => p.actions?.dataDownloaded).length,
      totalProjectsViewed: progressData.reduce((sum, p) => 
        sum + (p.actions?.projectsViewed || 0), 0
      )
    };

    return NextResponse.json({
      users: {
        total: totalUsers,
        byDay: usersByDay,
        recent: users.slice(0, 5).map(u => ({
          email: u.email,
          firstName: u.first_name,
          lastName: u.last_name,
          createdAt: u.created_at
        }))
      },
      progress: {
        totalPoints,
        avgPoints,
        topUsers,
        badgeDistribution: Object.entries(badgeCount).map(([name, count]) => ({
          name,
          count
        }))
      },
      quiz: {
        total: totalQuizResponses,
        resultDistribution: Object.entries(resultTypes).map(([type, count]) => ({
          type,
          count
        })),
        recent: quizData.slice(0, 5).map(q => ({
          email: q.email,
          resultType: q.result_type,
          createdAt: q.created_at
        }))
      },
      referrals: {
        total: totalReferrals,
        callsEarned,
        topReferrers
      },
      actions: actionStats
    });

  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
