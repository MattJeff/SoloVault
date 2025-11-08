'use client';

import Link from 'next/link';
import { Sparkles, Rocket, Users, Code, Brain, Zap } from 'lucide-react';
import Navbar from '@/components/Navbar';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      
      <div className="pt-24 pb-20 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-full px-4 py-2 mb-6">
              <Sparkles className="w-4 h-4 text-orange-500" />
              <span className="text-sm text-orange-500 font-medium">Notre Histoire</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              À propos de <span className="text-orange-500">SoloVault</span>
            </h1>
          </div>

          {/* Story */}
          <div className="prose prose-invert prose-lg max-w-none mb-16">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 md:p-12">
              <h2 className="text-3xl font-bold mb-6 text-white">L'histoire d'un entrepreneur passionné</h2>
              
              <p className="text-zinc-300 leading-relaxed mb-6">
                À 24 ans, après avoir observé des centaines de solopreneurs réussir à créer des SaaS rentables, 
                j'ai décidé de lancer <span className="text-orange-500 font-semibold">ma propre agence de création de SaaS</span> en France.
              </p>

              <p className="text-zinc-300 leading-relaxed mb-6">
                Mon constat était simple : <span className="font-semibold text-white">les technologies d'IA ont révolutionné 
                le développement</span>. Ce qui prenait des mois peut maintenant être accompli en quelques semaines. 
                Mais beaucoup d'entrepreneurs ne savent pas par où commencer.
              </p>

              <div className="bg-black/50 border-l-4 border-orange-500 p-6 my-8 rounded-r-lg">
                <p className="text-lg italic text-zinc-200">
                  "J'ai créé SoloVault pour démocratiser l'accès aux success stories des solopreneurs 
                  et inspirer la prochaine génération d'entrepreneurs tech."
                </p>
              </div>

              <h3 className="text-2xl font-bold mb-4 text-white">Notre Mission</h3>
              <p className="text-zinc-300 leading-relaxed mb-6">
                Chez <span className="text-orange-500 font-semibold">SoloVault</span>, nous accompagnons les entrepreneurs 
                dans la création de leurs SaaS de A à Z. De l'idéation à la mise en production, en passant par le design, 
                le développement et le déploiement.
              </p>

              <h3 className="text-2xl font-bold mb-4 text-white">Notre Approche</h3>
              <p className="text-zinc-300 leading-relaxed mb-6">
                Nous utilisons les <span className="font-semibold text-white">dernières technologies d'IA</span> et les 
                frameworks les plus performants (Next.js, React, TypeScript, TailwindCSS) pour créer des applications 
                modernes, rapides et scalables.
              </p>

              <p className="text-zinc-300 leading-relaxed">
                Notre objectif ? Vous permettre de <span className="text-orange-500 font-semibold">lancer votre MVP 
                en quelques semaines</span> au lieu de plusieurs mois, tout en gardant une qualité professionnelle.
              </p>
            </div>
          </div>

          {/* Services */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-12">Ce que nous faisons</h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center mb-4">
                  <Brain className="w-6 h-6 text-orange-500" />
                </div>
                <h3 className="text-xl font-bold mb-3">Idéation & Stratégie</h3>
                <p className="text-zinc-400">
                  Nous vous aidons à valider votre idée, définir votre MVP et établir une roadmap claire.
                </p>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center mb-4">
                  <Code className="w-6 h-6 text-orange-500" />
                </div>
                <h3 className="text-xl font-bold mb-3">Développement Full-Stack</h3>
                <p className="text-zinc-400">
                  Création complète de votre SaaS avec les technologies les plus modernes et performantes.
                </p>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center mb-4">
                  <Rocket className="w-6 h-6 text-orange-500" />
                </div>
                <h3 className="text-xl font-bold mb-3">Déploiement & Suivi</h3>
                <p className="text-zinc-400">
                  Mise en production, monitoring et accompagnement post-lancement pour assurer votre succès.
                </p>
              </div>
            </div>
          </div>

          {/* Technologies */}
          <div className="bg-gradient-to-br from-orange-900/20 to-orange-950/20 border border-orange-500/30 rounded-2xl p-8 md:p-12 mb-16">
            <div className="flex items-center gap-3 mb-6">
              <Zap className="w-8 h-8 text-orange-500" />
              <h2 className="text-3xl font-bold">Technologies de pointe</h2>
            </div>
            
            <p className="text-zinc-300 mb-6">
              Nous utilisons les mêmes technologies que les plus grandes startups tech :
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['Next.js 14', 'React 18', 'TypeScript', 'TailwindCSS', 'OpenAI', 'Stripe', 'Vercel', 'PostgreSQL'].map((tech) => (
                <div key={tech} className="bg-black/50 border border-orange-500/20 rounded-lg p-3 text-center font-semibold">
                  {tech}
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Prêt à lancer votre SaaS ?</h2>
            <p className="text-xl text-zinc-400 mb-8">
              Discutons de votre projet et transformons votre idée en réalité
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition"
              >
                Demander un devis
              </Link>
              <Link
                href="/dashboard"
                className="px-8 py-4 bg-zinc-900 border border-zinc-800 hover:border-orange-500 text-white font-semibold rounded-lg transition"
              >
                Explorer les projets
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
