'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Clock, Eye, Calendar, ArrowLeft, Share2 } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image: string;
  category: string;
  tags: string[];
  reading_time: number;
  views: number;
  published_at: string;
  author_name: string;
  author_email: string;
}

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    if (slug) {
      loadPost();
    }
  }, [slug]);

  const loadPost = async () => {
    try {
      const response = await fetch(`/api/blog/${slug}`);
      if (response.ok) {
        const data = await response.json();
        setPost(data);
        
        // Charger les articles similaires
        if (data.category) {
          const relatedResponse = await fetch(`/api/blog?status=published&category=${data.category}&limit=3`);
          const relatedData = await relatedResponse.json();
          setRelatedPosts(relatedData.filter((p: BlogPost) => p.id !== data.id));
        }
      }
    } catch (error) {
      console.error('Error loading post:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post?.title,
        text: post?.excerpt,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Lien copié dans le presse-papier !');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-orange-500 border-t-transparent" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Article non trouvé</h1>
          <Link href="/astuces" className="text-orange-500 hover:underline">
            ← Retour aux astuces
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-zinc-800">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <Link href="/astuces" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition mb-6">
            <ArrowLeft className="w-4 h-4" />
            Retour aux astuces
          </Link>
        </div>
      </div>

      {/* Cover Image */}
      {post.cover_image && (
        <div className="max-w-4xl mx-auto px-4 py-8">
          <img
            src={post.cover_image}
            alt={post.title}
            className="w-full aspect-video object-cover rounded-2xl"
          />
        </div>
      )}

      {/* Article Content */}
      <article className="max-w-4xl mx-auto px-4 py-8">
        {/* Meta */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-400 mb-6">
          {post.category && (
            <span className="px-3 py-1 bg-orange-500/10 border border-orange-500/30 text-orange-500 font-semibold rounded-full">
              {post.category}
            </span>
          )}
          {post.published_at && (
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {new Date(post.published_at).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </span>
          )}
          {post.reading_time && (
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              {post.reading_time} min de lecture
            </span>
          )}
          {post.views > 0 && (
            <span className="flex items-center gap-1.5">
              <Eye className="w-4 h-4" />
              {post.views} vues
            </span>
          )}
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          {post.title}
        </h1>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="text-xl text-zinc-400 mb-8 leading-relaxed">
            {post.excerpt}
          </p>
        )}

        {/* Author & Share */}
        <div className="flex items-center justify-between py-6 border-y border-zinc-800 mb-8">
          <div>
            {post.author_name && (
              <div className="text-sm">
                <span className="text-zinc-500">Par</span>{' '}
                <span className="font-semibold">{post.author_name}</span>
              </div>
            )}
          </div>
          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 hover:border-orange-500 rounded-lg transition"
          >
            <Share2 className="w-4 h-4" />
            Partager
          </button>
        </div>

        {/* Content */}
        <div 
          className="prose prose-invert prose-orange max-w-none
            prose-headings:font-bold prose-headings:text-white
            prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl
            prose-p:text-zinc-300 prose-p:leading-relaxed
            prose-a:text-orange-500 prose-a:no-underline hover:prose-a:underline
            prose-strong:text-white prose-strong:font-semibold
            prose-code:text-orange-500 prose-code:bg-zinc-900 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
            prose-pre:bg-zinc-900 prose-pre:border prose-pre:border-zinc-800
            prose-blockquote:border-l-4 prose-blockquote:border-orange-500 prose-blockquote:pl-4 prose-blockquote:italic
            prose-img:rounded-lg prose-img:my-8
            prose-ul:list-disc prose-ol:list-decimal
            prose-li:text-zinc-300"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mt-12 pt-8 border-t border-zinc-800">
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-full text-sm text-zinc-400"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <div className="border-t border-zinc-800 bg-zinc-900/30">
          <div className="max-w-4xl mx-auto px-4 py-12">
            <h2 className="text-2xl font-bold mb-6">Articles similaires</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.id}
                  href={`/astuces/${relatedPost.slug}`}
                  className="group bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-orange-500 transition"
                >
                  {relatedPost.cover_image && (
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={relatedPost.cover_image}
                        alt={relatedPost.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="font-bold mb-2 group-hover:text-orange-500 transition line-clamp-2">
                      {relatedPost.title}
                    </h3>
                    {relatedPost.reading_time && (
                      <p className="text-xs text-zinc-500">
                        {relatedPost.reading_time} min de lecture
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="border-t border-zinc-800">
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Prêt à lancer ton projet solo ?
          </h2>
          <p className="text-zinc-400 mb-8 max-w-2xl mx-auto">
            Découvre notre base de données de 50+ projets solos à succès et trouve l'inspiration pour ton prochain SaaS
          </p>
          <Link
            href="/dashboard"
            className="inline-block px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg transition"
          >
            Explorer la base de données →
          </Link>
        </div>
      </div>
    </div>
  );
}
