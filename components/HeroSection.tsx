'use client';

import { TrendingUp, Users, Zap } from 'lucide-react';

interface HeroSectionProps {
  totalProjects: number;
}

export default function HeroSection({ totalProjects }: HeroSectionProps) {
  return (
    <section className="relative py-20 px-4 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-orange-500/5 to-transparent" />
      
      <div className="container mx-auto max-w-7xl relative">
        {/* Title */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/10 border border-orange-500/30 rounded-full text-orange-500 text-sm font-semibold mb-4">
            <Zap className="w-4 h-4" />
            Base de données exclusive
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
            {totalProjects}+ Projets Solo à Succès
          </h1>
          
          <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
            Découvrez les projets SaaS développés par des solopreneurs qui génèrent 
            <span className="text-orange-500 font-semibold"> plus de 10K€/mois</span>. 
            Analysez leurs stratégies, technologies et chemins vers le succès.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="w-16 h-16 bg-zinc-900 border border-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-orange-500" />
            </div>
            <div className="text-3xl font-bold mb-2">€21M+</div>
            <div className="text-zinc-400">Revenue annuel total</div>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-zinc-900 border border-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-orange-500" />
            </div>
            <div className="text-3xl font-bold mb-2">80%</div>
            <div className="text-zinc-400">Encore en solo</div>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-zinc-900 border border-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-orange-500" />
            </div>
            <div className="text-3xl font-bold mb-2">2 sem.</div>
            <div className="text-zinc-400">Temps MVP moyen</div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-zinc-400 mb-4">
            🔥 Accès gratuit aux 10 premiers projets • Base complète à 19€
          </p>
        </div>
      </div>
    </section>
  );
}
