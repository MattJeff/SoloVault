import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

interface ReferralData {
  email: string;
  referralCode: string;
  referredBy?: string;
  referredUsers: string[];
  callEarned: boolean;
  createdAt: string;
}

export async function POST(request: NextRequest) {
  try {
    const { email, referralCode } = await request.json();

    if (!email || !referralCode) {
      return NextResponse.json(
        { error: 'Email and referral code are required' },
        { status: 400 }
      );
    }

    // Ensure data directory exists
    const dataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    const filePath = path.join(dataDir, 'referrals.json');
    let allReferrals: ReferralData[] = [];

    // Read existing referrals
    if (fs.existsSync(filePath)) {
      try {
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        if (fileContent.trim()) {
          allReferrals = JSON.parse(fileContent);
        }
      } catch (parseError) {
        console.error('Error parsing referrals.json:', parseError);
        allReferrals = [];
      }
    }

    // Find the referrer by code
    const referrer = allReferrals.find(r => r.referralCode === referralCode);

    if (!referrer) {
      return NextResponse.json(
        { error: 'Invalid referral code' },
        { status: 404 }
      );
    }

    // Check if user already exists
    const existingUser = allReferrals.find(r => r.email === email);
    if (existingUser) {
      return NextResponse.json(
        { message: 'User already registered' },
        { status: 200 }
      );
    }

    // Check if user is not referring themselves
    if (referrer.email === email) {
      return NextResponse.json(
        { error: 'Cannot refer yourself' },
        { status: 400 }
      );
    }

    // Add new user to referred list
    if (!referrer.referredUsers.includes(email)) {
      referrer.referredUsers.push(email);

      // Check if call is earned (3 referrals)
      if (referrer.referredUsers.length >= 3 && !referrer.callEarned) {
        referrer.callEarned = true;
      }

      // Save updated referrals
      fs.writeFileSync(filePath, JSON.stringify(allReferrals, null, 2));

      // Track action for gamification
      await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/track-action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: referrer.email,
          action: 'REFERRAL',
          metadata: { referredUser: email }
        })
      }).catch(err => console.error('Failed to track referral:', err));
    }

    return NextResponse.json({
      success: true,
      referrerEmail: referrer.email,
      totalReferrals: referrer.referredUsers.length,
      callEarned: referrer.callEarned
    });

  } catch (error) {
    console.error('Error tracking referral:', error);
    return NextResponse.json(
      { error: 'Failed to track referral' },
      { status: 500 }
    );
  }
}
