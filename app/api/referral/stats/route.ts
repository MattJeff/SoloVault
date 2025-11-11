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

    // Vérifier si Supabase est configuré
    if (!supabase) {
      console.warn('Supabase not configured, returning default referral stats');
      const referralCode = generateReferralCode(email);
      return NextResponse.json({
        referralCode,
        referralsCount: 0,
        referredUsers: [],
        callEarned: false
      });
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
    // Retourner des données par défaut au lieu d'une erreur 500
    const email = new URL(request.url).searchParams.get('email') || '';
    const referralCode = email ? generateReferralCode(email) : '';
    return NextResponse.json({
      referralCode,
      referralsCount: 0,
      referredUsers: [],
      callEarned: false
    });
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
