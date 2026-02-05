
import React, { useState } from 'react';
import { ArrowLeft, MapPin, Phone, User, CreditCard, ChevronRight, CheckCircle2, Ticket, XCircle, ShieldCheck } from 'lucide-react';
import { CartItem, View, Discount } from '../types';
import { WILAYAS } from '../constants';

interface CheckoutViewProps {
  items: CartItem[];
  subtotal: number;
  discountAmount: number;
  appliedDiscount: Discount | null;
  total: number;
  onApplyDiscount: (code: string) => Promise<boolean>;
  onPlaceOrder: (info: { name: string; wilaya: string; phone: string }) => void;
  setView: (v: View) => void;
}

export const CheckoutView: React.FC<CheckoutViewProps> = ({
  items,
  subtotal,
  discountAmount,
  appliedDiscount,
  total,
  onApplyDiscount,
  onPlaceOrder,
  setView
}) => {
  const [formData, setFormData] = useState({
    name: '',
    wilaya: WILAYAS[15], // Default Alger
    phone: '',
    notes: ''
  });

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [isApplying, setIsApplying] = useState(false);

  const [errors, setErrors] = useState({ name: '', phone: '' });

  const validateForm = () => {
    let newErrors = { name: '', phone: '' };
    let isValid = true;

    // Name: Only letters and spaces, at least 2 words or just one long name?
    // User requested "only string no number or character"
    const nameRegex = /^[a-zA-Z\s\u00C0-\u017F]+$/;
    if (!formData.name.trim()) {
      newErrors.name = 'Le nom est requis';
      isValid = false;
    } else if (!nameRegex.test(formData.name.trim())) {
      newErrors.name = 'Le nom ne doit contenir que des lettres';
      isValid = false;
    }

    // Phone: Algerian number (05, 06, 07 followed by 8 digits, or general 10 digits starting with 0)
    const phoneRegex = /^0[567][0-9]{8}$/; // Precise for mobile
    // Or more general if they want any algerian fixed line too: /^0[0-9]{9}$/
    if (!formData.phone.trim()) {
      newErrors.phone = 'Le numéro de téléphone est requis';
      isValid = false;
    } else if (!phoneRegex.test(formData.phone.trim())) {
      newErrors.phone = 'Numéro invalide (ex: 06XXXXXXXX)';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onPlaceOrder(formData);
    }
  };

  const handleApply = async () => {
    if (!couponInput.trim()) return;
    setIsApplying(true);
    setCouponError('');

    // Simulate brief delay for premium feel
    const success = await onApplyDiscount(couponInput);
    if (!success) {
      setCouponError('Invalid discount code');
    } else {
      setCouponInput('');
    }
    setIsApplying(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <button
        onClick={() => setView('home')}
        className="flex items-center gap-2 text-slate-500 hover:text-[#0A7D3E] font-black mb-12 transition-all group px-4 py-2 hover:bg-slate-50 rounded-xl w-fit"
      >
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm uppercase tracking-widest">Retourner au Magasin</span>
      </button>

      <div className="grid lg:grid-cols-5 gap-12 items-start">
        {/* Left Column: Form (3/5) */}
        <div className="lg:col-span-3 space-y-8">
          <div className="bg-white rounded-[3rem] p-10 shadow-2xl shadow-slate-100 border border-gray-100 relative overflow-hidden">
            {/* Decorative Element */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#0A7D3E]/5 rounded-bl-[5rem] -mr-8 -mt-8" />

            <div className="flex items-center justify-between mb-12 relative">
              <h2 className="text-3xl font-black text-slate-900 flex items-center gap-4">
                <div className="w-14 h-14 bg-[#0A7D3E] text-white rounded-2xl flex items-center justify-center shadow-lg shadow-green-100">
                  <MapPin size={28} />
                </div>
                Livraison
              </h2>
              <div className="px-6 py-2.5 bg-slate-50 rounded-2xl border border-slate-100 hidden sm:block">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-3">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  Étape Finale
                </div>
              </div>
            </div>

            <form id="checkout-form" onSubmit={handleSubmit} className="space-y-10">
              <div className="grid md:grid-cols-2 gap-10">
                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-500 ml-1 uppercase tracking-[0.15em]">Nom Complet</label>
                  <div className="relative group">
                    <input
                      type="text" required
                      value={formData.name}
                      onChange={e => {
                        setFormData({ ...formData, name: e.target.value });
                        if (errors.name) setErrors({ ...errors, name: '' });
                      }}
                      placeholder="Ex: Hicham Huli"
                      className={`w-full bg-slate-50 border-2 ${errors.name ? 'border-rose-100 focus:border-rose-500 ring-rose-50' : 'border-slate-50 focus:border-[#0A7D3E] ring-green-100/50'} rounded-[1.5rem] py-4.5 pl-13 pr-6 focus:ring-8 outline-none transition-all font-bold text-slate-900 placeholder:text-slate-300 text-lg`}
                    />
                    <User className={`absolute left-5 top-1/2 -translate-y-1/2 transition-colors ${errors.name ? 'text-rose-500' : 'text-slate-300 group-focus-within:text-[#0A7D3E]'}`} size={22} />
                  </div>
                  {errors.name && (
                    <div className="flex items-center gap-2 text-rose-600 text-[10px] font-black uppercase tracking-wider ml-1 bg-rose-50 py-2.5 px-4 rounded-xl border border-rose-100 animate-shake">
                      <XCircle size={14} />
                      {errors.name}
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-500 ml-1 uppercase tracking-[0.15em]">Numéro de Téléphone</label>
                  <div className="relative group">
                    <input
                      type="tel" required
                      value={formData.phone}
                      onChange={e => {
                        setFormData({ ...formData, phone: e.target.value });
                        if (errors.phone) setErrors({ ...errors, phone: '' });
                      }}
                      placeholder="06XXXXXXXX"
                      className={`w-full bg-slate-50 border-2 ${errors.phone ? 'border-rose-100 focus:border-rose-500 ring-rose-50' : 'border-slate-50 focus:border-[#0A7D3E] ring-green-100/50'} rounded-[1.5rem] py-4.5 pl-13 pr-6 focus:ring-8 outline-none transition-all font-bold text-slate-900 placeholder:text-slate-300 text-lg`}
                    />
                    <Phone className={`absolute left-5 top-1/2 -translate-y-1/2 transition-colors ${errors.phone ? 'text-rose-500' : 'text-slate-300 group-focus-within:text-[#0A7D3E]'}`} size={22} />
                  </div>
                  {errors.phone && (
                    <div className="flex items-center gap-2 text-rose-600 text-[10px] font-black uppercase tracking-wider ml-1 bg-rose-50 py-2.5 px-4 rounded-xl border border-rose-100 animate-shake">
                      <XCircle size={14} />
                      {errors.phone}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-black text-slate-500 ml-1 uppercase tracking-[0.15em]">Wilaya de Destination</label>
                <div className="relative border-2 border-slate-50 rounded-[1.5rem] overflow-hidden focus-within:border-[#0A7D3E] focus-within:ring-8 focus-within:ring-green-100/50 transition-all bg-slate-50">
                  <select
                    value={formData.wilaya}
                    onChange={e => setFormData({ ...formData, wilaya: e.target.value })}
                    className="w-full bg-transparent py-4.5 px-6 outline-none appearance-none cursor-pointer font-black text-slate-900 text-lg"
                  >
                    {WILAYAS.map(w => <option key={w} value={w}>{w}</option>)}
                  </select>
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <ChevronRight size={22} className="rotate-90" />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-black text-slate-500 ml-1 uppercase tracking-[0.15em]">Notes de Livraison <span className="text-slate-300 font-bold lowercase">(Optionnel)</span></label>
                <textarea
                  rows={4}
                  value={formData.notes}
                  onChange={e => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Ex: Appartement 04, 2ème étage..."
                  className="w-full bg-slate-50 border-2 border-slate-50 rounded-[1.5rem] py-4.5 px-6 focus:border-[#0A7D3E] ring-green-100/50 focus:ring-8 outline-none transition-all resize-none font-bold text-slate-900 placeholder:text-slate-300 text-lg"
                />
              </div>

              <div className="pt-12 border-t border-slate-50">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-10 h-1.5 bg-[#0A7D3E] rounded-full" />
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">Méthode de Paiement</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="p-8 border-2 border-[#0A7D3E] bg-emerald-50 rounded-[2rem] flex items-center transition-all shadow-xl shadow-emerald-100/30 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-100 opacity-40 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110" />
                    <div className="flex items-center gap-6 relative">
                      <div className="w-14 h-14 bg-[#0A7D3E] text-white rounded-2xl flex items-center justify-center shadow-lg">
                        <CheckCircle2 size={28} />
                      </div>
                      <div>
                        <span className="font-black text-slate-900 block text-lg">Cash on Delivery</span>
                        <span className="text-[10px] uppercase font-black text-emerald-600 tracking-[0.2em] mt-1 block">Paiement à la livraison</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-8 border-2 border-slate-100 bg-slate-50/50 rounded-[2rem] flex items-center opacity-40 grayscale pointer-events-none">
                    <div className="flex items-center gap-6">
                      <div className="w-14 h-14 bg-slate-200 text-slate-400 rounded-2xl flex items-center justify-center">
                        <CreditCard size={28} />
                      </div>
                      <div>
                        <span className="font-black text-slate-500 block text-lg">Carte Bancaire</span>
                        <span className="text-[10px] uppercase font-black text-slate-400 tracking-[0.2em] mt-1 block">Indisponible (Bientôt)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: Order Summary (2/5) */}
        <div className="lg:col-span-2 space-y-8 sticky top-32">
          <div className="bg-slate-900 text-white rounded-[3rem] p-10 shadow-2xl shadow-slate-900/20 border border-white/5 overflow-hidden relative">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#0A7D3E] opacity-20 blur-[100px] -mr-24 -mt-24" />

            <h3 className="text-2xl font-black mb-10 flex items-center justify-between relative">
              Récapitulatif
              <span className="text-[10px] py-1.5 px-4 bg-white/10 rounded-full font-black text-slate-400 tracking-[0.2em] uppercase">
                {items.reduce((acc, i) => acc + i.quantity, 0)} Produits
              </span>
            </h3>

            {/* Discount Code Input */}
            <div className="mb-10 space-y-4 relative">
              <div className="relative group">
                <input
                  type="text"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  placeholder="CODE PROMO"
                  className="w-full bg-white/5 border-2 border-white/10 rounded-[1.5rem] py-5 pl-14 pr-32 text-sm focus:ring-8 focus:ring-[#0A7D3E]/10 focus:border-[#0A7D3E] outline-none transition-all placeholder:text-slate-600 font-black tracking-widest uppercase"
                />
                <Ticket className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-[#0A7D3E] transition-colors" size={22} />
                <button
                  onClick={handleApply}
                  disabled={isApplying || !couponInput.trim()}
                  className="absolute right-2.5 top-2.5 bottom-2.5 px-6 bg-[#0A7D3E] text-white text-[10px] font-black uppercase tracking-[0.15em] rounded-[1rem] hover:bg-emerald-500 active:scale-95 transition-all disabled:opacity-30 shadow-lg shadow-green-900/40"
                >
                  {isApplying ? '...' : 'Appliquer'}
                </button>
              </div>

              {couponError && (
                <div className="flex items-center gap-3 text-rose-400 text-[10px] font-black uppercase tracking-widest ml-1 bg-rose-400/10 py-3 px-4 rounded-xl border border-rose-400/20 animate-fadeIn">
                  <XCircle size={14} />
                  {couponError}
                </div>
              )}

              {appliedDiscount && (
                <div className="flex items-center justify-between bg-emerald-500/10 border-2 border-emerald-500/20 px-5 py-4 rounded-[1.5rem] animate-fadeIn">
                  <div className="flex items-center gap-4 text-emerald-400">
                    <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                      <Ticket size={20} />
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-widest block">{appliedDiscount.code}</span>
                      <span className="text-[8px] text-emerald-500/60 font-black uppercase tracking-widest">Actif sur le panier</span>
                    </div>
                  </div>
                  <span className="text-sm font-black text-emerald-400">
                    {appliedDiscount.discount_type === 'shipping' ? 'LIVRAISON GRATUITE' :
                      appliedDiscount.percentage ? `-${appliedDiscount.percentage}%` :
                        `-${parseFloat(appliedDiscount.discount_value).toLocaleString()} DA`}
                  </span>
                </div>
              )}
            </div>

            {/* Scrollable Items List */}
            <div className="space-y-6 mb-12 max-h-[380px] overflow-y-auto pr-4 custom-scrollbar relative">
              {items.map(item => (
                <div key={item.id} className="flex gap-6 pb-6 border-b border-white/5 last:border-0 last:pb-0 group">
                  <div className="w-24 h-24 rounded-[1.5rem] overflow-hidden flex-shrink-0 bg-white/5 border border-white/10 group-hover:border-white/20 transition-all p-1">
                    <img src={item.image} className="w-full h-full object-cover rounded-[1.2rem] transition-transform duration-700 group-hover:scale-115" />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-center gap-2">
                    <h4 className="font-black text-sm uppercase tracking-tight leading-tight group-hover:text-[#FFD700] transition-colors">{item.name}</h4>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest bg-white/5 py-1.5 px-3 rounded-lg border border-white/5">QTÉ: {item.quantity}</span>
                      <span className="text-sm font-black text-emerald-400 tracking-tighter">{(item.price * item.quantity).toLocaleString()} DA</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Price Breakdown */}
            <div className="space-y-4 pt-10 border-t border-white/5 relative">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 font-black uppercase tracking-[0.2em] text-[9px]">Sous-total</span>
                <span className="font-bold text-slate-300">{subtotal.toLocaleString()} DA</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between items-center text-sm bg-emerald-500/5 p-3 rounded-xl border border-emerald-500/10">
                  <span className="text-emerald-400 font-black uppercase tracking-[0.2em] text-[9px]">Réduction</span>
                  <span className="font-black text-emerald-400">-{discountAmount.toLocaleString()} DA</span>
                </div>
              )}

              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 font-black uppercase tracking-[0.2em] text-[9px]">Livraison</span>
                <span className="font-black text-emerald-500 text-[10px] tracking-widest">
                  {appliedDiscount?.discount_type === 'shipping' ? '✨ TOTALEMENT GRATUIT' : 'CALCULÉ À LA LIVRAISON'}
                </span>
              </div>

              <div className="pt-8 mt-6 border-t border-white/10">
                <div className="flex justify-between items-end">
                  <div className="space-y-2">
                    <span className="text-slate-500 font-black uppercase tracking-[0.3em] text-[10px] block">Montant Total</span>
                    <span className="text-[9px] text-emerald-500/70 font-black uppercase tracking-widest flex items-center gap-2">
                      <ShieldCheck size={12} /> Garanti ZShop
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-5xl font-black block text-[#FFD700] drop-shadow-[0_4px_12px_rgba(255,215,0,0.3)] tracking-tighter leading-none">
                      {total.toLocaleString()}
                    </span>
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.25em] mt-3 block">Dinars Algérien</span>
                  </div>
                </div>
              </div>

              <button
                form="checkout-form"
                type="submit"
                className="w-full mt-12 py-6 bg-[#0A7D3E] hover:bg-emerald-600 text-white rounded-[1.8rem] font-black text-lg uppercase tracking-[0.2em] shadow-2xl shadow-green-900/50 transition-all active:scale-95 flex items-center justify-center gap-4 group border-b-[6px] border-emerald-800"
              >
                Confirmer la commande
                <ChevronRight className="group-hover:translate-x-1.5 transition-transform" />
              </button>

              <div className="mt-10 flex items-center justify-center gap-6 opacity-40 grayscale hover:grayscale-0 transition-all cursor-default">
                <div className="w-10 h-10 border border-white/20 rounded-lg flex items-center justify-center text-[8px] font-black">CIB</div>
                <div className="w-10 h-10 border border-white/20 rounded-lg flex items-center justify-center text-[8px] font-black">DAH</div>
                <div className="w-10 h-10 border border-white/20 rounded-lg flex items-center justify-center text-[8px] font-black">COD</div>
              </div>
            </div>
          </div>

          <p className="text-[10px] text-center text-slate-400 font-black uppercase tracking-[0.2em] px-10 leading-relaxed">
            En cliquant sur confirmer, vous acceptez nos conditions générales de vente et confirmez l'exactitude des informations fournies.
          </p>
        </div>
      </div>
    </div>
  );
};
