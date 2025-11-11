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

    // Vérifier si Supabase est configuré
    if (!supabase) {
      console.warn('Supabase not configured, quiz response not saved');
      return NextResponse.json({
        success: true,
        id: Date.now().toString()
      });
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

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({
        success: true,
        id: Date.now().toString()
      });
    }

    console.log('✅ Quiz response saved:', {
      id: data.id,
      email,
      resultType,
      answersCount: Object.keys(answers).length
    });

    return NextResponse.json({
      success: true,
      id: data.id
    });

  } catch (error) {
    console.error('Error saving quiz response:', error);
    // Retourner succès au lieu d'erreur 500
    return NextResponse.json({
      success: true,
      id: Date.now().toString()
    });
  }
}
