
import React, { useState } from 'react';
import { User as UserIcon, Camera, MapPin, Phone, Mail, Save, Loader2, ShieldCheck, ArrowLeft } from 'lucide-react';
import { User, View } from '../types';
import { supabase } from '../lib/supabase';

interface ProfileViewProps {
  user: User;
  onUpdate: (updatedUser: User) => void;
  setView: (v: View) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ user, onUpdate, setView }) => {
  const [formData, setFormData] = useState({
    name: user.name,
    phone: user.phone || '',
    address: user.address || '',
    avatar: user.avatar || ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setStatus('idle');

    const { error } = await supabase
      .from('users')
      .update({
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
        avatar: formData.avatar,
        updated_at: new Date().toISOString()
      })
      .eq('email', user.email);

    if (error) {
      console.error(error);
      setStatus('error');
    } else {
      onUpdate({ ...user, ...formData });
      setStatus('success');
      setTimeout(() => setStatus('idle'), 3000);
    }
    setIsSaving(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <button 
        onClick={() => setView('home')}
        className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold mb-8 transition-colors group"
      >
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        <span>Back to Store</span>
      </button>

      <div className="bg-white rounded-[3rem] shadow-2xl shadow-indigo-100 border border-gray-100 overflow-hidden">
        <div className="bg-indigo-600 h-32 relative">
          <div className="absolute -bottom-12 left-12">
            <div className="relative group">
              <div className="w-32 h-32 rounded-[2rem] bg-white p-1 shadow-xl">
                <div className="w-full h-full rounded-[1.8rem] bg-indigo-50 flex items-center justify-center overflow-hidden">
                  {formData.avatar ? (
                    <img src={formData.avatar} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <UserIcon size={48} className="text-indigo-200" />
                  )}
                </div>
              </div>
              <button className="absolute bottom-2 right-2 bg-slate-900 text-white p-2.5 rounded-xl shadow-lg hover:bg-indigo-600 transition-all">
                <Camera size={18} />
              </button>
            </div>
          </div>
        </div>

        <div className="pt-20 px-12 pb-12">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-black text-slate-900">{user.name}</h2>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mt-1">Premium Member Since {new Date(user.created_at || Date.now()).getFullYear()}</p>
            </div>
            <div className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest ${user.role === 'admin' ? 'bg-indigo-50 text-indigo-600' : 'bg-gray-50 text-slate-500'}`}>
              {user.role} Account
            </div>
          </div>

          <form onSubmit={handleSave} className="grid md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
              <div className="relative">
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
                />
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative">
                <input 
                  type="email" 
                  disabled
                  value={user.email}
                  className="w-full bg-gray-100 border border-gray-100 rounded-2xl py-4 pl-12 text-slate-400 cursor-not-allowed"
                />
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
              <div className="relative">
                <input 
                  type="tel" 
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                  placeholder="06XXXXXXXX"
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
                />
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Avatar Image URL</label>
              <div className="relative">
                <input 
                  type="url" 
                  value={formData.avatar}
                  onChange={e => setFormData({...formData, avatar: e.target.value})}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
                />
                <Camera className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              </div>
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Primary Shipping Address</label>
              <div className="relative">
                <textarea 
                  rows={3}
                  value={formData.address}
                  onChange={e => setFormData({...formData, address: e.target.value})}
                  placeholder="Street name, Building, City, State"
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-4 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all resize-none"
                />
                <MapPin className="absolute left-4 top-6 text-slate-300" size={18} />
              </div>
            </div>

            <div className="md:col-span-2 flex items-center justify-between pt-6 border-t border-gray-50">
              {status === 'success' && (
                <p className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
                  <ShieldCheck size={20} /> Profile Updated Successfully
                </p>
              )}
              {status === 'error' && (
                <p className="text-rose-500 font-bold text-sm">Error updating profile. Please try again.</p>
              )}
              <div className="flex-1"></div>
              <button 
                type="submit"
                disabled={isSaving}
                className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black flex items-center gap-3 hover:bg-indigo-600 transition-all disabled:opacity-50 shadow-xl shadow-slate-100"
              >
                {isSaving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
                Update Settings
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
