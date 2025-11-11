'use client';

import { useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';
import { X, Lock, Check, LogIn, UserPlus } from 'lucide-react';
import { saveOrUpdateUser, getCurrentUser } from '@/lib/auth';

export default function EmailGate() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [loginCode, setLoginCode] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [mode, setMode] = useState<'signup' | 'login'>('signup'); // Mode inscription ou connexion

  useEffect(() => {
    // Vérifier si l'utilisateur est déjà connecté
    const currentUser = getCurrentUser();
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

    if (!currentUser && !hasSubmitted) {
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

    // Validation email
    if (!email) {
      setError('Veuillez entrer votre email');
      return;
    }

    if (!validateEmail(email)) {
      setError('Veuillez entrer un email valide');
      return;
    }

    // Validation mode inscription
    if (mode === 'signup' && (!firstName || !lastName)) {
      setError('Veuillez remplir votre nom et prénom');
      return;
    }

    setIsLoading(true);

    try {
      // Sauvegarder ou connecter l'utilisateur avec Supabase
      const user = await saveOrUpdateUser(email, firstName, lastName);
      
      if (!user) {
        throw new Error('Failed to save user');
      }
      
      console.log('✅ User authenticated:', user);

      // Sauvegarder aussi dans l'ancien système (fichier JSON)
      const saveUserResponse = await fetch('/api/save-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: firstName || user.firstName,
          lastName: lastName || user.lastName,
          email,
          source: mode === 'signup' ? 'Email Gate - Signup' : 'Email Gate - Login',
          page: typeof window !== 'undefined' ? window.location.pathname : '/'
        })
      });
      
      const saveUserData = await saveUserResponse.json();
      console.log('✅ User saved to JSON:', saveUserData);

      // Envoyer via EmailJS - Notification d'inscription
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        {
          subject: `🎉 Nouvelle inscription SoloVault - ${firstName} ${lastName}`,
          message: `Un nouveau visiteur s'est inscrit sur SoloVault ! 🎉`,
          firstName: firstName || 'Utilisateur',
          lastName: lastName || 'Anonyme',
          email: email,
          source: mode === 'signup' ? 'Email Gate - Inscription' : 'Email Gate - Connexion',
          page: typeof window !== 'undefined' ? window.location.pathname : '/',
          timestamp: new Date().toLocaleString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          }),
          reply_to: email,
          admin_link: 'true'
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
          {mode === 'signup' ? 'Accédez à SoloVault' : 'Connexion'}
        </h2>
        <p className="text-zinc-400 text-center mb-6">
          {mode === 'signup' 
            ? 'Découvrez 50+ projets solos générant 10K€+/mois'
            : 'Connectez-vous avec votre email'}
        </p>

        {/* Features - Seulement en mode signup */}
        {mode === 'signup' && (
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
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Nom et prénom - Seulement en mode signup */}
          {mode === 'signup' && (
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
          )}
          
          {/* Email - Toujours visible */}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="votre@email.com"
            className="w-full px-4 py-3 bg-black border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 transition mb-4"
            disabled={isLoading}
            autoFocus={mode === 'login'}
          />
          
          {error && (
            <p className="text-red-500 text-sm mb-4">{error}</p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading 
              ? 'Chargement...' 
              : mode === 'signup' 
                ? 'Accéder gratuitement 🚀' 
                : 'Se connecter'}
          </button>
        </form>

        {/* Toggle entre signup et login */}
        <div className="mt-4 text-center">
          <button
            onClick={() => {
              setMode(mode === 'signup' ? 'login' : 'signup');
              setError('');
            }}
            className="text-zinc-400 hover:text-orange-500 text-sm transition"
          >
            {mode === 'signup' 
              ? 'Déjà inscrit ? Se connecter' 
              : 'Pas encore de compte ? S\'inscrire'}
          </button>
        </div>

        <p className="text-zinc-500 text-xs text-center mt-4">
          {mode === 'signup' 
            ? 'Pas de spam. On respecte votre inbox.' 
            : 'Accès gratuit sans mot de passe'}
        </p>
      </div>
    </div>
  );
}
