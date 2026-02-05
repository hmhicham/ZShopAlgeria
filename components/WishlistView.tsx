
import React from 'react';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { Product, View } from '../types';

interface WishlistViewProps {
  items: Product[];
  onRemove: (p: Product) => void;
  onAddToCart: (p: Product) => void;
  setView: (v: View) => void;
}

export const WishlistView: React.FC<WishlistViewProps> = ({ items, onRemove, onAddToCart, setView }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h2 className="text-4xl font-extrabold text-slate-900 mb-2">My Wishlist<span className="text-indigo-600">.</span></h2>
          <p className="text-slate-500">Your favorite premium items in one place.</p>
        </div>
        <button 
          onClick={() => setView('home')}
          className="flex items-center gap-2 text-indigo-600 font-bold hover:underline"
        >
          <span>Continue Shopping</span>
          <ArrowRight size={20} />
        </button>
      </div>

      {items.length === 0 ? (
        <div className="bg-white rounded-[3rem] p-20 text-center border border-gray-100 shadow-sm">
          <div className="w-24 h-24 bg-rose-50 text-rose-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Heart size={40} />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-2">Your wishlist is empty</h3>
          <p className="text-slate-500 mb-8 max-w-sm mx-auto">Browse our collection and tap the heart icon to save products you love.</p>
          <button 
            onClick={() => setView('home')}
            className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-indigo-600 transition-all"
          >
            Explore Collection
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {items.map(product => (
            <div key={product.id} className="group bg-white rounded-3xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all p-4">
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-50 mb-4">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                <button 
                  onClick={() => onRemove(product)}
                  className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-xl text-rose-500 shadow-lg hover:bg-rose-500 hover:text-white transition-all"
                >
                  <Trash2 size={18} />
                </button>
              </div>
              <div className="px-2">
                <h3 className="font-bold text-slate-900 mb-1">{product.name}</h3>
                <p className="text-2xl font-black text-indigo-600 mb-6">{product.price.toFixed(2)} DZD</p>
                <button 
                  onClick={() => onAddToCart(product)}
                  className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-600 transition-all"
                >
                  <ShoppingBag size={18} />
                  <span>Add to Cart</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
