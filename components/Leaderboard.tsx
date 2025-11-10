'use client';

import { useState, useEffect } from 'react';
import { Trophy, Medal, Crown, X } from 'lucide-react';
import { getLevelTitle, calculateLevel } from '@/lib/gamification';

interface LeaderboardEntry {
  email: string;
  points: number;
  level: number;
  badges: string[];
}

interface LeaderboardProps {
  onClose: () => void;
}

export default function Leaderboard({ onClose }: LeaderboardProps) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    loadLeaderboard();
    const email = localStorage.getItem('solovault_email');
    if (email) setUserEmail(email);
  }, []);

  const loadLeaderboard = async () => {
    try {
      const response = await fetch('/api/leaderboard');
      const data = await response.json();
      setEntries(data);
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Crown className="w-6 h-6 text-yellow-500" />;
      case 1:
        return <Medal className="w-6 h-6 text-zinc-400" />;
      case 2:
        return <Medal className="w-6 h-6 text-orange-600" />;
      default:
        return <span className="text-zinc-500 font-bold">#{index + 1}</span>;
    }
  };

  const maskEmail = (email: string) => {
    const [name, domain] = email.split('@');
    return `${name.slice(0, 2)}${'*'.repeat(Math.max(0, name.length - 2))}@${domain}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">🏆 Leaderboard</h2>
              <p className="text-zinc-400 text-sm">Top solopreneurs SoloVault</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 bg-zinc-800 rounded-lg flex items-center justify-center hover:bg-zinc-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-orange-500 border-t-transparent" />
          </div>
        ) : entries.length === 0 ? (
          <div className="text-center py-12 text-zinc-500">
            Sois le premier à rejoindre le leaderboard ! 🚀
          </div>
        ) : (
          <div className="space-y-3">
            {entries.slice(0, 10).map((entry, index) => {
              const isCurrentUser = entry.email === userEmail;
              return (
                <div
                  key={entry.email}
                  className={`flex items-center gap-4 p-4 rounded-xl transition ${
                    index < 3
                      ? 'bg-gradient-to-r from-orange-500/10 to-orange-600/5 border border-orange-500/30'
                      : 'bg-zinc-800/50 border border-zinc-800'
                  } ${isCurrentUser ? 'ring-2 ring-orange-500' : ''}`}
                >
                  <div className="w-12 flex items-center justify-center">
                    {getRankIcon(index)}
                  </div>

                  <div className="flex-1">
                    <div className="font-semibold flex items-center gap-2">
                      {isCurrentUser && <span className="text-orange-500">Toi</span>}
                      <span className="text-sm text-zinc-400">
                        {maskEmail(entry.email)}
                      </span>
                    </div>
                    <div className="text-sm text-zinc-500">
                      {getLevelTitle(entry.level)} • {entry.badges.length} badges
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-2xl font-bold text-orange-500">
                      {entry.points}
                    </div>
                    <div className="text-xs text-zinc-500">points</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-8 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-xl p-6 text-center">
          <p className="text-sm text-zinc-300 mb-4">
            💡 <strong>Astuce :</strong> Gagne plus de points en complétant le quiz, téléchargeant la base et parrainant des amis !
          </p>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-purple-500 hover:bg-purple-600 text-white font-semibold rounded-lg transition"
          >
            Continuer à jouer
          </button>
        </div>
      </div>
    </div>
  );
}
