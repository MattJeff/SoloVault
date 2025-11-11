'use client';

import { useState, useEffect } from 'react';
import { Users, Copy, Share2, Mail, MessageCircle, Check, Gift, Calendar } from 'lucide-react';

interface ReferralSystemProps {
  onClose: () => void;
}

interface ReferralStats {
  referralCode: string;
  referralsCount: number;
  referredUsers: string[];
  callEarned: boolean;
}

export default function ReferralSystem({ onClose }: ReferralSystemProps) {
  const [stats, setStats] = useState<ReferralStats>({
    referralCode: '',
    referralsCount: 0,
    referredUsers: [],
    callEarned: false
  });
  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState('');

  useEffect(() => {
    loadReferralStats();
  }, []);

  const loadReferralStats = async () => {
    const userEmail = localStorage.getItem('solovault_email');
    if (!userEmail) return;

    setEmail(userEmail);

    try {
      const response = await fetch(`/api/referral/stats?email=${encodeURIComponent(userEmail)}`);
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error loading referral stats:', error);
    }
  };

  const getReferralLink = () => {
    return `${window.location.origin}?ref=${stats.referralCode}`;
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(getReferralLink());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const shareViaEmail = () => {
    const subject = encodeURIComponent('Découvre SoloVault - 51+ Projets Solo à Succès');
    const body = encodeURIComponent(
      `Salut !\n\nJe viens de découvrir SoloVault, une base de données de 51+ projets SaaS développés par des solopreneurs qui génèrent plus de 10K€/mois.\n\nUtilise mon lien pour t'inscrire :\n${getReferralLink()}\n\nÀ très vite !`
    );
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  const shareViaWhatsApp = () => {
    const text = encodeURIComponent(
      `Découvre SoloVault - 51+ Projets Solo à Succès 🚀\n\n${getReferralLink()}`
    );
    window.open(`https://wa.me/?text=${text}`);
  };

  const shareViaTwitter = () => {
    const text = encodeURIComponent(
      `Je viens de découvrir @SoloVault - une base de 51+ projets SaaS solo qui génèrent +10K€/mois 🚀\n\nRejoins-moi avec mon lien de parrainage :`
    );
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(getReferralLink())}`);
  };

  const progress = Math.min((stats.referralsCount / 3) * 100, 100);
  const referralsNeeded = Math.max(3 - stats.referralsCount, 0);

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Parrainage</h2>
              <p className="text-zinc-400 text-sm">Invite tes amis et gagne des récompenses</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 bg-zinc-800 rounded-lg flex items-center justify-center hover:bg-zinc-700 transition"
          >
            ✕
          </button>
        </div>

        {/* Call Gratuit Reward */}
        <div className={`mb-8 p-6 rounded-xl border-2 ${
          stats.callEarned
            ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-500'
            : 'bg-gradient-to-r from-orange-500/10 to-pink-500/10 border-orange-500/30'
        }`}>
          <div className="flex items-center gap-4 mb-4">
            <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${
              stats.callEarned ? 'bg-green-500/20' : 'bg-orange-500/20'
            }`}>
              {stats.callEarned ? (
                <Gift className="w-8 h-8 text-green-500" />
              ) : (
                <Calendar className="w-8 h-8 text-orange-500" />
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-1">
                {stats.callEarned ? '🎉 Call Gratuit Débloqué !' : '🎁 Débloque un Call Gratuit'}
              </h3>
              <p className="text-zinc-400 text-sm">
                {stats.callEarned
                  ? 'Félicitations ! Tu as gagné 30 min de call gratuit avec nous'
                  : 'Parraine 3 amis et gagne 30 minutes de call stratégie gratuit'
                }
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          {!stats.callEarned && (
            <>
              <div className="w-full bg-zinc-800 rounded-full h-3 mb-3">
                <div
                  className="bg-gradient-to-r from-orange-500 to-pink-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">
                  {stats.referralsCount} / 3 parrainages
                </span>
                <span className="text-orange-500 font-semibold">
                  {referralsNeeded === 0 ? 'Objectif atteint !' : `Plus que ${referralsNeeded} !`}
                </span>
              </div>
            </>
          )}

          {stats.callEarned && (
            <a
              href="https://cal.com/solovault/30min"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full mt-4 px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg transition flex items-center justify-center gap-2"
            >
              <Calendar className="w-5 h-5" />
              Réserver mon call gratuit
            </a>
          )}
        </div>

        {/* Referral Link */}
        <div className="mb-8">
          <h3 className="text-lg font-bold mb-4">Ton lien de parrainage</h3>
          <div className="flex gap-2">
            <input
              type="text"
              value={getReferralLink()}
              readOnly
              className="flex-1 px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-sm"
            />
            <button
              onClick={copyToClipboard}
              className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition flex items-center gap-2"
            >
              {copied ? (
                <>
                  <Check className="w-5 h-5" />
                  Copié !
                </>
              ) : (
                <>
                  <Copy className="w-5 h-5" />
                  Copier
                </>
              )}
            </button>
          </div>
        </div>

        {/* Share Options */}
        <div className="mb-8">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Share2 className="w-5 h-5 text-orange-500" />
            Partager sur
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={shareViaEmail}
              className="p-4 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-xl transition flex items-center gap-3"
            >
              <Mail className="w-6 h-6 text-blue-400" />
              <div className="text-left">
                <div className="font-semibold">Email</div>
                <div className="text-xs text-zinc-400">Envoyer par email</div>
              </div>
            </button>

            <button
              onClick={shareViaWhatsApp}
              className="p-4 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-xl transition flex items-center gap-3"
            >
              <MessageCircle className="w-6 h-6 text-green-400" />
              <div className="text-left">
                <div className="font-semibold">WhatsApp</div>
                <div className="text-xs text-zinc-400">Partager via WhatsApp</div>
              </div>
            </button>

            <button
              onClick={shareViaTwitter}
              className="p-4 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-xl transition flex items-center gap-3"
            >
              <svg className="w-6 h-6 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              <div className="text-left">
                <div className="font-semibold">X (Twitter)</div>
                <div className="text-xs text-zinc-400">Partager sur X</div>
              </div>
            </button>
          </div>
        </div>

        {/* Referral Stats */}
        <div className="bg-black border border-zinc-800 rounded-xl p-6">
          <h3 className="text-lg font-bold mb-4">Tes parrainages</h3>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="text-center p-4 bg-zinc-900 rounded-lg">
              <div className="text-3xl font-bold text-orange-500">{stats.referralsCount}</div>
              <div className="text-sm text-zinc-400">Amis invités</div>
            </div>
            <div className="text-center p-4 bg-zinc-900 rounded-lg">
              <div className="text-3xl font-bold text-purple-500">
                {stats.referralsCount * 50}
              </div>
              <div className="text-sm text-zinc-400">Points gagnés</div>
            </div>
          </div>

          {stats.referredUsers.length > 0 ? (
            <div>
              <h4 className="text-sm font-semibold mb-3 text-zinc-400">Utilisateurs parrainés</h4>
              <div className="space-y-2">
                {stats.referredUsers.map((user, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-zinc-900 rounded-lg">
                    <div className="w-8 h-8 bg-orange-500/20 rounded-full flex items-center justify-center">
                      <Users className="w-4 h-4 text-orange-500" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">
                        {user.split('@')[0].slice(0, 2)}***@{user.split('@')[1]}
                      </div>
                      <div className="text-xs text-zinc-500">+50 points</div>
                    </div>
                    <Check className="w-5 h-5 text-green-500" />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-zinc-500">
              Aucun parrainage pour le moment. Partage ton lien pour commencer !
            </div>
          )}
        </div>

        <div className="mt-6 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-xl p-4 text-center">
          <p className="text-sm text-zinc-300">
            💡 <strong>Astuce :</strong> Chaque ami qui s'inscrit avec ton lien te rapporte <strong className="text-orange-500">+50 points</strong> et te rapproche du call gratuit !
          </p>
        </div>
      </div>
    </div>
  );
}
