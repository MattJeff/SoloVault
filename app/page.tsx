'use client';

import Link from 'next/link';
import Image from 'next/image';
import { TrendingUp, Users, Zap, Sparkles, Calculator, FileText, Trophy, UserPlus } from 'lucide-react';
import Navbar from '@/components/Navbar';
import SaaSQuiz from '@/components/SaaSQuiz';
import ExitIntentPopup from '@/components/ExitIntentPopup';
import SocialProofNotifications from '@/components/SocialProofNotifications';
import RevenueCalculator from '@/components/RevenueCalculator';
import ContentUpgrades from '@/components/ContentUpgrades';
import Leaderboard from '@/components/Leaderboard';
import ReferralSystem from '@/components/ReferralSystem';
import { useState, useEffect } from 'react';

export default function LandingPage() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [mounted, setMounted] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
  const [showContentUpgrades, setShowContentUpgrades] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showReferral, setShowReferral] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('solovault_theme') as 'light' | 'dark';
    if (savedTheme) {
      setTheme(savedTheme);
    }

    // Écouter les changements de thème
    const handleStorageChange = () => {
      const newTheme = localStorage.getItem('solovault_theme') as 'light' | 'dark';
      if (newTheme) {
        setTheme(newTheme);
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Vérifier périodiquement le thème (pour détecter les changements dans la même page)
    const interval = setInterval(() => {
      const currentTheme = localStorage.getItem('solovault_theme') as 'light' | 'dark';
      if (currentTheme && currentTheme !== theme) {
        setTheme(currentTheme);
      }
    }, 100);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [theme]);

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar variant="landing" />

      {/* Hero Section */}
      <section className="pt-24 md:pt-32 pb-12 md:pb-20 px-4 md:px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8 md:mb-12">
            <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-full px-3 md:px-4 py-1.5 md:py-2 mb-6 md:mb-8">
              <span className="text-orange-500">🔥</span>
              <span className="text-xs md:text-sm text-orange-500 font-medium">Base de données exclusive</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 md:mb-6 leading-tight px-4">
              51+ Projets Solo à Succès
            </h1>
            
            <p className="text-base md:text-xl text-zinc-400 mb-4 max-w-3xl mx-auto px-4">
              Découvrez les projets SaaS développés par des solopreneurs qui génèrent{' '}
              <span className="text-orange-500 font-semibold">plus de 10K€/mois</span>. 
              Analysez leurs stratégies, technologies et chemins vers le succès.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 mb-8 md:mb-16">
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 md:p-8 text-center">
              <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-orange-500" />
              </div>
              <div className="text-4xl font-bold mb-2">€21M+</div>
              <div className="text-zinc-400">Revenue annuel total</div>
            </div>
            
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 md:p-8 text-center">
              <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-orange-500" />
              </div>
              <div className="text-4xl font-bold mb-2">80%</div>
              <div className="text-zinc-400">Encore en solo</div>
            </div>
            
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 md:p-8 text-center">
              <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-orange-500" />
              </div>
              <div className="text-4xl font-bold mb-2">2 sem.</div>
              <div className="text-zinc-400">Temps MVP moyen</div>
            </div>
          </div>

          {/* Quiz CTA */}
          <div className="text-center mb-12">
            <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-2xl p-8 mb-8">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Sparkles className="w-6 h-6 text-purple-500" />
                <h3 className="text-2xl font-bold">Quel SaaS est fait pour TOI ?</h3>
              </div>
              <p className="text-zinc-400 mb-6">
                Réponds à 5 questions et découvre le type de SaaS qui correspond parfaitement à ton profil
              </p>
              <button
                onClick={() => setShowQuiz(true)}
                className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold rounded-xl transition shadow-lg shadow-purple-500/20"
              >
                🎯 Faire le quiz (2 min)
              </button>
            </div>

            <div className="inline-flex items-center gap-2 text-sm text-zinc-400">
              <span className="text-orange-500">🔥</span>
              <span>Accès gratuit aux 10 premiers projets • Base complète à 19€</span>
            </div>
          </div>

          {/* Preview Image */}
          <div className="relative rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
            {mounted && (
              <Image
                src={theme === 'dark' ? "/exemple_landing.png" : "/lightmode_image.png"}
                alt="Dashboard Preview - SoloVault"
                width={1200}
                height={700}
                className="w-full h-auto"
                priority
              />
            )}
            
            {/* Overlay CTA */}
            <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8 z-20">
              <div className="text-center">
                <Link 
                  href="/dashboard"
                  className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 md:px-8 py-3 md:py-4 rounded-xl font-semibold text-base md:text-lg transition shadow-lg shadow-orange-500/20"
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

      {/* Tools & Resources Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl font-bold text-center mb-4">
            Outils & Ressources Gratuits
          </h2>
          <p className="text-zinc-400 text-center mb-16 max-w-2xl mx-auto">
            Accède à des outils exclusifs pour valider ton idée et planifier ton lancement
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Revenue Calculator */}
            <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-2 border-blue-500/30 rounded-2xl p-6 hover:border-blue-500 transition cursor-pointer"
              onClick={() => setShowCalculator(true)}>
              <div className="w-14 h-14 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4">
                <Calculator className="w-7 h-7 text-blue-500" />
              </div>
              <h3 className="text-xl font-bold mb-2">Calculateur Revenue</h3>
              <p className="text-zinc-400 text-sm mb-4">
                Projette ton MRR et ARR
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowCalculator(true);
                }}
                className="w-full py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition text-sm"
              >
                Calculer
              </button>
            </div>

            {/* Content Upgrades */}
            <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-2 border-green-500/30 rounded-2xl p-6 hover:border-green-500 transition cursor-pointer"
              onClick={() => setShowContentUpgrades(true)}>
              <div className="w-14 h-14 bg-green-500/20 rounded-xl flex items-center justify-center mb-4">
                <FileText className="w-7 h-7 text-green-500" />
              </div>
              <h3 className="text-xl font-bold mb-2">Templates Gratuits</h3>
              <p className="text-zinc-400 text-sm mb-4">
                Checklist MVP + Pitch Deck
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowContentUpgrades(true);
                }}
                className="w-full py-2.5 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition text-sm"
              >
                Télécharger
              </button>
            </div>

            {/* Referral System */}
            <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/5 border-2 border-purple-500/30 rounded-2xl p-6 hover:border-purple-500 transition cursor-pointer"
              onClick={() => setShowReferral(true)}>
              <div className="w-14 h-14 bg-purple-500/20 rounded-xl flex items-center justify-center mb-4">
                <UserPlus className="w-7 h-7 text-purple-500" />
              </div>
              <h3 className="text-xl font-bold mb-2">Parrainage</h3>
              <p className="text-zinc-400 text-sm mb-4">
                Call gratuit 30 min 🎁
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowReferral(true);
                }}
                className="w-full py-2.5 bg-purple-500 hover:bg-purple-600 text-white font-semibold rounded-lg transition text-sm"
              >
                Parrainer
              </button>
            </div>

            {/* Leaderboard */}
            <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/5 border-2 border-orange-500/30 rounded-2xl p-6 hover:border-orange-500 transition cursor-pointer"
              onClick={() => setShowLeaderboard(true)}>
              <div className="w-14 h-14 bg-orange-500/20 rounded-xl flex items-center justify-center mb-4">
                <Trophy className="w-7 h-7 text-orange-500" />
              </div>
              <h3 className="text-xl font-bold mb-2">Leaderboard</h3>
              <p className="text-zinc-400 text-sm mb-4">
                Top solopreneurs
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowLeaderboard(true);
                }}
                className="w-full py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition text-sm"
              >
                Voir classement
              </button>
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
              <Link href="/contact" className="text-zinc-400 hover:text-white transition text-sm">
                Contact
              </Link>
              <Link href="/about" className="text-zinc-400 hover:text-white transition text-sm">
                À propos
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Growth Marketing Components */}
      {showQuiz && <SaaSQuiz onClose={() => setShowQuiz(false)} />}
      <ExitIntentPopup />
      <SocialProofNotifications />

      {/* Gamification & Tools */}
      {showCalculator && <RevenueCalculator onClose={() => setShowCalculator(false)} />}
      {showContentUpgrades && <ContentUpgrades onClose={() => setShowContentUpgrades(false)} />}
      {showLeaderboard && <Leaderboard onClose={() => setShowLeaderboard(false)} />}
      {showReferral && <ReferralSystem onClose={() => setShowReferral(false)} />}
    </div>
  );
}
