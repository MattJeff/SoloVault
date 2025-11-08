'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Check, Download } from 'lucide-react';
import Link from 'next/link';

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [email, setEmail] = useState('');

  useEffect(() => {
    // Récupérer l'email du localStorage
    const userEmail = localStorage.getItem('solovault_email');
    if (userEmail) {
      setEmail(userEmail);
    }
  }, []);

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Success Icon */}
        <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
          <Check className="w-12 h-12 text-white" strokeWidth={3} />
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-center mb-4">
          🎉 Paiement réussi !
        </h1>
        <p className="text-xl text-zinc-400 text-center mb-8">
          Merci pour votre achat. Vous avez maintenant accès à la base complète SoloVault.
        </p>

        {/* Info Card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 mb-8">
          <h2 className="text-xl font-bold mb-6">📦 Votre commande</h2>
          
          <div className="space-y-4 mb-6">
            <div className="flex justify-between py-3 border-b border-zinc-800">
              <span className="text-zinc-400">Produit</span>
              <span className="font-semibold">SoloVault - Base Complète</span>
            </div>
            <div className="flex justify-between py-3 border-b border-zinc-800">
              <span className="text-zinc-400">Email</span>
              <span className="font-semibold">{email || 'Non disponible'}</span>
            </div>
            <div className="flex justify-between py-3 border-b border-zinc-800">
              <span className="text-zinc-400">Montant</span>
              <span className="font-semibold">19,00 €</span>
            </div>
            <div className="flex justify-between py-3">
              <span className="text-zinc-400">ID Session</span>
              <span className="font-mono text-xs text-zinc-500">
                {sessionId ? `...${sessionId.slice(-12)}` : 'N/A'}
              </span>
            </div>
          </div>

          {/* Download Button */}
          <button className="w-full py-4 bg-orange-500 hover:bg-orange-600 rounded-lg font-bold text-lg transition flex items-center justify-center gap-3">
            <Download className="w-6 h-6" />
            Télécharger la base de données
          </button>

          <p className="text-sm text-zinc-500 text-center mt-4">
            Un email avec le lien de téléchargement a été envoyé à <strong>{email}</strong>
          </p>
        </div>

        {/* What's Included */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 mb-8">
          <h3 className="text-lg font-bold mb-4">✨ Ce qui est inclus</h3>
          <ul className="space-y-3">
            {[
              '50+ projets SaaS solos détaillés',
              'Données complètes : revenue, MVP, growth channels',
              'Filtres Excel avancés',
              'Mises à jour mensuelles gratuites',
              'Accès à vie',
              'Support par email'
            ].map((item, index) => (
              <li key={index} className="flex items-center gap-3 text-zinc-300">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <Link
            href="/"
            className="flex-1 py-3 border border-zinc-800 hover:border-orange-500 rounded-lg font-semibold text-center transition"
          >
            ← Retour à l'accueil
          </Link>
          <button className="flex-1 py-3 bg-zinc-900 border border-zinc-800 hover:border-orange-500 rounded-lg font-semibold transition">
            Contacter le support
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-zinc-400">Chargement...</p>
        </div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
