
import React, { useState } from 'react';
import { Mail, Lock, LogIn, ArrowRight, ShieldCheck, User as UserIcon, ShoppingBag, Loader2 } from 'lucide-react';
import { View, User } from '../../types';
import { supabase } from '../../lib/supabase';

interface LoginViewProps {
  onLogin: (user: User) => void;
  onSwitchToRegister: () => void;
  setView: (v: View) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLogin, onSwitchToRegister, setView }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // 1. Authenticate with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError(authError.message);
        return;
      }

      if (authData.user) {
        // 2. Fetch full profile from your public.users table
        const { data: userData, error: dbError } = await supabase
          .from('users')
          .select('*')
          .eq('email', authData.user.email)
          .single();

        if (!dbError && userData) {
          onLogin({
            id: authData.user.id,
            db_id: userData.id,
            name: userData.name,
            email: userData.email,
            role: userData.role || 'customer',
            avatar: userData.avatar,
            phone: userData.phone,
            address: userData.address,
            created_at: userData.created_at
          });
        } else {
          // Fallback to auth metadata if profile fetch fails
          onLogin({
            id: authData.user.id,
            name: authData.user.user_metadata.full_name || 'User',
            email: authData.user.email!,
            role: authData.user.user_metadata.role || 'customer'
          });
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        <form onSubmit={handleLogin} className="bg-white rounded-[3rem] p-8 md:p-12 shadow-2xl shadow-slate-100 border border-gray-100 animate-fadeIn">
          <div className="text-center mb-10">
            <div className="inline-flex w-16 h-16 bg-gradient-to-br from-[#0A7D3E] to-[#003820] rounded-2xl items-center justify-center text-white mb-6 shadow-xl shadow-[#0A7D3E]/30">
              <ShoppingBag size={32} />
            </div>
            <h2 className="text-3xl font-black text-slate-900 mb-2">Bienvenue</h2>
            <p className="text-slate-500 font-medium">Connectez-vous à votre compte ZShop</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl text-sm font-bold flex items-center gap-2">
              <ShieldCheck size={18} />
              {error}
            </div>
          )}

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-4 focus:ring-4 focus:ring-[#0A7D3E]/10 focus:border-[#0A7D3E] outline-none transition-all"
                />
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-4 focus:ring-4 focus:ring-[#0A7D3E]/10 focus:border-[#0A7D3E] outline-none transition-all"
                />
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-[#0A7D3E] to-[#003820] text-white py-4 rounded-2xl font-black flex items-center justify-center gap-3 hover:opacity-90 transition-all shadow-xl shadow-[#0A7D3E]/20 active:scale-95 disabled:opacity-50 glow-on-hover"
            >
              {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Sign In'}
              {!isLoading && <LogIn size={20} />}
            </button>
          </div>

          <p className="text-center mt-10 text-sm text-slate-500">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={onSwitchToRegister}
              className="text-indigo-600 font-bold hover:underline"
            >
              Create one for free
            </button>
          </p>
        </form>

        <button
          onClick={() => setView('home')}
          className="mt-8 mx-auto flex items-center gap-2 text-slate-400 font-bold hover:text-slate-600 transition-colors"
        >
          <span>Back to Storefront</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};
