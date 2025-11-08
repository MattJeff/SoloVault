'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, Download, Shield } from 'lucide-react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
            <Link href="/dashboard" className="text-zinc-300 hover:text-white transition">
              Projets
            </Link>
            <Link href="#about" className="text-zinc-300 hover:text-white transition">
              À propos
            </Link>
            <Link href="#contact" className="text-zinc-300 hover:text-white transition">
              Contact
            </Link>
            <Link 
              href="/admin" 
              className="text-zinc-300 hover:text-white transition flex items-center gap-2"
            >
              <Shield className="w-4 h-4" />
              Admin
            </Link>
            <button className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition flex items-center gap-2">
              <Download className="w-4 h-4" />
              Télécharger (19€)
            </button>
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
            <Link href="/dashboard" className="block py-2 text-zinc-300 hover:text-white transition">
              Projets
            </Link>
            <Link href="#about" className="block py-2 text-zinc-300 hover:text-white transition">
              À propos
            </Link>
            <Link href="#contact" className="block py-2 text-zinc-300 hover:text-white transition">
              Contact
            </Link>
            <Link href="/admin" className="block py-2 text-zinc-300 hover:text-white transition">
              Admin
            </Link>
            <button className="mt-4 w-full px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition">
              Télécharger (19€)
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
