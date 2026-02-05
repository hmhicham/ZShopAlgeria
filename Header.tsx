
import React, { useState } from 'react';
import { ShoppingBag, User, Heart, Menu, Search, Sparkles, LogOut, Package, Settings, LayoutDashboard } from 'lucide-react';
import { View, User as UserType } from '../types';

interface HeaderProps {
  cartCount: number;
  wishlistCount: number;
  user: UserType | null;
  onOpenCart: () => void;
  onOpenAI: () => void;
  setView: (v: View) => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  cartCount, 
  wishlistCount, 
  user, 
  onOpenCart, 
  onOpenAI, 
  setView,
  onLogout
}) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-[60] bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <button onClick={() => setView('home')} className="flex items-center group">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white mr-3 group-hover:rotate-12 transition-transform duration-300">
                <ShoppingBag size={22} />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">ShopHub<span className="text-indigo-600">.</span></h1>
            </button>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center space-x-8">
              {['Collection', 'New Arrivals', 'Offers', 'About'].map((item) => (
                <button 
                  key={item} 
                  onClick={() => setView('home')}
                  className="text-[15px] font-medium text-slate-600 hover:text-indigo-600 transition-colors"
                >
                  {item}
                </button>
              ))}
            </nav>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <input 
                type="text" 
                placeholder="Search premium goods..."
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-2.5 pl-11 pr-4 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none text-sm"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            <button 
              onClick={onOpenAI}
              className="hidden sm:flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-indigo-100 transition-colors"
            >
              <Sparkles size={16} className="animate-pulse" />
              <span>AI Shopper</span>
            </button>

            <div className="h-6 w-[1px] bg-gray-200 mx-2 hidden sm:block"></div>

            <button 
              onClick={() => setView('wishlist')}
              className="p-2.5 text-slate-600 hover:bg-gray-100 rounded-xl transition-colors relative"
            >
              <Heart size={20} />
              {wishlistCount > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
              )}
            </button>

            <button 
              onClick={onOpenCart}
              className="p-2.5 text-slate-600 hover:bg-gray-100 rounded-xl transition-colors relative"
            >
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-[10px] font-bold rounded-lg px-1.5 py-0.5 border-2 border-white">
                  {cartCount}
                </span>
              )}
            </button>

            <div className="relative">
              <button 
                onClick={() => user ? setIsUserMenuOpen(!isUserMenuOpen) : setView('login')}
                className="hidden sm:flex items-center gap-2 p-1.5 pl-3 hover:bg-gray-100 rounded-xl transition-colors border border-transparent hover:border-gray-200"
              >
                <div className="text-right flex flex-col items-end">
                  <span className="text-sm font-bold text-slate-900 leading-none truncate max-w-[100px]">{user ? user.name : 'Login'}</span>
                  {user && <span className="text-[10px] text-indigo-500 font-bold uppercase tracking-wider">{user.role}</span>}
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg overflow-hidden border-2 border-white">
                  {user?.avatar ? (
                    <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                  ) : (
                    user ? user.name[0].toUpperCase() : <User size={18} />
                  )}
                </div>
              </button>

              {isUserMenuOpen && user && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 p-2 z-[70] animate-fadeIn">
                  <div className="px-4 py-3 border-b border-gray-50 mb-1">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Signed in as</p>
                    <p className="text-sm font-black text-slate-900 truncate">{user.email}</p>
                  </div>
                  
                  {user.role === 'admin' && (
                    <button 
                      onClick={() => { setView('admin-dashboard'); setIsUserMenuOpen(false); }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-indigo-600 font-bold hover:bg-indigo-50 rounded-xl transition-colors mb-1"
                    >
                      <LayoutDashboard size={18} />
                      <span>Admin Dashboard</span>
                    </button>
                  )}

                  <button 
                    onClick={() => { setView('orders'); setIsUserMenuOpen(false); }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-600 hover:bg-gray-50 rounded-xl transition-colors"
                  >
                    <Package size={18} />
                    <span>My Orders</span>
                  </button>

                  <button 
                    onClick={() => { setView('profile'); setIsUserMenuOpen(false); }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-600 hover:bg-gray-50 rounded-xl transition-colors"
                  >
                    <Settings size={18} />
                    <span>Profile Settings</span>
                  </button>

                  <button 
                    onClick={() => { onLogout(); setIsUserMenuOpen(false); }}
                    className="w-full mt-1 border-t border-gray-50 flex items-center gap-3 px-4 py-3 text-sm text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                  >
                    <LogOut size={18} />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>

            <button className="lg:hidden p-2 text-slate-600">
              <Menu size={24} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
