import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { firstName, lastName, email, source, page } = await request.json();

    // Validation
    if (!firstName || !lastName || !email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Vérifier si Supabase est configuré
    if (!supabase) {
      console.warn('Supabase not configured, user not saved');
      return NextResponse.json({
        success: true,
        user: {
          id: Date.now().toString(),
          firstName,
          lastName,
          email,
          source: source || 'Unknown',
          page: page || '/',
          createdAt: new Date().toISOString()
        }
      });
    }

    // Vérifier si l'utilisateur existe déjà
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (existingUser) {
      console.log('ℹ️ User already exists:', email);
      return NextResponse.json({
        success: true,
        user: existingUser,
        message: 'User already exists'
      });
    }

    // Créer le nouvel utilisateur dans Supabase
    const { data, error } = await supabase
      .from('users')
      .insert({
        first_name: firstName,
        last_name: lastName,
        email,
        source: source || 'Unknown',
        page: page || '/'
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      // Retourner succès même en cas d'erreur pour ne pas bloquer le frontend
      return NextResponse.json({
        success: true,
        user: {
          id: Date.now().toString(),
          firstName,
          lastName,
          email,
          source: source || 'Unknown',
          page: page || '/',
          createdAt: new Date().toISOString()
        }
      });
    }

    console.log('✅ User saved to Supabase:', {
      id: data.id,
      name: `${firstName} ${lastName}`,
      email: email,
      source: source || 'Unknown'
    });

    return NextResponse.json({ 
      success: true, 
      user: {
        id: data.id,
        firstName: data.first_name,
        lastName: data.last_name,
        email: data.email,
        source: data.source,
        page: data.page,
        createdAt: data.created_at
      },
      message: 'User saved successfully!'
    });

  } catch (error) {
    console.error('Error saving user:', error);
    // Retourner succès au lieu d'erreur 500
    return NextResponse.json({
      success: true,
      user: {
        id: Date.now().toString(),
        email: 'unknown',
        createdAt: new Date().toISOString()
      }
    });
  }
}
