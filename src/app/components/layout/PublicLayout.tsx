import React, { useState } from 'react';
import { Menu, X, User, LogIn, ChevronDown } from 'lucide-react';

interface PublicLayoutProps {
  children: React.ReactNode;
  onNavigate: (page: string) => void;
  currentPage: string;
}

export const PublicLayout: React.FC<PublicLayoutProps> = ({ children, onNavigate, currentPage }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-[#e0e0e0] font-sans selection:bg-[#d4af37] selection:text-black">
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-[#1a1a1a]/90 backdrop-blur-md border-b border-[#333]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div 
              className="flex-shrink-0 flex items-center gap-2 cursor-pointer" 
              onClick={() => onNavigate('home')}
            >
              <div className="w-8 h-8 bg-[#d4af37] rounded-sm flex items-center justify-center">
                <span className="text-black font-serif font-bold text-xl">R</span>
              </div>
              <span className="font-serif text-2xl font-bold tracking-wide text-white">ReserveX</span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              <button 
                onClick={() => onNavigate('home')}
                className={`text-sm font-medium transition-colors hover:text-[#d4af37] ${currentPage === 'home' ? 'text-[#d4af37]' : 'text-zinc-400'}`}
              >
                Home
              </button>
              <button 
                onClick={() => onNavigate('listings')}
                className={`text-sm font-medium transition-colors hover:text-[#d4af37] ${currentPage === 'listings' ? 'text-[#d4af37]' : 'text-zinc-400'}`}
              >
                Restaurants
              </button>
              <button 
                className="text-sm font-medium text-zinc-400 hover:text-[#d4af37] transition-colors"
              >
                About Us
              </button>
              <div className="h-6 w-px bg-[#333]"></div>
              <button 
                onClick={() => onNavigate('login')}
                className="text-sm font-medium text-white hover:text-[#d4af37] transition-colors flex items-center gap-2"
              >
                <LogIn className="w-4 h-4" /> Log In
              </button>
              <button 
                onClick={() => onNavigate('register')}
                className="bg-[#d4af37] hover:bg-[#b5952f] text-black px-5 py-2 rounded-md text-sm font-bold transition-all transform hover:scale-105"
              >
                Sign Up
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-zinc-300 hover:text-white p-2"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-[#1a1a1a] border-b border-[#333]">
            <div className="px-4 pt-2 pb-6 space-y-2">
              <button onClick={() => { onNavigate('home'); setIsMobileMenuOpen(false); }} className="block w-full text-left px-3 py-3 text-base font-medium text-white hover:bg-[#333] rounded-md">Home</button>
              <button onClick={() => { onNavigate('listings'); setIsMobileMenuOpen(false); }} className="block w-full text-left px-3 py-3 text-base font-medium text-zinc-300 hover:bg-[#333] rounded-md">Restaurants</button>
              <button onClick={() => { onNavigate('login'); setIsMobileMenuOpen(false); }} className="block w-full text-left px-3 py-3 text-base font-medium text-zinc-300 hover:bg-[#333] rounded-md">Log In</button>
              <button onClick={() => { onNavigate('register'); setIsMobileMenuOpen(false); }} className="block w-full text-left px-3 py-3 text-base font-medium text-[#d4af37] font-bold">Sign Up</button>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="pt-20">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-[#111] border-t border-[#333] mt-20 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex justify-center items-center gap-2 mb-6">
             <div className="w-6 h-6 bg-[#d4af37] rounded-sm flex items-center justify-center">
                <span className="text-black font-serif font-bold text-sm">R</span>
              </div>
            <span className="font-serif text-xl font-bold text-white">ReserveX</span>
          </div>
          <p className="text-zinc-500 text-sm mb-6">Experience dining at its finest. Reserve your perfect table today.</p>
          <div className="flex justify-center gap-6 text-sm text-zinc-400">
            <a href="#" className="hover:text-[#d4af37]">Privacy Policy</a>
            <a href="#" className="hover:text-[#d4af37]">Terms of Service</a>
            <a href="#" className="hover:text-[#d4af37]">Contact</a>
          </div>
          <p className="text-zinc-600 text-xs mt-8">© 2024 ReserveX. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};
