'use client';

import Link from 'next/link';
import Image from 'next/image';
import { TrendingUp, Users, Zap } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-zinc-800">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <span className="text-xl font-bold">SoloVault</span>
            </div>
            
            <div className="flex items-center gap-6">
              <Link href="/dashboard" className="text-zinc-400 hover:text-white transition">
                Projets
              </Link>
              <Link href="/dashboard" className="text-zinc-400 hover:text-white transition">
                À propos
              </Link>
              <Link href="/dashboard" className="text-zinc-400 hover:text-white transition">
                Contact
              </Link>
              <Link 
                href="/dashboard"
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium transition"
              >
                📥 Télécharger (19€)
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-full px-4 py-2 mb-8">
              <span className="text-orange-500">🔥</span>
              <span className="text-sm text-orange-500 font-medium">Base de données exclusive</span>
            </div>
            
            <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
              51+ Projets Solo à Succès
            </h1>
            
            <p className="text-xl text-zinc-400 mb-4 max-w-3xl mx-auto">
              Découvrez les projets SaaS développés par des solopreneurs qui génèrent{' '}
              <span className="text-orange-500 font-semibold">plus de 10K€/mois</span>. 
              Analysez leurs stratégies, technologies et chemins vers le succès.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 text-center">
              <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-orange-500" />
              </div>
              <div className="text-4xl font-bold mb-2">€21M+</div>
              <div className="text-zinc-400">Revenue annuel total</div>
            </div>
            
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 text-center">
              <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-orange-500" />
              </div>
              <div className="text-4xl font-bold mb-2">80%</div>
              <div className="text-zinc-400">Encore en solo</div>
            </div>
            
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 text-center">
              <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-orange-500" />
              </div>
              <div className="text-4xl font-bold mb-2">2 sem.</div>
              <div className="text-zinc-400">Temps MVP moyen</div>
            </div>
          </div>

          {/* CTA Badge */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 text-sm text-zinc-400 mb-8">
              <span className="text-orange-500">🔥</span>
              <span>Accès gratuit aux 10 premiers projets • Base complète à 19€</span>
            </div>
          </div>

          {/* Preview Image */}
          <div className="relative rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
            <Image 
              src="/exemple_landing.png" 
              alt="Dashboard Preview" 
              width={1200}
              height={700}
              className="w-full h-auto"
              priority
            />
            
            {/* Overlay CTA */}
            <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
              <div className="text-center">
                <Link 
                  href="/dashboard"
                  className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-xl font-semibold text-lg transition shadow-lg shadow-orange-500/20"
                >
                  🚀 Accéder au Dashboard
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-zinc-900/30">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl font-bold text-center mb-16">
            Tout ce dont vous avez besoin pour réussir
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-black border border-zinc-800 rounded-2xl p-8">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-bold mb-3">Données détaillées</h3>
              <p className="text-zinc-400">
                Revenue, MVP speed, stack technique, stratégies de croissance et bien plus pour chaque projet.
              </p>
            </div>
            
            <div className="bg-black border border-zinc-800 rounded-2xl p-8">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-xl font-bold mb-3">Filtres avancés</h3>
              <p className="text-zinc-400">
                Trouvez exactement ce que vous cherchez : par revenue, industrie, type de produit, et plus.
              </p>
            </div>
            
            <div className="bg-black border border-zinc-800 rounded-2xl p-8">
              <div className="text-4xl mb-4">💡</div>
              <h3 className="text-xl font-bold mb-3">Inspiration garantie</h3>
              <p className="text-zinc-400">
                Découvrez comment des solopreneurs ont transformé une idée en business rentable.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/5 border border-orange-500/20 rounded-3xl p-12 text-center">
            <h2 className="text-4xl font-bold mb-4">
              Prêt à découvrir les secrets des solopreneurs ?
            </h2>
            <p className="text-xl text-zinc-400 mb-8">
              Rejoignez des centaines d'entrepreneurs qui utilisent SoloVault pour trouver leur prochaine idée.
            </p>
            <Link 
              href="/dashboard"
              className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-xl font-semibold text-lg transition"
            >
              🚀 Commencer gratuitement
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-zinc-800">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <span className="text-xl font-bold">SoloVault</span>
            </div>
            
            <div className="text-zinc-400 text-sm">
              © 2024 SoloVault. Tous droits réservés.
            </div>
            
            <div className="flex gap-6">
              <Link href="/dashboard" className="text-zinc-400 hover:text-white transition text-sm">
                Contact
              </Link>
              <Link href="/dashboard" className="text-zinc-400 hover:text-white transition text-sm">
                Mentions légales
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
