
import React, { useState, useEffect, useMemo } from 'react';
import { Star, Heart, ShoppingBag, ArrowLeft, Plus, Minus, User, Loader2, Edit3, Truck, ShieldCheck, CheckCircle, ChevronRight } from 'lucide-react';
import { Product, View, ProductReview, User as UserType } from '../types';
import { ProductCard } from './ProductCard';
import { supabase } from '../lib/supabase';

interface ProductDetailViewProps {
  product: Product;
  allProducts: Product[];
  wishlist: Product[];
  onAddToCart: (p: Product, qty: number) => void;
  onToggleWishlist: (p: Product) => void;
  onProductClick: (p: Product) => void;
  onEditProduct?: (p: Product) => void;
  isWishlisted: boolean;
  setView: (v: View) => void;
  user: UserType | null;
}

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({
  product, allProducts, wishlist, onAddToCart, onToggleWishlist, onProductClick, onEditProduct, isWishlisted, setView, user
}) => {
  const [qty, setQty] = useState(1);
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);

  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [productStats, setProductStats] = useState({ rating: product.rating, reviews_count: product.reviews_count });
  const [activeImage, setActiveImage] = useState(product.image || '');

  // Update active image when product changes
  useEffect(() => {
    setActiveImage(product.image || '');
  }, [product]);

  useEffect(() => {
    const fetchReviews = async () => {
      setIsLoadingReviews(true);
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          users(name)
        `)
        .eq('product_id', product.id);

      if (!error && data) {
        setReviews(data.map((r: any) => ({
          ...r,
          user_name: r.users?.name || 'Anonymous'
        })));
      }
      setIsLoadingReviews(false);
    };
    fetchReviews();
  }, [product.id]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.db_id) return;

    setIsSubmittingReview(true);
    const { error } = await supabase
      .from('reviews')
      .insert({
        product_id: product.id,
        user_id: user.db_id,
        rating: newReview.rating,
        comment: newReview.comment.trim(),
        helpful_count: 0
      });

    if (!error) {
      setNewReview({ rating: 5, comment: '' });
      // Refresh reviews
      const { data } = await supabase
        .from('reviews')
        .select(`*, users(name)`)
        .eq('product_id', product.id);
      if (data) {
        setReviews(data.map((r: any) => ({ ...r, user_name: r.users?.name || 'Anonymous' })));
        // Calculate new average rating and count
        const totalRating = data.reduce((sum: number, r: any) => sum + r.rating, 0);
        const newCount = data.length;
        const newAvg = newCount > 0 ? parseFloat((totalRating / newCount).toFixed(1)) : 0;
        setProductStats({ rating: newAvg, reviews_count: newCount });
        // Update product in database
        await supabase.from('products').update({ rating: newAvg, reviews_count: newCount }).eq('id', product.id);
      }
    }
    setIsSubmittingReview(false);
  };
  const relatedProducts = useMemo(() => {
    return allProducts
      .filter(p => p.category_id === product.category_id && p.id !== product.id)
      .slice(0, 4);
  }, [product, allProducts]);

  return (
    <div className="relative min-h-screen bg-white">
      {/* Vibrant "Alive" Background Mesh */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Animated Primary Glows */}
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-[#0A7D3E]/10 rounded-full blur-[120px] animate-float opacity-60" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#FFD700]/10 rounded-full blur-[100px] animate-float animation-delay-2000 opacity-40" />
        <div className="absolute top-[30%] left-[10%] w-[40%] h-[40%] bg-[#0A7D3E]/5 rounded-full blur-[150px] animate-pulse-slow" />

        {/* Texture Overlay */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10 10 L90 90 M90 10 L10 90' stroke='black' stroke-width='0.5' fill='none'/%3E%3C/svg%3E")`, backgroundSize: '100px 100px' }}
        />

        {/* Soft Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(255,255,255,0.8)_80%)]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <div className="flex items-center gap-4 text-sm font-bold">
            <button
              onClick={() => setView('home')}
              className="text-slate-400 hover:text-[#0A7D3E] transition-colors"
            >
              Collection
            </button>
            <ChevronRight size={14} className="text-slate-300" />
            <span className="text-[#0A7D3E] font-black uppercase tracking-widest text-[10px]">
              {product.category || `Catégorie ${product.category_id}`}
            </span>
            <ChevronRight size={14} className="text-slate-300" />
            <span className="text-slate-900 truncate max-w-[150px]">{product.name}</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setView('home')}
              className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold transition-colors group px-4 py-2 rounded-xl hover:bg-gray-50"
            >
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
              <span>Retour</span>
            </button>

            {user?.role === 'admin' && (
              <button
                onClick={() => onEditProduct && onEditProduct(product)}
                className="flex items-center gap-2 bg-[#0A7D3E]/10 text-[#0A7D3E] px-6 py-3 rounded-2xl font-bold hover:bg-[#0A7D3E] hover:text-white transition-all shadow-sm"
              >
                <Edit3 size={18} />
                <span>Gérer</span>
              </button>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Gallery Area */}
          <div className="space-y-6 relative">
            <div className="aspect-square bg-white rounded-[3rem] overflow-hidden border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.05)] group relative">
              {activeImage ? (
                <img
                  src={activeImage}
                  alt={product.name}
                  className="w-full h-full object-contain p-8 group-hover:scale-110 transition-transform duration-1000"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-200">
                  <ShoppingBag size={80} strokeWidth={1} />
                </div>
              )}

              {product.discount > 0 && (
                <div className="absolute top-6 left-6 bg-[#FF6B35] text-white px-4 py-2 rounded-2xl font-black shadow-xl shadow-[#FF6B35]/20 animate-bounce-slow">
                  -{product.discount}%
                </div>
              )}

              {product.images && product.images.length > 1 && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 p-2 bg-white/80 backdrop-blur-md rounded-full shadow-lg border border-white/50">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(img)}
                      className={`w-2 h-2 rounded-full transition-all ${activeImage === img ? 'bg-[#0A7D3E] w-6' : 'bg-gray-300 hover:bg-[#0A7D3E]/50'}`}
                    />
                  ))}
                </div>
              )}
            </div>

            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-5 gap-4">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`aspect-square rounded-2xl border-2 overflow-hidden transition-all bg-white p-2 ${activeImage === img ? 'border-[#0A7D3E] ring-4 ring-[#0A7D3E]/10' : 'border-transparent hover:border-gray-200'
                      }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Content Area */}
          <div className="space-y-8 bg-white/40 backdrop-blur-sm p-8 rounded-[3rem] border border-white/50 shadow-sm">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-5xl font-black text-slate-900 leading-tight">{product.name}</h1>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="flex text-amber-400">
                    {[1, 2, 3, 4, 5].map(s => <Star key={s} size={18} fill={s <= Math.floor(productStats.rating) ? 'currentColor' : 'none'} />)}
                  </div>
                  <span className="font-bold text-slate-900">{productStats.rating}</span>
                  <span className="text-slate-400 text-sm font-bold">({productStats.reviews_count} Avis)</span>
                </div>
                <div className="h-4 w-[1px] bg-gray-200"></div>
                <span className={`text-sm font-black uppercase tracking-wider ${product.stock_quantity > 0 ? 'text-[#0A7D3E]' : 'text-rose-600'}`}>
                  {product.stock_quantity > 0 ? 'En Stock' : 'Épuisé'}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Prix Actuel</span>
                {product.compare_price && product.compare_price > product.price && (
                  <span className="bg-[#FF6B35] text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-lg">
                    Promotion
                  </span>
                )}
              </div>
              <div className="flex items-end gap-3 flex-wrap">
                <p className="text-5xl font-black text-[#0A7D3E]">{product.price.toLocaleString()} <span className="text-2xl">DZD</span></p>
                {product.compare_price && product.compare_price > product.price && (
                  <p className="text-xl font-bold text-slate-300 line-through mb-1.5">{product.compare_price.toLocaleString()} DZD</p>
                )}
              </div>
            </div>

            <div className="bg-gray-50/50 p-6 rounded-3xl border border-gray-100/50">
              <p className="text-slate-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            <div className="pt-8 flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-1 bg-white p-1.5 rounded-2xl border border-gray-100 shadow-sm">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="w-10 h-10 flex items-center justify-center bg-gray-50 rounded-xl transition-colors text-slate-600 hover:text-[#0A7D3E]"
                >
                  <Minus size={18} />
                </button>
                <span className="w-12 text-center text-lg font-black text-slate-900">{qty}</span>
                <button
                  onClick={() => setQty(qty + 1)}
                  className="w-10 h-10 flex items-center justify-center bg-gray-50 rounded-xl transition-colors text-slate-600 hover:text-[#0A7D3E]"
                >
                  <Plus size={18} />
                </button>
              </div>

              <button
                onClick={() => onAddToCart(product, qty)}
                disabled={product.stock_quantity <= 0}
                className="flex-1 min-w-[200px] h-[64px] bg-gradient-to-r from-[#0A7D3E] to-[#003820] text-white rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:opacity-90 transition-all shadow-xl shadow-[#0A7D3E]/20 disabled:opacity-50 active:scale-95"
              >
                <ShoppingBag size={24} />
                <span>Ajouter au Panier</span>
              </button>

              <button
                onClick={() => onToggleWishlist(product)}
                className={`w-[64px] h-[64px] rounded-2xl flex items-center justify-center border-2 transition-all active:scale-95 ${isWishlisted ? 'border-rose-500 bg-rose-50 text-rose-500' : 'border-gray-100 bg-white text-slate-400 hover:border-rose-500 hover:text-rose-500'
                  }`}
              >
                <Heart size={28} fill={isWishlisted ? 'currentColor' : 'none'} />
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-gray-100">
              <div className="flex flex-col items-center text-center gap-2 p-3 rounded-2xl hover:bg-[#0A7D3E]/5 transition-all group">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#0A7D3E] shadow-sm group-hover:scale-110 transition-transform">
                  <Truck size={20} />
                </div>
                <span className="text-[10px] font-black text-slate-900 uppercase">Livraison Rapide</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2 p-3 rounded-2xl hover:bg-[#0A7D3E]/5 transition-all group">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#0A7D3E] shadow-sm group-hover:scale-110 transition-transform">
                  <ShieldCheck size={18} />
                </div>
                <span className="text-[10px] font-black text-slate-900 uppercase">100% Original</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2 p-3 rounded-2xl hover:bg-[#0A7D3E]/5 transition-all group">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#0A7D3E] shadow-sm group-hover:scale-110 transition-transform">
                  <CheckCircle size={18} />
                </div>
                <span className="text-[10px] font-black text-slate-900 uppercase">Paiement COD</span>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-24 pt-16 border-t border-gray-100">
          <div className="flex items-center gap-4 mb-12">
            <h2 className="text-3xl font-black text-slate-900">Avis Clients</h2>
            <div className="h-[2px] flex-1 bg-gray-100" />
          </div>

          <div className="grid lg:grid-cols-3 gap-12">
            {/* Review Stats/Summary */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-[0.03] rotate-12">
                  <Star size={120} fill="black" />
                </div>
                <div className="relative z-10">
                  <h3 className="text-5xl font-black text-slate-900 mb-2">{productStats.rating}</h3>
                  <div className="flex text-amber-400 mb-4">
                    {[1, 2, 3, 4, 5].map(s => <Star key={s} size={20} fill={s <= Math.floor(productStats.rating) ? 'currentColor' : 'none'} />)}
                  </div>
                  <p className="text-sm text-slate-500 font-bold uppercase tracking-widest">Basé sur {productStats.reviews_count} avis</p>

                  <div className="mt-8 space-y-3">
                    {[5, 4, 3, 2, 1].map((rating) => {
                      const count = reviews.filter(r => r.rating === rating).length;
                      const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                      return (
                        <div key={rating} className="flex items-center gap-4 group cursor-help">
                          <span className="text-xs font-bold text-slate-400 w-4">{rating}</span>
                          <div className="flex-1 h-2 bg-gray-50 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-amber-400 rounded-full transition-all duration-1000"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-[10px] font-black text-slate-300 w-8">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {user && (
                <form onSubmit={handleSubmitReview} className="bg-[#0A7D3E]/5 p-6 rounded-[2rem] border border-[#0A7D3E]/10">
                  <h3 className="font-black text-slate-900 mb-4 flex items-center gap-2">
                    <span className="text-[#0A7D3E]">Laissez un avis</span>
                  </h3>
                  <div className="flex items-center gap-2 mb-4 bg-white/50 p-2 rounded-xl">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewReview({ ...newReview, rating: star })}
                        className="p-1 hover:scale-125 transition-transform"
                      >
                        <Star
                          size={20}
                          className={star <= newReview.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}
                        />
                      </button>
                    ))}
                  </div>
                  <textarea
                    required
                    value={newReview.comment}
                    onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                    placeholder="Qu'avez-vous pensé du produit ?"
                    className="w-full bg-white border-none rounded-2xl p-4 mb-4 outline-none ring-1 ring-gray-100 focus:ring-2 focus:ring-[#0A7D3E]/20 shadow-sm resize-none text-sm"
                    rows={3}
                  />
                  <button
                    type="submit"
                    disabled={isSubmittingReview || !newReview.comment.trim()}
                    className="w-full bg-slate-900 text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-[#0A7D3E] transition-all disabled:opacity-50"
                  >
                    {isSubmittingReview ? 'Envoi...' : 'Publier'}
                  </button>
                </form>
              )}
            </div>

            {/* List of Reviews */}
            <div className="lg:col-span-2 space-y-6">
              {isLoadingReviews ? (
                <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#0A7D3E]" size={40} /></div>
              ) : reviews.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-12 bg-gray-50/50 rounded-[2rem] border border-dashed border-gray-200">
                  <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center text-gray-200 mb-4 shadow-sm">
                    <Star size={32} />
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 mb-2">Pas encore d'avis</h4>
                  <p className="text-slate-400 text-sm max-w-[250px]">Soyez le premier à partager votre expérience avec la communauté !</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {reviews.map(review => (
                    <div key={review.id} className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gray-50 rounded-2xl overflow-hidden flex items-center justify-center text-slate-400 ring-2 ring-transparent group-hover:ring-[#0A7D3E]/10 transition-all">
                            <User size={24} />
                          </div>
                          <div>
                            <p className="font-black text-slate-900">{review.user_name}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{new Date(review.created_at).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="flex text-amber-400 bg-amber-50 px-3 py-1.5 rounded-full">
                          {[1, 2, 3, 4, 5].map(s => <Star key={s} size={12} fill={s <= review.rating ? 'currentColor' : 'none'} />)}
                        </div>
                      </div>
                      <p className="text-slate-600 leading-relaxed text-lg italic">"{review.comment}"</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-24 pt-16 border-t border-gray-100">
            <div className="flex items-center gap-4 mb-12">
              <h2 className="text-3xl font-black text-slate-900">Articles Similaires</h2>
              <div className="h-[2px] flex-1 bg-gray-100 relative">
                <div className="absolute left-0 top-0 h-full w-20 bg-[#0A7D3E]" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedProducts.map(item => (
                <div key={item.id} onClick={() => onProductClick(item)} className="cursor-pointer">
                  <ProductCard
                    product={item}
                    isWishlisted={wishlist.some(p => p.id === item.id)}
                    onToggleWishlist={onToggleWishlist}
                    onAddToCart={(p) => onAddToCart(p, 1)}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
