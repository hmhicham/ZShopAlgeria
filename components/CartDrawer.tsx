
import React from 'react';
import { X, Minus, Plus, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: number, delta: number) => void;
  onRemove: (id: number) => void;
  onCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemove,
  onCheckout
}) => {
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = subtotal > 500 || subtotal === 0 ? 0 : 25;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose}></div>

      <div className="absolute inset-y-0 right-0 max-w-full flex">
        <div className="w-full max-w-md bg-white shadow-2xl flex flex-col h-full">
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <ShoppingBag className="text-[#0A7D3E]" size={22} />
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">Votre Panier</h2>
              <span className="bg-gray-100 px-2.5 py-1 rounded-lg text-xs font-bold text-slate-500">
                {items.reduce((a, b) => a + b.quantity, 0)}
              </span>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl text-slate-400" aria-label="Close cart">
              <X size={20} />
            </button>
          </div>

          {/* Items */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center text-gray-300 mb-4">
                  <ShoppingBag size={40} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Votre panier est vide</h3>
                <p className="text-slate-500 text-sm mb-6">Il semble que vous n'ayez encore rien ajouté.</p>
                <button onClick={onClose} className="text-[#0A7D3E] font-bold hover:underline">Commencer vos achats</button>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="flex gap-3 sm:gap-4">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-50 rounded-2xl overflow-hidden flex-shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-slate-900 leading-tight">{item.name}</h4>
                        <button
                          onClick={() => onRemove(item.id)}
                          className="text-slate-300 hover:text-rose-500 transition-colors p-1"
                          aria-label={`Remove ${item.name} from cart`}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <p className="text-xs text-[#0A7D3E] font-bold mt-1 uppercase tracking-wider">{item.category || `Catégorie ${item.category_id}`}</p>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-xl">
                        <button
                          onClick={() => onUpdateQuantity(item.id, -1)}
                          className="w-7 h-7 flex items-center justify-center bg-white rounded-lg shadow-sm text-slate-600 hover:text-[#0A7D3E]"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-8 text-center text-sm font-bold text-slate-900">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, 1)}
                          className="w-7 h-7 flex items-center justify-center bg-white rounded-lg shadow-sm text-slate-600 hover:text-[#0A7D3E]"
                          aria-label="Increase quantity"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <span className="font-black text-slate-900">{(item.price * item.quantity).toFixed(2)} DZD</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="p-6 border-t border-gray-100 bg-gray-50/50">
              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-sm text-slate-500">
                  <span>Sous-total</span>
                  <span className="font-bold text-slate-700">{subtotal.toFixed(2)} DZD</span>
                </div>
                <div className="flex justify-between text-sm text-slate-500">
                  <span>Livraison</span>
                  <span className="font-bold text-slate-700">{shipping === 0 ? 'Gratuite' : `${shipping.toFixed(2)} DZD`}</span>
                </div>
                <div className="flex justify-between text-lg font-black text-slate-900 pt-2 border-t border-gray-100">
                  <span>Total</span>
                  <span>{(subtotal + shipping).toFixed(2)} DZD</span>
                </div>
              </div>
              <button
                onClick={onCheckout}
                className="w-full bg-gradient-to-r from-[#0A7D3E] to-[#003820] text-white py-3.5 sm:py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-xl shadow-[#0A7D3E]/20 glow-on-hover text-sm sm:text-base"
              >
                <span>Passer la Commande</span>
                <ArrowRight size={20} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
