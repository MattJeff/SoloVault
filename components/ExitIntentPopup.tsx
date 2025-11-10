'use client';

import { useState, useEffect } from 'react';
import { X, Gift, ArrowRight } from 'lucide-react';

export default function ExitIntentPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    // Vérifier si déjà montré dans cette session
    const shown = sessionStorage.getItem('exit_popup_shown');
    if (shown) return;

    const handleMouseLeave = (e: MouseEvent) => {
      // Détecter quand la souris quitte par le haut de la page
      if (e.clientY <= 0 && !hasShown) {
        setIsOpen(true);
        setHasShown(true);
        sessionStorage.setItem('exit_popup_shown', 'true');
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [hasShown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);

    try {
      await fetch('/api/save-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: 'Exit Intent',
          lastName: 'Lead',
          email,
          source: 'Exit Intent Popup',
          page: typeof window !== 'undefined' ? window.location.pathname : '/'
        })
      });

      // Télécharger automatiquement le lead magnet
      alert('✅ Check ton email ! Le guide "5 idées SaaS validées" arrive dans 1 minute 🚀');
      setIsOpen(false);

    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-zinc-900 border-2 border-orange-500 rounded-2xl max-w-md w-full p-8 animate-bounce-in">
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 w-10 h-10 bg-zinc-800 rounded-lg flex items-center justify-center hover:bg-zinc-700 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon */}
        <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <Gift className="w-8 h-8 text-white" />
        </div>

        {/* Title */}
        <h2 className="text-3xl font-bold text-center mb-2">
          Attends ! 🎁
        </h2>
        <p className="text-zinc-400 text-center mb-6">
          Avant de partir, reçois gratuitement notre guide
        </p>

        {/* Offer */}
        <div className="bg-gradient-to-r from-orange-500/10 to-orange-600/5 border border-orange-500/30 rounded-xl p-6 mb-6">
          <h3 className="font-bold text-lg mb-3 text-orange-500">
            "5 Idées SaaS Validées à Lancer en 2025"
          </h3>
          <ul className="space-y-2 text-sm text-zinc-300">
            <li>✅ Validation du marché prouvée</li>
            <li>✅ Budget de démarrage estimé</li>
            <li>✅ Stack technique recommandée</li>
            <li>✅ Stratégies de monétisation</li>
          </ul>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ton@email.com"
            className="w-full px-4 py-3 bg-black border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 transition mb-4"
            autoFocus
            required
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSubmitting ? 'Envoi...' : (
              <>
                Recevoir le guide gratuit
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        <p className="text-zinc-500 text-xs text-center mt-4">
          Pas de spam. Désinscription en 1 clic.
        </p>
      </div>
    </div>
  );
}
