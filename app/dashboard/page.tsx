'use client';

import { useState, useMemo } from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import FilterBar from '@/components/FilterBar';
import ProjectCard from '@/components/ProjectCard';
import ProjectModal from '@/components/ProjectModal';
import EmailGate from '@/components/EmailGate';
import DownloadButton from '@/components/DownloadButton';
import { Project } from '@/lib/types';
import { filterProjects } from '@/lib/filters';
import projectsData from '@/data/projects.json';

export default function HomePage() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [filters, setFilters] = useState({
    revenue: 'all',
    mvp: null as string | null,
    solo: false,
    search: ''
  });

  // Filtrer les projets
  const filteredProjects = useMemo(() => {
    return filterProjects(projectsData as Project[], filters);
  }, [filters]);

  return (
    <>
      <EmailGate />
      
      <div className="min-h-screen bg-black text-white">
        <Navbar />
        <HeroSection totalProjects={projectsData.length} />
        
        <FilterBar 
          filters={filters}
          onFilterChange={setFilters}
        />

        <section className="py-12 px-4 pb-32">
          <div className="container mx-auto max-w-7xl">
            {filteredProjects.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-bold mb-2">Aucun projet trouvé</h3>
                <p className="text-zinc-400">Essayez de modifier vos filtres</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onClick={() => setSelectedProject(project)}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Download Button */}
        <DownloadButton 
          filteredProjects={filteredProjects}
          totalProjects={projectsData.length}
        />

        {selectedProject && (
          <ProjectModal
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </div>
    </>
  );
}
