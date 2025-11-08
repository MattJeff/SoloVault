'use client';

import { Project } from '@/lib/types';
import { formatRevenue, getProjectIcon } from '@/lib/filters';
import { Users, User } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
}

export default function ProjectCard({ project, onClick }: ProjectCardProps) {
  const isSolo = project.stillSolo.toLowerCase().includes('yes');

  return (
    <div
      onClick={onClick}
      className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden cursor-pointer transition-all hover:border-orange-500 hover:-translate-y-2 hover:shadow-lg hover:shadow-orange-500/20"
    >
      {/* Preview Section */}
      <div className="h-48 bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-radial from-orange-500/10 via-transparent to-transparent" />
        
        <div className="relative z-10 w-16 h-16 bg-black border border-zinc-700 rounded-xl flex items-center justify-center text-3xl">
          {getProjectIcon(project.industry)}
        </div>
        
        <span className="absolute bottom-4 text-zinc-500 text-sm">
          Aperçu du projet
        </span>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-white">{project.name}</h3>
          <span className="text-orange-500 text-sm font-semibold">2025</span>
        </div>

        <p className="text-zinc-500 text-sm mb-3">{project.productType}</p>

        {/* Revenue Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-orange-500/10 border border-orange-500/30 rounded-lg text-orange-500 font-semibold text-lg mb-4">
          💰 ${formatRevenue(project.revenue)}/an
        </div>

        {/* Description */}
        <p className="text-zinc-400 text-sm mb-4 line-clamp-3 leading-relaxed">
          {project.solution}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {project.industry && (
            <span className="px-3 py-1 bg-black border border-zinc-700 rounded-md text-xs text-zinc-300">
              {project.industry}
            </span>
          )}
          {project.mvp && (
            <span className="px-3 py-1 bg-black border border-zinc-700 rounded-md text-xs text-zinc-300">
              ⚡ {project.mvp}
            </span>
          )}
          {project.growth1 && (
            <span className="px-3 py-1 bg-black border border-zinc-700 rounded-md text-xs text-zinc-300">
              {project.growth1}
            </span>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-zinc-800 px-6 py-4 flex justify-between items-center">
        <span className="text-sm text-zinc-500 flex items-center gap-2">
          👨‍💻 {project.developer}
        </span>
        
        <span className="text-orange-500 text-sm font-medium flex items-center gap-1">
          Voir détails
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </span>
      </div>
    </div>
  );
}
