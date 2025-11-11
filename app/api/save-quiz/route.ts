import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, answers, resultType } = body;

    if (!email || !answers) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Save quiz response
    const { data, error } = await supabase
      .from('quiz_responses')
      .insert({
        email,
        answers,
        result_type: resultType || null
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      id: data.id
    });

  } catch (error) {
    console.error('Error saving quiz response:', error);
    return NextResponse.json(
      { error: 'Failed to save quiz response' },
      { status: 500 }
    );
  }
}
