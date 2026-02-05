
import React, { useState, useEffect } from 'react';
import { Tags, Plus, Trash2, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface ManageCategoriesProps {
  onUpdate: () => void;
}

export const ManageCategories: React.FC<ManageCategoriesProps> = ({ onUpdate }) => {
  const [categories, setCategories] = useState<{id: string, name: string}[]>([]);
  const [newCat, setNewCat] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    setLoading(true);
    const { data } = await supabase.from('categories').select('*').order('name');
    if (data) setCategories(data);
    setLoading(false);
  };

  useEffect(() => { fetchCategories(); }, []);

  const addCategory = async () => {
    if (!newCat.trim()) return;
    const { error } = await supabase.from('categories').insert({ 
      name: newCat.trim(),
      slug: newCat.trim().toLowerCase().replace(/\s+/g, '-')
    });
    if (!error) {
      setNewCat('');
      fetchCategories();
      onUpdate();
    } else {
      alert(error.message);
    }
  };

  const deleteCategory = async (id: string) => {
    if (!confirm('All products in this category will become uncategorized. Proceed?')) return;
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (!error) {
      fetchCategories();
      onUpdate();
    } else {
      alert(error.message);
    }
  };

  return (
    <div className="max-w-4xl animate-fadeIn space-y-8">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-black text-slate-900">Dynamic Categories</h2>
        <p className="text-slate-500">Update your storefront navigation in real-time.</p>
      </div>

      <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm">
        <form onSubmit={(e) => { e.preventDefault(); addCategory(); }} className="flex gap-4 mb-10">
          <input 
            type="text" value={newCat} onChange={e => setNewCat(e.target.value)}
            placeholder="New category name (e.g., Accessories)..."
            className="flex-1 bg-gray-50 border border-gray-100 rounded-2xl py-3.5 px-6 outline-none focus:ring-4 focus:ring-indigo-500/10"
          />
          <button type="submit" className="bg-indigo-600 text-white px-8 rounded-2xl font-black flex items-center gap-2 hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100">
            <Plus size={20} /> Add
          </button>
        </form>

        {loading ? (
          <div className="flex flex-col items-center justify-center p-12 gap-3 text-slate-400 font-bold text-xs uppercase tracking-widest">
            <Loader2 className="animate-spin text-indigo-600" size={32} />
            <span>Loading taxonomy...</span>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {categories.map((cat) => (
              <div key={cat.id} className="group p-6 bg-gray-50 rounded-3xl flex items-center justify-between hover:bg-white border border-transparent hover:border-indigo-100 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center"><Tags size={20} /></div>
                  <h4 className="font-bold text-slate-900">{cat.name}</h4>
                </div>
                <button onClick={() => deleteCategory(cat.id)} className="p-2 text-slate-300 hover:text-rose-500 transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
