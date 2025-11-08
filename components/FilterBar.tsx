'use client';

import { Search } from 'lucide-react';

interface FilterBarProps {
  filters: {
    revenue: string;
    mvp: string | null;
    solo: boolean;
    search: string;
  };
  onFilterChange: (filters: any) => void;
}

export default function FilterBar({ filters, onFilterChange }: FilterBarProps) {
  const updateFilter = (key: string, value: any) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const toggleFilter = (key: 'mvp', value: string) => {
    const newValue = filters[key] === value ? null : value;
    updateFilter(key, newValue);
  };

  return (
    <div className="sticky top-16 z-40 bg-black border-t border-b border-zinc-800 py-6">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
            <input
              type="text"
              placeholder="Rechercher un projet, une industrie, un problème..."
              value={filters.search}
              onChange={(e) => updateFilter('search', e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 transition"
            />
          </div>
        </div>

        {/* Filter Tags */}
        <div className="flex flex-wrap gap-2 justify-center">
          {/* Revenue Filters */}
          {['all', '1M+', '500K-1M', '100K-500K'].map((rev) => (
            <button
              key={rev}
              onClick={() => updateFilter('revenue', rev)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filters.revenue === rev
                  ? 'bg-orange-500 text-white'
                  : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:border-orange-500'
              }`}
            >
              {rev === 'all' ? '💰 Tous les revenus' : `${rev === '1M+' ? '🚀' : rev === '500K-1M' ? '💎' : '⭐'} ${rev}/an`}
            </button>
          ))}

          <div className="w-px h-8 bg-zinc-800" />

          {/* MVP Filters */}
          <button
            onClick={() => toggleFilter('mvp', 'weekend')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filters.mvp === 'weekend'
                ? 'bg-orange-500 text-white'
                : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:border-orange-500'
            }`}
          >
            ⚡ MVP Weekend
          </button>
          
          <button
            onClick={() => toggleFilter('mvp', 'week')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filters.mvp === 'week'
                ? 'bg-orange-500 text-white'
                : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:border-orange-500'
            }`}
          >
            🏃 MVP Semaine
          </button>

          <div className="w-px h-8 bg-zinc-800" />

          {/* Solo Filter */}
          <button
            onClick={() => updateFilter('solo', !filters.solo)}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filters.solo
                ? 'bg-orange-500 text-white'
                : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:border-orange-500'
            }`}
          >
            👤 Solo uniquement
          </button>
        </div>
      </div>
    </div>
  );
}
