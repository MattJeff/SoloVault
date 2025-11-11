import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { UserProgress } from '@/lib/gamification';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'data', 'user-progress.json');

    if (!fs.existsSync(filePath)) {
      return NextResponse.json([]);
    }

    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const allProgress: UserProgress[] = JSON.parse(fileContent);

    // Sort by points descending
    const leaderboard = allProgress
      .sort((a, b) => b.points - a.points)
      .slice(0, 50) // Top 50
      .map(p => ({
        email: p.email,
        points: p.points,
        level: p.level,
        badges: p.badges
      }));

    return NextResponse.json(leaderboard);
  } catch (error) {
    console.error('Error reading leaderboard:', error);
    return NextResponse.json(
      { error: 'Failed to read leaderboard' },
      { status: 500 }
    );
  }
}
