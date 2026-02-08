
import React, { useState, useMemo } from 'react';
import { Package, Search, Edit3, Trash2, Loader2, ArrowUpDown } from 'lucide-react';
import { Product } from '../../types';

interface ManageInventoryProps {
  products: Product[];
  onDelete: (id: number) => void;
  onEdit: (p: Product) => void;
  isLoading?: boolean;
}

export const ManageInventory: React.FC<ManageInventoryProps> = ({ products, onDelete, onEdit, isLoading }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'stock'>('name');

  const filteredAndSortedProducts = useMemo(() => {
    return products
      .filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.sku?.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        if (sortBy === 'price') return b.price - a.price;
        if (sortBy === 'stock') return a.stock_quantity - b.stock_quantity;
        return 0;
      });
  }, [products, searchTerm, sortBy]);

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl font-black text-slate-900">Inventory Management</h2>
          <p className="text-slate-500">Track levels, update pricing, and manage your catalog.</p>
        </div>
        <div className="flex flex-wrap gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by name or SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white border border-gray-200 rounded-xl py-2.5 pl-11 pr-4 text-sm focus:ring-4 focus:ring-indigo-500/10 outline-none w-72 shadow-sm"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          </div>
          <select
            aria-label="Sort products by"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-white border border-gray-200 rounded-xl py-2.5 px-4 text-sm font-bold text-slate-600 outline-none"
          >
            <option value="name">Sort by Name</option>
            <option value="price">Sort by Price</option>
            <option value="stock">Sort by Stock</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 size={40} className="animate-spin text-indigo-600" />
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Syncing Catalog...</p>
          </div>
        ) : filteredAndSortedProducts.length === 0 ? (
          <div className="py-32 text-center text-slate-400">
            <Package size={48} className="mx-auto mb-4 opacity-10" />
            <p className="font-bold">No products found matching your search.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[800px]">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-8 py-5 text-[11px] font-black uppercase tracking-widest text-slate-400">Product</th>
                  <th className="px-8 py-5 text-[11px] font-black uppercase tracking-widest text-slate-400">Category</th>
                  <th className="px-8 py-5 text-[11px] font-black uppercase tracking-widest text-slate-400">Price</th>
                  <th className="px-8 py-5 text-[11px] font-black uppercase tracking-widest text-slate-400">Stock</th>
                  <th className="px-8 py-5 text-[11px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredAndSortedProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden shrink-0 border border-gray-200">
                          <img src={p.image} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-900 truncate max-w-[200px]">{p.name}</span>
                          <span className="text-[10px] font-mono font-bold text-slate-400">{p.sku}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-xs font-bold text-slate-500 bg-gray-100 px-3 py-1 rounded-full">{p.category || `Cat ${p.category_id}`}</span>
                    </td>
                    <td className="px-8 py-6">
                      <span className="font-black text-indigo-600">{p.price.toLocaleString()} DZD</span>
                    </td>
                    <td className="px-8 py-6">
                      <div className={`inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${p.stock_quantity > 10 ? 'bg-emerald-50 text-emerald-600' :
                          p.stock_quantity > 0 ? 'bg-amber-50 text-amber-600' :
                            'bg-rose-50 text-rose-600'
                        }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${p.stock_quantity > 10 ? 'bg-emerald-500' :
                            p.stock_quantity > 0 ? 'bg-amber-500' :
                              'bg-rose-500'
                          }`} />
                        {p.stock_quantity > 10 ? 'In Stock' : p.stock_quantity > 0 ? 'Low Stock' : 'Out of Stock'}
                        <span className="ml-1 opacity-60">({p.stock_quantity})</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onEdit(p)}
                          className="p-2 text-slate-400 hover:text-indigo-600 transition-colors bg-gray-50 rounded-lg"
                          aria-label={`Edit ${p.name}`}
                        >
                          <Edit3 size={18} />
                        </button>
                        <button
                          onClick={() => onDelete(p.id)}
                          className="p-2 text-slate-300 hover:text-rose-500 transition-colors bg-gray-50 rounded-lg"
                          aria-label={`Delete ${p.name}`}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
