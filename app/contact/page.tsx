'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Send, Calendar, Phone, Mail, MapPin, Clock, CheckCircle, MessageSquare } from 'lucide-react';
import emailjs from '@emailjs/browser';
import Navbar from '@/components/Navbar';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus('idle');

    try {
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_QUOTE_TEMPLATE_ID!,
        {
          from_name: formData.name,
          from_email: formData.email,
          message: formData.message,
          to_email: process.env.NEXT_PUBLIC_ADMIN_EMAIL
        },
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
      );

      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      console.error('Error:', error);
      setStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      
      <div className="pt-24 pb-20 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              Travaillons <span className="text-orange-500">ensemble</span>
            </h1>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
              Vous avez un projet d'application ou de développement web ? Je suis là pour transformer vos idées en réalité digitale.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {/* Demande de devis */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-orange-500" />
                </div>
                <h2 className="text-2xl font-bold">Une simple question ?</h2>
              </div>
              
              <p className="text-zinc-400 mb-6">
                Envoyez-moi un message rapide ou planifiez un appel
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Votre nom</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Votre nom"
                    className="w-full px-4 py-3 bg-black border border-zinc-700 rounded-lg focus:outline-none focus:border-orange-500 transition"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Votre email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="votre@email.com"
                    className="w-full px-4 py-3 bg-black border border-zinc-700 rounded-lg focus:outline-none focus:border-orange-500 transition"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Votre message</label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Votre message..."
                    rows={4}
                    className="w-full px-4 py-3 bg-black border border-zinc-700 rounded-lg focus:outline-none focus:border-orange-500 transition resize-none"
                    required
                  />
                </div>

                {status === 'success' && (
                  <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 text-green-500">
                    ✅ Message envoyé avec succès !
                  </div>
                )}

                {status === 'error' && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-500">
                    ❌ Erreur lors de l'envoi. Réessayez.
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  {isLoading ? 'Envoi...' : 'Envoyer'}
                </button>
              </form>
            </div>

            {/* Appel 30 min */}
            <div className="bg-gradient-to-br from-orange-900/20 to-orange-950/20 border border-orange-500/30 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold">Préférez-vous discuter de vive voix ?</h2>
              </div>
              
              <p className="text-zinc-300 mb-8">
                Réservez un créneau de 30 minutes pour discuter de votre projet
              </p>

              <a
                href="https://calendly.com/mathishiguinen/parlons-de-votre-projet"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition flex items-center justify-center gap-2"
              >
                <Calendar className="w-5 h-5" />
                Planifier un appel de 30 min
              </a>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-zinc-300">
                  <Phone className="w-5 h-5 text-orange-500" />
                  <span>07 58 76 07 38</span>
                </div>
                <div className="flex items-center gap-3 text-zinc-300">
                  <Mail className="w-5 h-5 text-orange-500" />
                  <span>mhiguinen235@gmail.com</span>
                </div>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Clock className="w-6 h-6 text-orange-500" />
              </div>
              <h3 className="font-semibold mb-1">Réponse rapide</h3>
              <p className="text-sm text-zinc-400">Sous 24h</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-6 h-6 text-orange-500" />
              </div>
              <h3 className="font-semibold mb-1">Devis gratuit</h3>
              <p className="text-sm text-zinc-400">Sans engagement</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                <MapPin className="w-6 h-6 text-orange-500" />
              </div>
              <h3 className="font-semibold mb-1">100% Remote</h3>
              <p className="text-sm text-zinc-400">Collaboration flexible</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                <MessageSquare className="w-6 h-6 text-orange-500" />
              </div>
              <h3 className="font-semibold mb-1">Suivi projet</h3>
              <p className="text-sm text-zinc-400">Communication régulière</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
