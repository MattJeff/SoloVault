import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { ACTIONS_POINTS, checkBadgeEligibility, UserProgress } from '@/lib/gamification';

export async function POST(request: NextRequest) {
  try {
    const { email, action, metadata } = await request.json();

    if (!email || !action) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const filePath = path.join(process.cwd(), 'data', 'user-progress.json');
    let allProgress: UserProgress[] = [];

    // Read existing progress
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      allProgress = JSON.parse(fileContent);
    }

    // Find or create user progress
    let userProgress = allProgress.find(p => p.email === email);

    if (!userProgress) {
      userProgress = {
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
        },
        createdAt: new Date().toISOString(),
        lastActivity: new Date().toISOString()
      };
      allProgress.push(userProgress);
    }

    // Award points based on action
    const pointsEarned = (ACTIONS_POINTS as any)[action] || 0;
    userProgress.points += pointsEarned;
    userProgress.lastActivity = new Date().toISOString();

    // Update action tracking
    switch (action) {
      case 'EMAIL_SUBMIT':
        userProgress.actions.emailSubmitted = true;
        break;
      case 'QUIZ_COMPLETE':
        userProgress.actions.quizCompleted = true;
        break;
      case 'VIEW_PROJECT':
        userProgress.actions.projectsViewed += 1;
        break;
      case 'DOWNLOAD_DATA':
        userProgress.actions.dataDownloaded = true;
        break;
      case 'REFERRAL':
        userProgress.actions.referrals += 1;
        break;
    }

    // Check for new badges
    const newBadges = checkBadgeEligibility(userProgress);
    newBadges.forEach(badgeId => {
      if (!userProgress!.badges.includes(badgeId)) {
        userProgress!.badges.push(badgeId);
      }
    });

    // Save updated progress
    fs.writeFileSync(filePath, JSON.stringify(allProgress, null, 2));

    return NextResponse.json({
      success: true,
      pointsEarned,
      totalPoints: userProgress.points,
      newBadges,
      level: userProgress.level
    });

  } catch (error) {
    console.error('Error tracking action:', error);
    return NextResponse.json(
      { error: 'Failed to track action' },
      { status: 500 }
    );
  }
}
