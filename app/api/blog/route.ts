import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET - Récupérer tous les articles (publics ou tous pour admin)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = searchParams.get('limit');
    const category = searchParams.get('category');

    if (!supabase) {
      return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 });
    }

    let query = supabase
      .from('blog_posts')
      .select('*')
      .order('published_at', { ascending: false, nullsFirst: false })
      .order('created_at', { ascending: false });

    // Filtrer par statut
    if (status) {
      query = query.eq('status', status);
    } else {
      // Par défaut, seulement les articles publiés
      query = query.eq('status', 'published');
    }

    // Filtrer par catégorie
    if (category) {
      query = query.eq('category', category);
    }

    // Limiter le nombre de résultats
    if (limit) {
      query = query.limit(parseInt(limit));
    }

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json({ error: 'Failed to fetch blog posts' }, { status: 500 });
  }
}

// POST - Créer un nouvel article
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      slug,
      excerpt,
      content,
      coverImage,
      authorEmail,
      authorName,
      category,
      tags,
      status
    } = body;

    if (!title || !slug || !content || !authorEmail) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!supabase) {
      return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 });
    }

    // Calculer le temps de lecture (mots par minute)
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / wordsPerMinute);

    const newPost = {
      title,
      slug,
      excerpt: excerpt || content.substring(0, 160),
      content,
      cover_image: coverImage,
      author_email: authorEmail,
      author_name: authorName,
      category,
      tags: tags || [],
      status: status || 'draft',
      published_at: status === 'published' ? new Date().toISOString() : null,
      reading_time: readingTime
    };

    const { data, error } = await supabase
      .from('blog_posts')
      .insert(newPost)
      .select()
      .single();

    if (error) throw error;

    console.log('✅ Blog post created:', data.id);

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error creating blog post:', error);
    
    if (error.code === '23505') {
      return NextResponse.json(
        { error: 'A post with this slug already exists' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create blog post' },
      { status: 500 }
    );
  }
}
