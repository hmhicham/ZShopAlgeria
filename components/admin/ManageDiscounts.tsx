import React, { useState, useEffect } from 'react';
import { TicketPercent, Plus, Trash2, Loader2, Tag, Calendar, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Discount } from '../../types';

interface ManageDiscountsProps {
  onUpdate: () => void;
}

export const ManageDiscounts: React.FC<ManageDiscountsProps> = ({ onUpdate }) => {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discount_type: 'percentage' as 'percentage' | 'fixed' | 'shipping',
    discount_value: '',
    min_purchase: '0',
    usage_limit: '100',
    end_date: ''
  });

  const fetchDiscounts = async () => {
    setLoading(true);
    const { data } = await supabase.from('discount_codes').select('*').order('created_at', { ascending: false });
    if (data) setDiscounts(data);
    setLoading(false);
  };

  useEffect(() => { fetchDiscounts(); }, []);

  const addDiscount = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (formData.discount_type !== 'shipping' && !formData.discount_value) {
      alert('Please enter a discount value');
      return;
    }

    const { error } = await supabase.from('discount_codes').insert({
      code: formData.code.toUpperCase().trim(),
      description: formData.description.trim(),
      discount_type: formData.discount_type,
      discount_value: formData.discount_type === 'shipping' ? '0.00' : formData.discount_value,
      min_purchase_amount: formData.min_purchase,
      max_discount_amount: null,
      usage_limit: parseInt(formData.usage_limit) || 100,
      usage_count: 0,
      start_date: new Date().toISOString(),
      end_date: formData.end_date ? new Date(formData.end_date).toISOString() : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // +30 days default
      is_active: true
    });

    if (!error) {
      setFormData({
        code: '', description: '', discount_type: 'percentage',
        discount_value: '', min_purchase: '0', usage_limit: '100', end_date: ''
      });
      fetchDiscounts();
      onUpdate();
    } else {
      alert(error.message);
    }
  };

  const deleteDiscount = async (id: number) => {
    if (!confirm('Are you sure you want to retire this discount code?')) return;
    const { error } = await supabase.from('discount_codes').delete().eq('id', id);
    if (!error) {
      fetchDiscounts();
      onUpdate();
    }
  };

  return (
    <div className="max-w-6xl animate-fadeIn space-y-12">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3">
          <TicketPercent className="text-indigo-600" /> Promotional Codes
        </h2>
        <p className="text-slate-500">Manage store-wide discounts, flash sales, and shipping promos.</p>
      </div>

      <div className="grid xl:grid-cols-3 gap-8">
        <form onSubmit={addDiscount} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6 h-fit sticky top-8">
          <h3 className="text-xl font-black text-slate-900">New Campaign</h3>

          <div className="space-y-4">
            {/* Code & Type */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Code</label>
                <input type="text" required value={formData.code} onChange={e => setFormData({ ...formData, code: e.target.value })} placeholder="SALE2024" className="w-full bg-gray-50 p-3 rounded-xl border border-gray-100 outline-none focus:ring-2 focus:ring-indigo-500/10 font-mono font-bold uppercase" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Type</label>
                <select
                  value={formData.discount_type}
                  onChange={e => setFormData({ ...formData, discount_type: e.target.value as any })}
                  className="w-full bg-gray-50 p-3 rounded-xl border border-gray-100 outline-none focus:ring-2 focus:ring-indigo-500/10 text-sm font-bold"
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Amount</option>
                  <option value="shipping">Free Shipping</option>
                </select>
              </div>
            </div>

            {/* Value & Min Purchase */}
            {formData.discount_type !== 'shipping' && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Value</label>
                  <input type="number" required step="0.01" value={formData.discount_value} onChange={e => setFormData({ ...formData, discount_value: e.target.value })} placeholder="10.00" className="w-full bg-gray-50 p-3 rounded-xl border border-gray-100 outline-none focus:ring-2 focus:ring-indigo-500/10 font-mono" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Min Purchase</label>
                  <input type="number" step="0.01" value={formData.min_purchase} onChange={e => setFormData({ ...formData, min_purchase: e.target.value })} placeholder="0.00" className="w-full bg-gray-50 p-3 rounded-xl border border-gray-100 outline-none focus:ring-2 focus:ring-indigo-500/10 font-mono" />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Description</label>
              <input type="text" required value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} placeholder="Summer Sale..." className="w-full bg-gray-50 p-3 rounded-xl border border-gray-100 outline-none focus:ring-2 focus:ring-indigo-500/10 text-sm" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Limit</label>
                <input type="number" value={formData.usage_limit} onChange={e => setFormData({ ...formData, usage_limit: e.target.value })} placeholder="100" className="w-full bg-gray-50 p-3 rounded-xl border border-gray-100 outline-none focus:ring-2 focus:ring-indigo-500/10 font-mono" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Expires On</label>
                <input type="datetime-local" value={formData.end_date} onChange={e => setFormData({ ...formData, end_date: e.target.value })} className="w-full bg-gray-50 p-3 rounded-xl border border-gray-100 outline-none focus:ring-2 focus:ring-indigo-500/10 text-xs font-bold" />
              </div>
            </div>

          </div>
          <button className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black hover:bg-indigo-600 transition-all shadow-xl shadow-slate-100 flex items-center justify-center gap-2">
            <Plus size={18} /> Create Coupon
          </button>
        </form>

        <div className="xl:col-span-2 space-y-6">
          {loading ? (
            <div className="flex justify-center p-24"><Loader2 className="animate-spin text-indigo-600" size={32} /></div>
          ) : discounts.length === 0 ? (
            <div className="p-24 text-center text-slate-400 bg-white rounded-[2.5rem] border border-gray-100">
              <Tag size={48} className="mx-auto mb-4 opacity-10" />
              <p className="font-bold">No active promotional campaigns.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {discounts.map((d) => (
                <div key={d.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all group flex flex-col sm:flex-row gap-6 items-center">
                  <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <TicketPercent size={24} />
                  </div>

                  <div className="flex-1 text-center sm:text-left">
                    <div className="flex items-center justify-center sm:justify-start gap-3 mb-1">
                      <h4 className="font-black text-lg text-slate-900 mono">{d.code}</h4>
                      <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wide ${d.is_active ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                        {d.is_active ? 'Active' : 'Expired'}
                      </span>
                    </div>
                    <p className="text-slate-500 text-sm font-medium">{d.description}</p>
                    <div className="flex items-center justify-center sm:justify-start gap-4 mt-3 text-xs text-slate-400 font-bold">
                      <span className="flex items-center gap-1"><Calendar size={12} /> Ends {new Date(d.end_date).toLocaleDateString()}</span>
                      <span className="flex items-center gap-1">Limit: {d.usage_count}/{d.usage_limit}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xl font-black text-slate-900 mb-1">
                      {d.discount_type === 'shipping' ? 'Free Ship' :
                        d.discount_type === 'percentage' ? `${parseFloat(d.discount_value)}% OFF` :
                          `-${parseFloat(d.discount_value)} DZD`}
                    </div>
                    {parseFloat(d.min_purchase_amount) > 0 && (
                      <p className="text-xs text-slate-400 font-bold">Min: {parseFloat(d.min_purchase_amount)} DZD</p>
                    )}
                  </div>

                  <button onClick={() => d.id && deleteDiscount(d.id)} className="p-3 bg-gray-50 text-slate-300 hover:bg-rose-50 hover:text-rose-500 rounded-xl transition-colors">
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
