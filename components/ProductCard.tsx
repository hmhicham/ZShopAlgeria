
import React from 'react';
import { ShoppingCart, Heart, Star, Plus } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (p: Product) => void;
  onToggleWishlist: (p: Product) => void;
  isWishlisted: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, onToggleWishlist, isWishlisted }) => {
  const isOutOfStock = product.stockStatus === 'Out of Stock';

  return (
    <div className="group bg-white rounded-2xl sm:rounded-3xl overflow-hidden border border-gray-100 hover:border-[#0A7D3E]/30 transition-all duration-500 product-card-hover">
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />

        {/* Badges */}
        <div className="absolute top-2 sm:top-4 left-2 sm:left-4 flex flex-col gap-1 sm:gap-2">
          {product.isNew && (
            <span className="bg-[#0A7D3E] text-white text-[9px] sm:text-[10px] font-black uppercase tracking-wider px-2 sm:px-3 py-0.5 sm:py-1 rounded-full shadow-lg">
              Nouveau
            </span>
          )}
          {product.compare_price && product.compare_price > product.price && (
            <span className="bg-[#FF6B35] text-white text-[9px] sm:text-[10px] font-black uppercase tracking-wider px-2 sm:px-3 py-0.5 sm:py-1 rounded-full shadow-lg flex items-center gap-1">
              Promo
            </span>
          )}
          <span className={`text-[9px] sm:text-[10px] font-black uppercase tracking-wider px-2 sm:px-3 py-0.5 sm:py-1 rounded-full shadow-lg ${isOutOfStock ? 'bg-rose-100 text-rose-600' : 'bg-white/90 backdrop-blur-sm text-slate-700'
            }`}>
            {isOutOfStock ? 'Épuisé' : product.stockStatus === 'Low Stock' ? 'Stock limité' : 'En stock'}
          </span>
        </div>

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product);
          }}
          className={`absolute top-2 sm:top-4 right-2 sm:right-4 p-1.5 sm:p-2.5 bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl transition-all shadow-lg duration-300 ${isWishlisted
            ? 'text-rose-500 opacity-100 translate-y-0 scale-110'
            : 'text-slate-400 hover:text-rose-500 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0'
            }`}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart size={16} className="sm:w-[18px] sm:h-[18px]" fill={isWishlisted ? "currentColor" : "none"} />
        </button>

        {/* Quick Add (Bottom Image) */}
        {!isOutOfStock && (
          <div className="absolute bottom-2 sm:bottom-4 left-2 right-2 sm:left-4 sm:right-4 translate-y-12 group-hover:translate-y-0 transition-transform duration-300 opacity-0 group-hover:opacity-100">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart(product);
              }}
              className="w-full bg-[#003820]/90 backdrop-blur-md text-white py-2 sm:py-3 rounded-xl sm:rounded-2xl font-bold flex items-center justify-center gap-1 sm:gap-2 hover:bg-[#0A7D3E] transition-all text-sm sm:text-base"
            >
              <Plus size={16} className="sm:w-[18px] sm:h-[18px]" />
              <span className="hidden sm:inline">Ajouter au Panier</span>
              <span className="sm:hidden">Ajouter</span>
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3 sm:p-6">
        <div className="flex items-center justify-between mb-2 sm:mb-3">
          <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-[#0A7D3E]">{product.category}</span>
          <div className="flex items-center gap-1">
            <Star size={10} className="sm:w-3 sm:h-3 text-[#FFD700] fill-[#FFD700]" />
            <span className="text-[10px] sm:text-xs font-bold text-slate-700">{product.rating}</span>
          </div>
        </div>

        <h3 className="text-sm sm:text-lg font-bold text-slate-900 mb-1 sm:mb-2 line-clamp-1 group-hover:text-[#0A7D3E] transition-colors cursor-pointer">
          {product.name}
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 mb-3 sm:mb-5 line-clamp-2 min-h-[32px] sm:min-h-[40px]">
          {product.description}
        </p>

        <div className="flex items-center justify-between pt-2 sm:pt-4 border-t border-gray-50">
          <div className="flex flex-col">
            <span className="text-[9px] sm:text-[10px] text-slate-400 font-bold uppercase tracking-widest">Prix</span>
            <div className="flex items-baseline flex-wrap gap-x-1 sm:gap-x-2">
              <span className="text-base sm:text-xl md:text-2xl font-extrabold text-slate-900 break-all">
                {product.price.toLocaleString()} <span className="text-[10px] sm:text-xs text-[#0A7D3E]">DZD</span>
              </span>
              {product.compare_price && product.compare_price > product.price && (
                <span className="text-xs text-slate-400 line-through font-bold">
                  {product.compare_price.toFixed(0)}
                </span>
              )}
            </div>
          </div>

          <button
            disabled={isOutOfStock}
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product);
            }}
            className={`p-2 sm:p-3 rounded-xl sm:rounded-2xl transition-all ${isOutOfStock
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-[#0A7D3E]/10 text-[#0A7D3E] hover:bg-[#0A7D3E] hover:text-white glow-on-hover'
              }`}
            aria-label={isOutOfStock ? "Out of stock" : "Add to cart"}
          >
            <ShoppingCart size={18} className="sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
