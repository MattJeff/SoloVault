import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { email, referralCode } = await request.json();

    if (!email || !referralCode) {
      return NextResponse.json(
        { error: 'Email and referral code are required' },
        { status: 400 }
      );
    }

    // Find the referrer by code
    const { data: referrer, error: referrerError } = await supabase
      .from('referrals')
      .select('*')
      .eq('referral_code', referralCode)
      .single();

    if (referrerError || !referrer) {
      return NextResponse.json(
        { error: 'Invalid referral code' },
        { status: 404 }
      );
    }

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('referrals')
      .select('email')
      .eq('email', email)
      .single();

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
    const referredUsers = referrer.referred_users as string[];

    if (!referredUsers.includes(email)) {
      const newReferredUsers = [...referredUsers, email];

      // Check if call is earned (3 referrals)
      const callEarned = newReferredUsers.length >= 3;

      // Update referrer
      const { error: updateError } = await supabase
        .from('referrals')
        .update({
          referred_users: newReferredUsers,
          call_earned: callEarned
        })
        .eq('email', referrer.email);

      if (updateError) throw updateError;

      // Track action for gamification
      try {
        await fetch(`${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/api/track-action`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: referrer.email,
            action: 'REFERRAL',
            metadata: { referredUser: email }
          })
        });
      } catch (err) {
        console.error('Failed to track referral:', err);
      }

      return NextResponse.json({
        success: true,
        referrerEmail: referrer.email,
        totalReferrals: newReferredUsers.length,
        callEarned
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Already referred'
    });

  } catch (error) {
    console.error('Error tracking referral:', error);
    return NextResponse.json(
      { error: 'Failed to track referral' },
      { status: 500 }
    );
  }
}
