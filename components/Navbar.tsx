'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X, Download, Sun, Moon, User, LogOut } from 'lucide-react';
import GamificationBadge from './GamificationBadge';
import { getCurrentUser, logout } from '@/lib/auth';

interface NavbarProps {
  variant?: 'landing' | 'dashboard';
}

export default function Navbar({ variant = 'dashboard' }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [mounted, setMounted] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('solovault_theme') as 'light' | 'dark';
    if (savedTheme) {
      setTheme(savedTheme);
    }
    
    // Récupérer l'utilisateur connecté
    const user = getCurrentUser();
    setCurrentUser(user);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);

    const root = document.documentElement;
    if (newTheme === 'dark') {
      root.classList.remove('light');
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }

    localStorage.setItem('solovault_theme', newTheme);
  };

  return (
    <nav className="sticky top-0 z-50 bg-black/95 backdrop-blur-md border-b border-zinc-800">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">S</span>
            </div>
            <span className="text-xl font-bold">SoloVault</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/about" className="text-zinc-300 hover:text-white transition">
              À propos
            </Link>
            <Link href="/contact" className="text-zinc-300 hover:text-white transition">
              Contact
            </Link>
            {mounted && <GamificationBadge />}
            {mounted && (
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-orange-500 transition-all"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5 text-orange-500" />
                ) : (
                  <Moon className="w-5 h-5 text-orange-500" />
                )}
              </button>
            )}
            
            {/* User Menu */}
            {mounted && currentUser && (
              <div className="flex items-center gap-3 px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg">
                <User className="w-4 h-4 text-orange-500" />
                <span className="text-sm text-zinc-300">{currentUser.firstName || currentUser.email}</span>
                <button
                  onClick={() => {
                    logout();
                    setCurrentUser(null);
                    window.location.reload();
                  }}
                  className="text-zinc-400 hover:text-red-500 transition"
                  title="Se déconnecter"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
            
            {variant === 'landing' ? (
              <Link
                href="/dashboard"
                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition"
              >
                Accéder au dashboard
              </Link>
            ) : (
              <button
                onClick={() => {
                  const event = new CustomEvent('openDownloadModal');
                  window.dispatchEvent(event);
                }}
                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Télécharger (19€)
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-zinc-800">
            <Link href="/about" className="block py-2 text-zinc-300 hover:text-white transition">
              À propos
            </Link>
            <Link href="/contact" className="block py-2 text-zinc-300 hover:text-white transition">
              Contact
            </Link>
            {mounted && (
              <div className="mt-4 flex justify-center">
                <GamificationBadge />
              </div>
            )}
            {mounted && (
              <button
                onClick={toggleTheme}
                className="mt-4 w-full px-4 py-2 bg-zinc-900 border border-zinc-800 hover:border-orange-500 text-white font-semibold rounded-lg transition flex items-center justify-center gap-2"
              >
                {theme === 'dark' ? (
                  <>
                    <Sun className="w-5 h-5 text-orange-500" />
                    <span>Mode clair</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-5 h-5 text-orange-500" />
                    <span>Mode sombre</span>
                  </>
                )}
              </button>
            )}
            {variant === 'landing' ? (
              <Link
                href="/dashboard"
                className="mt-4 w-full px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition block text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                Accéder au dashboard
              </Link>
            ) : (
              <button
                onClick={() => {
                  const event = new CustomEvent('openDownloadModal');
                  window.dispatchEvent(event);
                  setIsMenuOpen(false);
                }}
                className="mt-4 w-full px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition"
              >
                Télécharger (19€)
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
