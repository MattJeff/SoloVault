'use client';

import { useEffect, useState } from 'react';
import { Trophy, Star, Award } from 'lucide-react';
import { calculateLevel, getLevelTitle, BADGES, Badge } from '@/lib/gamification';

export default function GamificationBadge() {
  const [points, setPoints] = useState(0);
  const [level, setLevel] = useState(1);
  const [badges, setBadges] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    loadProgress();
  }, []);

  const loadProgress = () => {
    const savedPoints = localStorage.getItem('solovault_points');
    const savedBadges = localStorage.getItem('solovault_badges');

    if (savedPoints) {
      const pts = parseInt(savedPoints);
      setPoints(pts);
      setLevel(calculateLevel(pts));
    }

    if (savedBadges) {
      setBadges(JSON.parse(savedBadges));
    }
  };

  const earnedBadges = BADGES.filter(b => badges.includes(b.id));
  const rarityColors = {
    common: 'text-zinc-400 border-zinc-700',
    rare: 'text-blue-400 border-blue-700',
    epic: 'text-purple-400 border-purple-700',
    legendary: 'text-orange-400 border-orange-700'
  };

  if (!mounted) return null;

  return (
    <>
      {/* Compact Badge in Navbar */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg hover:border-orange-500 transition flex items-center gap-2"
      >
        <Trophy className="w-4 h-4 text-orange-500" />
        <div className="text-left">
          <div className="text-xs text-zinc-500">Niveau {level}</div>
          <div className="text-sm font-bold">{points} pts</div>
        </div>
        {badges.length > 0 && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center text-xs font-bold">
            {badges.length}
          </div>
        )}
      </button>

      {/* Expanded Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setIsOpen(false)}>
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-2xl w-full p-8" onClick={(e) => e.stopPropagation()}>
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold mb-2">
                {getLevelTitle(level)}
              </h2>
              <p className="text-zinc-400">
                Niveau {level} • {points} points
              </p>
            </div>

            {/* Badges Grid */}
            <div className="mb-8">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-orange-500" />
                Tes Badges ({badges.length}/{BADGES.length})
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {BADGES.map((badge) => {
                  const isEarned = badges.includes(badge.id);
                  return (
                    <div
                      key={badge.id}
                      className={`p-4 rounded-xl border-2 text-center transition ${
                        isEarned
                          ? `${rarityColors[badge.rarity]} bg-${badge.rarity === 'common' ? 'zinc' : badge.rarity === 'rare' ? 'blue' : badge.rarity === 'epic' ? 'purple' : 'orange'}-500/10`
                          : 'border-zinc-800 bg-zinc-900/50 opacity-40'
                      }`}
                    >
                      <div className="text-3xl mb-2">{badge.icon}</div>
                      <div className="text-xs font-bold mb-1">{badge.name}</div>
                      <div className="text-xs text-zinc-500">{badge.points} pts</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Actions to Earn Points */}
            <div className="bg-black border border-zinc-800 rounded-xl p-6">
              <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
                <Star className="w-4 h-4 text-orange-500" />
                Comment gagner plus de points
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-zinc-400">
                  <span>✉️ Inscription email</span>
                  <span className="text-orange-500">+10 pts</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>🎯 Compléter le quiz</span>
                  <span className="text-orange-500">+50 pts</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>💰 Utiliser le calculateur</span>
                  <span className="text-orange-500">+25 pts</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>📊 Télécharger la base</span>
                  <span className="text-orange-500">+200 pts</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>👥 Parrainer un ami</span>
                  <span className="text-orange-500">+50 pts</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="mt-6 w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg transition"
            >
              Continuer
            </button>
          </div>
        </div>
      )}
    </>
  );
}
