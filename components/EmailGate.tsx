'use client';

import { useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';
import { X, Lock, Check } from 'lucide-react';

export default function EmailGate() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [referralCode, setReferralCode] = useState<string | null>(null);

  useEffect(() => {
    // Vérifier si l'utilisateur a déjà soumis son email
    const hasSubmitted = localStorage.getItem('solovault_email_submitted');

    // Récupérer le code de parrainage depuis l'URL
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const refCode = urlParams.get('ref');
      if (refCode) {
        setReferralCode(refCode);
        localStorage.setItem('solovault_referral_code', refCode);
      }
    }

    if (!hasSubmitted) {
      // Petit délai pour UX (optionnel)
      setTimeout(() => setIsOpen(true), 500);
    }
  }, []);

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!firstName || !lastName) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    if (!email) {
      setError('Veuillez entrer votre email');
      return;
    }

    if (!validateEmail(email)) {
      setError('Veuillez entrer un email valide');
      return;
    }

    setIsLoading(true);

    try {
      // Sauvegarder dans la base de données
      const saveUserResponse = await fetch('/api/save-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          source: 'Email Gate',
          page: typeof window !== 'undefined' ? window.location.pathname : '/'
        })
      });
      
      const saveUserData = await saveUserResponse.json();
      console.log('✅ User saved:', saveUserData);

      // Envoyer via EmailJS
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        {
          user_name: `${firstName} ${lastName}`,
          user_email: email,
          capture_date: new Date().toLocaleString('fr-FR'),
          source: 'Email Gate',
          page: typeof window !== 'undefined' ? window.location.pathname : '/'
        },
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
      );

      // Sauvegarder localement
      localStorage.setItem('solovault_firstName', firstName);
      localStorage.setItem('solovault_lastName', lastName);
      localStorage.setItem('solovault_email', email);
      localStorage.setItem('solovault_email_submitted', 'true');
      localStorage.setItem('solovault_email_date', new Date().toISOString());

      // Tracker le parrainage si un code existe
      const refCode = referralCode || localStorage.getItem('solovault_referral_code');
      if (refCode) {
        try {
          const refResponse = await fetch('/api/referral/track', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email,
              referralCode: refCode
            })
          });
          const refData = await refResponse.json();
          console.log('✅ Referral tracked:', refData);
          localStorage.removeItem('solovault_referral_code');
        } catch (error) {
          console.error('❌ Error tracking referral:', error);
        }
      }

      // Tracker l'action pour gamification
      const actionResponse = await fetch('/api/track-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          action: 'EMAIL_SUBMIT'
        })
      });
      const actionData = await actionResponse.json();
      console.log('✅ Action tracked:', actionData);

      // Fermer le modal
      setIsOpen(false);

      // Notification succès (optionnel - peut être un toast)
      setTimeout(() => {
        alert('✅ Merci ! Vous avez maintenant accès à SoloVault 🚀');
      }, 300);

    } catch (error) {
      console.error('EmailJS error:', error);
      setError('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 max-w-md w-full animate-slide-up">
        {/* Icon */}
        <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <Lock className="w-8 h-8 text-white" />
        </div>

        {/* Title */}
        <h2 className="text-3xl font-bold text-center mb-2">
          Accédez à SoloVault
        </h2>
        <p className="text-zinc-400 text-center mb-6">
          Découvrez 50+ projets solos générant 10K€+/mois
        </p>

        {/* Features */}
        <div className="space-y-3 mb-6">
          {[
            'Accès gratuit aux 10 premiers projets',
            'Filtres avancés et recherche',
            'Mises à jour mensuelles'
          ].map((feature, index) => (
            <div key={index} className="flex items-center text-zinc-300">
              <Check className="w-5 h-5 text-orange-500 mr-3 flex-shrink-0" />
              <span>{feature}</span>
            </div>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Prénom"
              className="w-full px-4 py-3 bg-black border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 transition"
              disabled={isLoading}
              autoFocus
            />
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Nom"
              className="w-full px-4 py-3 bg-black border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 transition"
              disabled={isLoading}
            />
          </div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="votre@email.com"
            className="w-full px-4 py-3 bg-black border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 transition mb-4"
            disabled={isLoading}
          />
          
          {error && (
            <p className="text-red-500 text-sm mb-4">{error}</p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Envoi en cours...' : 'Accéder gratuitement 🚀'}
          </button>
        </form>

        <p className="text-zinc-500 text-xs text-center mt-4">
          Pas de spam. On respecte votre inbox.
        </p>
      </div>
    </div>
  );
}
