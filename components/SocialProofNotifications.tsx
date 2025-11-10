'use client';

import { useState, useEffect } from 'react';
import { Check, X } from 'lucide-react';

interface Notification {
  id: number;
  message: string;
  timeAgo: string;
}

const demoNotifications: Notification[] = [
  { id: 1, message: "Thomas vient d'acheter la base complète", timeAgo: "Il y a 3 min" },
  { id: 2, message: "Sarah a téléchargé 12 projets", timeAgo: "Il y a 8 min" },
  { id: 3, message: "Marc vient de s'inscrire", timeAgo: "Il y a 15 min" },
  { id: 4, message: "Julie a complété le quiz SaaS", timeAgo: "Il y a 23 min" },
  { id: 5, message: "Alex vient d'acheter la base complète", timeAgo: "Il y a 31 min" },
];

export default function SocialProofNotifications() {
  const [currentNotif, setCurrentNotif] = useState<Notification | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    // Première notification après 5 secondes
    const initialDelay = setTimeout(() => {
      showNextNotification();
    }, 5000);

    return () => clearTimeout(initialDelay);
  }, []);

  const showNextNotification = () => {
    setCurrentNotif(demoNotifications[index % demoNotifications.length]);
    setIsVisible(true);
    setIndex(index + 1);

    // Cacher après 5 secondes
    setTimeout(() => {
      setIsVisible(false);
    }, 5000);

    // Prochaine notification après 20-40 secondes
    const nextDelay = Math.random() * 20000 + 20000;
    setTimeout(() => {
      showNextNotification();
    }, nextDelay);
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible || !currentNotif) return null;

  return (
    <div className="fixed bottom-6 left-6 z-40 animate-slide-in-left">
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl p-4 pr-12 max-w-sm">
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center text-zinc-500 hover:text-white transition"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-green-500/10 border border-green-500/30 rounded-full flex items-center justify-center flex-shrink-0">
            <Check className="w-5 h-5 text-green-500" />
          </div>
          <div>
            <p className="font-medium text-sm mb-1">{currentNotif.message}</p>
            <p className="text-xs text-zinc-500">{currentNotif.timeAgo}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
