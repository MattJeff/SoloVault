'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Clock, Eye, ArrowRight, Search } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  cover_image: string;
  category: string;
  reading_time: number;
  views: number;
  published_at: string;
  author_name: string;
}

export default function AstucesPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const response = await fetch('/api/blog?status=published');
      const data = await response.json();
      
      // Vérifier que data est un tableau
      if (Array.isArray(data)) {
        setPosts(data);
      } else {
        console.error('API returned non-array data:', data);
        setPosts([]);
      }
    } catch (error) {
      console.error('Error loading posts:', error);
      setPosts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(posts.map(p => p.category).filter(Boolean))];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-zinc-800">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <Link href="/" className="text-zinc-400 hover:text-white transition">
              ← Retour
            </Link>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            💡 Astuces & Guides
          </h1>
          <p className="text-xl text-zinc-400 max-w-2xl">
            Découvre nos meilleurs conseils pour lancer et développer ton projet solo
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="border-b border-zinc-800 bg-zinc-900/50">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
              <input
                type="text"
                placeholder="Rechercher un article..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-black border border-zinc-700 rounded-lg focus:outline-none focus:border-orange-500 transition"
              />
            </div>

            {/* Category Filter */}
            {categories.length > 0 && (
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 bg-black border border-zinc-700 rounded-lg focus:outline-none focus:border-orange-500 transition"
              >
                <option value="">Toutes les catégories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-2 border-orange-500 border-t-transparent" />
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-20">
            <h3 className="text-2xl font-bold mb-2">Aucun article trouvé</h3>
            <p className="text-zinc-400">
              {searchQuery || selectedCategory 
                ? 'Essaye avec d\'autres filtres' 
                : 'Les articles arrivent bientôt !'}
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <Link
                key={post.id}
                href={`/astuces/${post.slug}`}
                className="group bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-orange-500 transition"
              >
                {post.cover_image && (
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={post.cover_image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                  </div>
                )}
                
                <div className="p-6">
                  {post.category && (
                    <span className="inline-block px-3 py-1 bg-orange-500/10 border border-orange-500/30 text-orange-500 text-xs font-semibold rounded-full mb-3">
                      {post.category}
                    </span>
                  )}
                  
                  <h2 className="text-xl font-bold mb-2 group-hover:text-orange-500 transition">
                    {post.title}
                  </h2>
                  
                  {post.excerpt && (
                    <p className="text-zinc-400 text-sm mb-4 line-clamp-2">
                      {post.excerpt}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between text-xs text-zinc-500">
                    <div className="flex items-center gap-3">
                      {post.reading_time && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {post.reading_time} min
                        </span>
                      )}
                      {post.views > 0 && (
                        <span className="flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5" />
                          {post.views}
                        </span>
                      )}
                    </div>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
