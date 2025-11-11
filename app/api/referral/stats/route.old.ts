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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
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
        // Reset to empty array if file is corrupted
        allReferrals = [];
      }
    }

    // Find or create user referral data
    let userReferral = allReferrals.find(r => r.email === email);

    if (!userReferral) {
      // Generate unique referral code
      const referralCode = generateReferralCode(email);

      userReferral = {
        email,
        referralCode,
        referredUsers: [],
        callEarned: false,
        createdAt: new Date().toISOString()
      };

      allReferrals.push(userReferral);
      fs.writeFileSync(filePath, JSON.stringify(allReferrals, null, 2));
    }

    return NextResponse.json({
      referralCode: userReferral.referralCode || '',
      referralsCount: userReferral.referredUsers?.length || 0,
      referredUsers: userReferral.referredUsers || [],
      callEarned: userReferral.callEarned || false
    });

  } catch (error) {
    console.error('Error getting referral stats:', error);
    return NextResponse.json(
      {
        error: 'Failed to get referral stats',
        referralCode: '',
        referralsCount: 0,
        referredUsers: [],
        callEarned: false
      },
      { status: 500 }
    );
  }
}

function generateReferralCode(email: string): string {
  const hash = email.split('').reduce((acc, char) => {
    return ((acc << 5) - acc) + char.charCodeAt(0);
  }, 0);

  const base = Math.abs(hash).toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();

  return `${base.substring(0, 4)}${random}`;
}
