
import React, { useState, useEffect } from 'react';
import { ShoppingCart, User, Heart, Menu, Search, Sparkles, LogOut, Package, Settings, LayoutDashboard, ShieldCheck, X } from 'lucide-react';
import { View, User as UserType } from '../types';

interface HeaderProps {
  cartCount: number;
  wishlistCount: number;
  user: UserType | null;
  onOpenCart: () => void;
  onOpenAI: () => void;
  setView: (v: View) => void;
  onLogout: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onNavNew: () => void;
  onNavOffers: () => void;
  onNavAbout: () => void;
  onNavCollection: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  wishlistCount,
  user,
  onOpenCart,
  onOpenAI,
  setView,
  onLogout,
  searchQuery,
  onSearchChange,
  onNavNew,
  onNavOffers,
  onNavAbout,
  onNavCollection
}) => {
  const [currentAnnouncement, setCurrentAnnouncement] = useState(0);


  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const announcements = [
    "🚀 Livraison GRATUITE à partir de 5000 DA",
    //  "📦 Commandez avant 14h pour expédition le jour même",
    "💎 ZShop Algeria - Votre Satisfaction, Notre Priorité"
  ];
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAnnouncement(prev => (prev + 1) % announcements.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Animated Top Bar */}
      <div className="bg-[#003820] text-white py-2 px-4 text-center text-sm relative overflow-hidden">
        <div key={currentAnnouncement} className="animate-fadeIn">
          {announcements[currentAnnouncement]}
        </div>
      </div>

      <header className="sticky top-0 z-[60] bg-white/95 backdrop-blur-md shadow-md transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center gap-6">
              <button onClick={() => setView('home')} className="flex items-center group">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#0A7D3E] to-[#003820] rounded-xl flex items-center justify-center text-white mr-3 group-hover:scale-105 transition-transform duration-300 shadow-lg glow-on-hover">
                    <ShoppingCart size={24} />
                  </div>
                  <span className="absolute -bottom-1 -right-1 bg-[#FF6B35] text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">DZ</span>
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-2xl font-bold">
                    <span className="gradient-text">ZShop</span>
                    <span className="text-[#003820]">Algeria</span>
                  </h1>
                </div>
              </button>

              {/* Desktop Nav */}
              <nav className="hidden lg:flex items-center space-x-6">
                <button onClick={onNavCollection} className="text-sm font-medium text-slate-600 hover:text-[#0A7D3E] transition-colors">Collection</button>
                <button onClick={onNavNew} className="text-sm font-medium text-slate-600 hover:text-[#0A7D3E] transition-colors">Nouveautés</button>
                <button onClick={onNavOffers} className="text-sm font-medium text-slate-600 hover:text-[#0A7D3E] transition-colors">Offres</button>
                <button onClick={onNavAbout} className="text-sm font-medium text-slate-600 hover:text-[#0A7D3E] transition-colors">À propos</button>
              </nav>
            </div>

            <div className="hidden md:flex flex-1 max-w-xl mx-6">
              <div className="relative w-full flex items-center bg-gray-50 border border-gray-200 rounded-full h-12 transition-all focus-within:ring-2 focus-within:ring-[#0A7D3E]/20 focus-within:border-[#0A7D3E] hover:bg-white hover:shadow-md">
                <div className="flex items-center pl-5 pointer-events-none text-gray-400">
                  <Search size={18} />
                </div>
                <input
                  type="text"
                  placeholder="Recherchez des produits..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="flex-1 bg-transparent border-none focus:ring-0 text-sm placeholder:text-gray-400 px-3"
                />
                <button className="mr-1.5 w-9 h-9 flex items-center justify-center bg-[#0A7D3E] text-white rounded-full hover:bg-[#003820] transition-all shadow-sm active:scale-95">
                  <Search size={16} />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              {/* Admin Quick Access Button */}
              {user?.role === 'admin' && (
                <button
                  onClick={() => setView('admin-dashboard')}
                  className="hidden xl:flex items-center gap-2 bg-[#003820] text-white px-4 py-2.5 rounded-full text-sm font-bold hover:bg-[#0A7D3E] transition-all shadow-lg"
                >
                  <ShieldCheck size={16} />
                  <span>Admin</span>
                </button>
              )}

              {/* <button
                onClick={onOpenAI}
                className="hidden sm:flex items-center gap-2 bg-[#0A7D3E]/10 text-[#0A7D3E] px-4 py-2.5 rounded-full text-sm font-semibold hover:bg-[#0A7D3E]/20 transition-colors"
              >
                <Sparkles size={16} className="animate-pulse" />
                <span>AI Shopper</span>
              </button> */}

              {/* Wishlist */}
              <button
                onClick={() => setView('wishlist')}
                className="relative w-11 h-11 rounded-full bg-gray-100 flex items-center justify-center shadow-sm hover:bg-gray-200 transition text-gray-700 hover:text-[#0A7D3E]"
              >
                <Heart size={20} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#FF6B35] text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">{wishlistCount}</span>
                )}
              </button>

              {/* Cart */}
              <button
                onClick={onOpenCart}
                className="relative w-11 h-11 rounded-full bg-gray-100 flex items-center justify-center shadow-sm hover:bg-gray-200 transition text-gray-700 hover:text-[#0A7D3E]"
              >
                <ShoppingCart size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#FF6B35] text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">{cartCount}</span>
                )}
              </button>

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => user ? setIsUserMenuOpen(!isUserMenuOpen) : setView('login')}
                  className="flex items-center gap-2"
                >
                  <div className="w-11 h-11 rounded-full bg-gradient-to-r from-[#0A7D3E] to-[#003820] flex items-center justify-center text-white shadow-lg overflow-hidden border-2 border-white">
                    {user?.avatar ? (
                      <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                    ) : (
                      user ? <span className="font-bold">{user.name[0].toUpperCase()}</span> : <User size={18} />
                    )}
                  </div>
                  <span className="hidden lg:inline-block text-sm font-medium text-slate-700">
                    {user ? user.name.split(' ')[0] : 'Mon Compte'}
                  </span>
                </button>

                {isUserMenuOpen && user && (
                  <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 p-2 z-[70] animate-fadeIn">
                    <div className="px-4 py-3 border-b border-gray-50 mb-1">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Connecté en tant que</p>
                      <p className="text-sm font-black text-slate-900 truncate">{user.email}</p>
                    </div>

                    {user.role === 'admin' && (
                      <button
                        onClick={() => { setView('admin-dashboard'); setIsUserMenuOpen(false); }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-[#0A7D3E] font-bold hover:bg-[#0A7D3E]/10 rounded-xl transition-colors mb-1"
                      >
                        <LayoutDashboard size={18} />
                        <span>Tableau de bord Admin</span>
                      </button>
                    )}

                    <button
                      onClick={() => { setView('orders'); setIsUserMenuOpen(false); }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-600 hover:bg-gray-50 rounded-xl transition-colors"
                    >
                      <Package size={18} />
                      <span>Mes Commandes</span>
                    </button>

                    <button
                      onClick={() => { setView('profile'); setIsUserMenuOpen(false); }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-600 hover:bg-gray-50 rounded-xl transition-colors"
                    >
                      <Settings size={18} />
                      <span>Paramètres</span>
                    </button>

                    <button
                      onClick={() => { onLogout(); setIsUserMenuOpen(false); }}
                      className="w-full mt-1 border-t border-gray-50 flex items-center gap-3 px-4 py-3 text-sm text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                    >
                      <LogOut size={18} />
                      <span>Déconnexion</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden w-11 h-11 rounded-full bg-gray-100 flex items-center justify-center text-slate-600"
              >
                {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100 px-4 py-4 animate-fadeIn">
            <div className="relative mb-4">
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full py-3 pl-12 pr-4 border border-gray-200 rounded-full"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            </div>
            <nav className="flex flex-col gap-2">
              {['Collection', 'Nouveautés', 'Offres', 'À propos'].map((item) => (
                <button
                  key={item}
                  onClick={() => { setView('home'); setIsMobileMenuOpen(false); }}
                  className="py-3 px-4 text-left font-medium text-slate-700 hover:bg-gray-50 rounded-xl"
                >
                  {item}
                </button>
              ))}
            </nav>
          </div>
        )}
      </header>
    </>
  );
};
