
import React, { useState } from 'react';
import { Mail, Lock, User as UserIcon, ArrowLeft, ShoppingBag, Loader2, Phone, MapPin, AlertCircle } from 'lucide-react';
import { View } from '../../types';
import { supabase } from '../../lib/supabase';

interface RegisterViewProps {
  onSwitchToLogin: () => void;
  setView: (v: View) => void;
}

export const RegisterView: React.FC<RegisterViewProps> = ({ onSwitchToLogin, setView }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<{ message: string; isRateLimit: boolean } | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // 1. Create Supabase Auth User
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: 'customer'
        }
      }
    });

    if (authError) {
      const isRateLimit = authError.status === 429 || authError.message.includes('Too many requests');
      setError({ 
        message: isRateLimit ? "Whoa, slow down! Too many registration attempts. Please wait a few minutes before trying again." : authError.message, 
        isRateLimit 
      });
      setIsLoading(false);
      return;
    }

    if (authData.user) {
      // 2. Insert into your custom public.users table
      const { error: dbError } = await supabase.from('users').insert({
        name: fullName,
        email: email,
        password: 'AUTH_MANAGED',
        role: 'customer',
        phone: phone,
        address: address
      });

      if (dbError) {
        console.error("Profile sync error:", dbError);
      }
    }

    alert("Registration successful! You can now log in.");
    onSwitchToLogin();
    setIsLoading(false);
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-xl w-full animate-fadeIn">
        <form onSubmit={handleRegister} className="bg-white rounded-[3rem] p-8 md:p-12 shadow-2xl shadow-indigo-100 border border-gray-100">
          <div className="text-center mb-10">
            <div className="inline-flex w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl items-center justify-center text-white mb-6 shadow-xl shadow-indigo-200">
              <ShoppingBag size={32} />
            </div>
            <h2 className="text-3xl font-black text-slate-900 mb-2">Create Account</h2>
            <p className="text-slate-500 font-medium">Join our premium shopping community</p>
          </div>

          {error && (
            <div className={`mb-6 p-4 rounded-2xl text-sm font-bold flex gap-3 ${error.isRateLimit ? 'bg-amber-50 border border-amber-100 text-amber-700' : 'bg-rose-50 border border-rose-100 text-rose-600'}`}>
              <AlertCircle size={20} className="shrink-0" />
              <span>{error.message}</span>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-5">
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
              <div className="relative">
                <input 
                  type="text" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe"
                  required
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-4 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
                />
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative">
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-4 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
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
                  placeholder="Min 8 characters"
                  required
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-4 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
                />
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
              <div className="relative">
                <input 
                  type="tel" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="06XXXXXXXX"
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-4 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
                />
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Shipping Address</label>
              <div className="relative">
                <input 
                  type="text" 
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Street, City, State"
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-4 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
                />
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              </div>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="md:col-span-2 w-full bg-indigo-600 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 active:scale-95 disabled:opacity-50 mt-4"
            >
              {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Start Shopping'}
            </button>
          </div>

          <p className="text-center mt-10 text-sm text-slate-500">
            Already have an account?{' '}
            <button 
              type="button"
              onClick={onSwitchToLogin}
              className="text-indigo-600 font-bold hover:underline"
            >
              Sign in here
            </button>
          </p>
        </form>

        <button 
          onClick={() => setView('home')}
          className="mt-8 mx-auto flex items-center gap-2 text-slate-400 font-bold hover:text-slate-600 transition-colors"
        >
          <ArrowLeft size={18} />
          <span>Back to Storefront</span>
        </button>
      </div>
    </div>
  );
};
