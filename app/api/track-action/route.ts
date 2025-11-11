import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { ACTIONS_POINTS, checkBadgeEligibility } from '@/lib/gamification';

export async function POST(request: NextRequest) {
  try {
    const { email, action, metadata } = await request.json();

    if (!email || !action) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Vérifier si Supabase est configuré
    if (!supabase) {
      console.warn('Supabase not configured, action tracking skipped');
      const pointsEarned = (ACTIONS_POINTS as any)[action] || 0;
      return NextResponse.json({
        success: true,
        pointsEarned,
        totalPoints: pointsEarned,
        newBadges: [],
        level: 1
      });
    }

    // Get or create user progress
    const { data: existingUser, error: fetchError } = await supabase
      .from('user_progress')
      .select('*')
      .eq('email', email)
      .single();

    let userProgress;

    if (fetchError && fetchError.code === 'PGRST116') {
      // User doesn't exist, create new
      const newUser = {
        email,
        points: 0,
        badges: [],
        level: 1,
        actions: {
          emailSubmitted: false,
          quizCompleted: false,
          projectsViewed: 0,
          dataDownloaded: false,
          referrals: 0
        }
      };

      const { data: createdUser, error: createError } = await supabase
        .from('user_progress')
        .insert(newUser)
        .select()
        .single();

      if (createError) throw createError;
      userProgress = createdUser;
    } else if (fetchError) {
      throw fetchError;
    } else {
      userProgress = existingUser;
    }

    // Award points based on action
    const pointsEarned = (ACTIONS_POINTS as any)[action] || 0;
    const newPoints = userProgress.points + pointsEarned;

    // Update action tracking
    const actions = { ...userProgress.actions };
    switch (action) {
      case 'EMAIL_SUBMIT':
        actions.emailSubmitted = true;
        break;
      case 'QUIZ_COMPLETE':
        actions.quizCompleted = true;
        break;
      case 'VIEW_PROJECT':
        actions.projectsViewed += 1;
        break;
      case 'DOWNLOAD_DATA':
        actions.dataDownloaded = true;
        break;
      case 'REFERRAL':
        actions.referrals += 1;
        break;
    }

    // Check for new badges
    const tempProgress = {
      ...userProgress,
      points: newPoints,
      actions
    };
    const newBadges = checkBadgeEligibility(tempProgress);
    const allBadges = [...new Set([...userProgress.badges, ...newBadges])];

    // Update user progress
    const { data: updatedUser, error: updateError } = await supabase
      .from('user_progress')
      .update({
        points: newPoints,
        badges: allBadges,
        actions,
        last_activity: new Date().toISOString()
      })
      .eq('email', email)
      .select()
      .single();

    if (updateError) throw updateError;

    console.log('✅ Action tracked:', {
      email,
      action,
      pointsEarned,
      totalPoints: updatedUser.points,
      newBadges: newBadges.length > 0 ? newBadges : 'none',
      level: updatedUser.level
    });

    return NextResponse.json({
      success: true,
      pointsEarned,
      totalPoints: updatedUser.points,
      newBadges,
      level: updatedUser.level
    });

  } catch (error) {
    console.error('Error tracking action:', error);
    // Retourner une réponse par défaut au lieu d'une erreur 500
    return NextResponse.json({
      success: true,
      pointsEarned: 0,
      totalPoints: 0,
      newBadges: [],
      level: 1
    });
  }
}
