import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

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

    // Get or create user referral data
    const { data: existingReferral, error: fetchError } = await supabase
      .from('referrals')
      .select('*')
      .eq('email', email)
      .single();

    let referralData;

    if (fetchError && fetchError.code === 'PGRST116') {
      // User doesn't exist, create new
      const referralCode = generateReferralCode(email);

      const newReferral = {
        email,
        referral_code: referralCode,
        referred_users: [],
        call_earned: false
      };

      const { data: createdReferral, error: createError } = await supabase
        .from('referrals')
        .insert(newReferral)
        .select()
        .single();

      if (createError) throw createError;
      referralData = createdReferral;
    } else if (fetchError) {
      throw fetchError;
    } else {
      referralData = existingReferral;
    }

    return NextResponse.json({
      referralCode: referralData.referral_code || '',
      referralsCount: (referralData.referred_users as string[])?.length || 0,
      referredUsers: referralData.referred_users || [],
      callEarned: referralData.call_earned || false
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
