
import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ProductCard } from './components/ProductCard';
import { CartDrawer } from './components/CartDrawer';
import { AIShopper } from './components/AIShopper';
import { CheckoutView } from './components/CheckoutView';
import { OrderHistoryView } from './components/OrderHistoryView';
import { WishlistView } from './components/WishlistView';
import { ProductDetailView } from './components/ProductDetailView';
import { ProfileView } from './components/ProfileView';
import { Category, Product, CartItem, User, Order, View, Discount } from './types';
import { Loader2, Terminal, SlidersHorizontal, ArrowDown01, ArrowUp01, Clock, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from './lib/supabase';
import { Footer } from './components/Footer';
import { FloatingButtons } from './components/FloatingButtons';

// Auth Components
import { LoginView } from './components/auth/LoginView';
import { RegisterView } from './components/auth/RegisterView';

// Admin Components
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { ManageInventory } from './components/admin/ManageInventory';
import { AdminOrderHistory } from './components/admin/AdminOrderHistory';
import { Analytics } from './components/admin/Analytics';
import { ManageCategories } from './components/admin/ManageCategories';
import { ManageDiscounts } from './components/admin/ManageDiscounts';
import { AddProduct } from './components/admin/AddProduct';
import { ManageUsers } from './components/admin/ManageUsers';

export default function App() {
  const [view, setView] = useState<View>('home');
  const [activeCategoryId, setActiveCategoryId] = useState<number | 'All'>('All');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [isInitialAuthCheck, setIsInitialAuthCheck] = useState(true);
  const [isDataSyncing, setIsDataSyncing] = useState(false);

  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [appliedDiscount, setAppliedDiscount] = useState<Discount | null>(null);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'price-low' | 'price-high'>('newest');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000000]);
  const [showInStockOnly, setShowInStockOnly] = useState(false);

  // Temporary filter states for manual application
  const [tempPriceRange, setTempPriceRange] = useState<[number, number]>([0, 10000000]);
  const [tempShowInStockOnly, setTempShowInStockOnly] = useState(false);

  // New Navigation Filter States
  const [showOnlyNew, setShowOnlyNew] = useState(false);
  const [showOnlyOffers, setShowOnlyOffers] = useState(false);

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 8;

  const isFetchingRef = useRef(false);

  // LOGGING UTILITY
  const log = (action: string, data: any, type: 'info' | 'error' | 'success' = 'info') => {
    const emoji = type === 'error' ? '❌' : type === 'success' ? '✅' : '📡';
    console.group(`[ShopHub ${emoji}] ${action}`);
    console.log('Timestamp:', new Date().toLocaleTimeString());
    console.log('Data:', data);
    console.groupEnd();
  };

  const fetchUserProfile = async (sessionUser: any) => {
    log('Auth: Fetching User Profile', { email: sessionUser.email });
    try {
      // 1. Create a promise for the database query
      const dbQueryPromise = supabase
        .from('users')
        .select('*')
        .eq('email', sessionUser.email)
        .maybeSingle();

      // 2. Create a 3-second timeout promise
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Profile Query Timeout')), 3000)
      );

      // 3. Race the query against the timeout
      const result = await Promise.race([dbQueryPromise, timeoutPromise]) as any;
      const { data: userData, error: userDbError } = result;

      if (userDbError) throw userDbError;

      if (userData) {
        log('Auth: Profile Found', userData, 'success');
        return {
          id: sessionUser.id,
          db_id: userData.id,
          name: userData.name,
          email: sessionUser.email!,
          role: userData.role || 'customer',
          avatar: userData.avatar,
          phone: userData.phone,
          address: userData.address,
          created_at: userData.created_at
        };
      }
    } catch (e: any) {
      log('Auth: Profile Fetch Failed/Timed Out', e.message, 'error');
    }

    // Fallback: Always return basic session info if DB fetch fails
    return {
      id: sessionUser.id,
      name: sessionUser.user_metadata?.full_name || 'User',
      email: sessionUser.email!,
      role: sessionUser.user_metadata?.role || 'customer'
    };
  };

  const fetchGlobalData = useCallback(async (showLoader = false) => {
    if (isFetchingRef.current) {
      log('Sync: Blocked (Already fetching)', null);
      return;
    }

    log('Sync: Global Fetch Started', { showLoader });
    isFetchingRef.current = true;
    if (showLoader) setIsDataSyncing(true);

    try {
      const [catsRes, prodsRes, ordersRes] = await Promise.allSettled([
        supabase.from('categories').select('*').order('name'),
        supabase.from('products').select('*, product_images(image_url, is_primary)').order('created_at', { ascending: false }),
        supabase.from('orders').select('*, order_items(*)').order('created_at', { ascending: false })
      ]);

      if (catsRes.status === 'fulfilled') {
        if (catsRes.value.error) log('Sync: Categories Error', catsRes.value.error, 'error');
        else setCategories(catsRes.value.data || []);
      }

      let processedProducts: any[] = [];
      if (prodsRes.status === 'fulfilled') {
        if (prodsRes.value.error) log('Sync: Products Error', prodsRes.value.error, 'error');
        else {
          const catData = catsRes.status === 'fulfilled' ? (catsRes.value.data || []) : [];
          processedProducts = (prodsRes.value.data || []).map((p: any) => ({
            ...p,
            category: catData?.find((c: any) => c.id === p.category_id)?.name || 'Uncategorized',
            image: p.product_images?.find((img: any) => img.is_primary)?.image_url || p.product_images?.[0]?.image_url,
            images: p.product_images?.map((img: any) => img.image_url) || [],
            stockStatus: p.stock_quantity > 10 ? 'In Stock' : p.stock_quantity > 0 ? 'Low Stock' : 'Out of Stock',
            isNew: (new Date().getTime() - new Date(p.created_at).getTime()) < (30 * 24 * 60 * 60 * 1000)
          }));
          setProducts(processedProducts);
        }
      }

      if (ordersRes.status === 'fulfilled') {
        if (ordersRes.value.error) log('Sync: Orders Error', ordersRes.value.error, 'error');
        else {
          const rawOrders = ordersRes.value.data || [];
          setOrders(rawOrders.map((o: any) => ({
            ...o,
            date: new Date(o.created_at).toLocaleDateString(),
            items: o.order_items?.map((oi: any) => {
              // Find matching product in local processedProducts list
              const product = processedProducts.find(p => p.id === oi.product_id);
              return {
                ...oi,
                image: product?.image // Inject the product image
              };
            })
          })));
        }
      }

      log('Sync: Completed Successfully', null, 'success');
    } catch (err: any) {
      log('Sync: Uncaught Failure', err.message, 'error');
    } finally {
      isFetchingRef.current = false;
      if (showLoader) setIsDataSyncing(false);
    }
  }, []);

  useEffect(() => {
    const bootApp = async () => {
      log('System: Booting Application', null);

      // 1. Start fetching global data immediately (parallel)
      const dataFetchPromise = fetchGlobalData();

      // 2. Check Auth Session
      const authPromise = (async () => {
        try {
          // Robust session check with timeout
          const sessionPromise = supabase.auth.getSession();
          const sessionTimeout = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Session Check Timeout')), 3000)
          );

          const { data: { session } } = await Promise.race([sessionPromise, sessionTimeout]) as any;

          if (session?.user) {
            // fetchUserProfile now has internal timeout and fallback
            const profile = await fetchUserProfile(session.user);
            setUser(profile);
            if (profile.db_id) fetchWishlist(profile.db_id);
            log('System: User Identified', profile.email, 'success');
          } else {
            log('System: No Active Session', null);
          }
        } catch (e: any) {
          log('System: Auth Check Failed/Timed Out', e.message, 'error');
        } finally {
          // CRITICAL: Always release the loading screen
          setIsInitialAuthCheck(false);
        }
      })();

      // Wait for both but release initial check as soon as auth is ready
      await Promise.allSettled([dataFetchPromise, authPromise]);
    };

    bootApp();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      log('Auth: Event Triggered', { event });
      if (session?.user) {
        const profile = await fetchUserProfile(session.user);
        setUser(profile);
        if (profile.db_id) {
          await fetchWishlist(profile.db_id); // This will also use categories internally
        }
        setIsInitialAuthCheck(false);
      } else {
        setUser(null);
        setWishlist([]);
        if (view.startsWith('admin-') || view === 'profile' || view === 'orders') {
          setView('home');
        }
        setIsInitialAuthCheck(false);
      }
    });

    return () => authListener.subscription.unsubscribe();
  }, [fetchGlobalData]);

  // Log view changes to track navigation performance
  useEffect(() => {
    log('Navigation: View Changed', { view });
    if (view.startsWith('admin-')) {
      fetchGlobalData();
    }
  }, [view, fetchGlobalData]);

  const filteredProducts = useMemo(() => {
    let result = products.filter(p => {
      const matchesCategory = activeCategoryId === 'All' || p.category_id === activeCategoryId;
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPrice = p.price >= priceRange[0] && p.price <= priceRange[1];
      const matchesStock = !showInStockOnly || (p.stock_quantity || 0) > 0;

      const matchesNew = !showOnlyNew || p.isNew;
      const matchesOffers = !showOnlyOffers || (p.compare_price && p.compare_price > p.price);

      return p.is_active && matchesCategory && matchesSearch && matchesPrice && matchesStock && matchesNew && matchesOffers;
    });

    // Apply Sorting
    return result.sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      // 'newest' is default (based on ID or created_at if available)
      return b.id - a.id;
    });
  }, [activeCategoryId, products, searchQuery, priceRange, showInStockOnly, sortBy, showOnlyNew, showOnlyOffers]);

  const handleNavNew = () => {
    setView('home');
    setShowOnlyNew(true);
    setShowOnlyOffers(false);
    setActiveCategoryId('All');
    setSearchQuery('');
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  const handleNavOffers = () => {
    setView('home');
    setShowOnlyOffers(true);
    setShowOnlyNew(false);
    setActiveCategoryId('All');
    setSearchQuery('');
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  const handleNavAbout = () => {
    const footer = document.getElementById('footer');
    if (footer) {
      footer.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage, ITEMS_PER_PAGE]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

  // Reset page on filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategoryId, searchQuery, priceRange, showInStockOnly, sortBy, showOnlyNew, showOnlyOffers]);

  const cartSubtotal = useMemo(() => cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0), [cartItems]);
  const discountAmount = useMemo(() => {
    if (!appliedDiscount) return 0;
    const value = parseFloat(appliedDiscount.discount_value);

    if (appliedDiscount.discount_type === 'shipping') {
      // Logic to determine shipping cost matching the cart calculation
      const shippingCost = cartSubtotal > 500 || cartSubtotal === 0 ? 0 : 25;
      return shippingCost;
    }

    if (appliedDiscount.discount_type === 'percentage') {
      return cartSubtotal * (value / 100);
    }

    return value; // fixed amount
  }, [cartSubtotal, appliedDiscount]);
  const cartTotal = useMemo(() => {
    const total = cartSubtotal - discountAmount;
    return Math.max(0, total + (total > 500 || total === 0 ? 0 : 25));
  }, [cartSubtotal, discountAmount]);

  const fetchWishlist = useCallback(async (userDbId: number) => {
    if (!userDbId) return;
    log('Wishlist: Fetching', { userId: userDbId });
    const { data, error } = await supabase
      .from('wishlist')
      .select('product_id, products(*, product_images(image_url, is_primary))')
      .eq('user_id', userDbId);

    if (!error && data) {
      const wishlistProducts = data.map((item: any) => ({
        ...item.products,
        category: categories.find((c: any) => c.id === item.products.category_id)?.name || 'Uncategorized',
        image: item.products.product_images?.find((img: any) => img.is_primary)?.image_url || item.products.product_images?.[0]?.image_url
      }));
      setWishlist(wishlistProducts);
      log('Wishlist: Loaded', { count: wishlistProducts.length }, 'success');
    } else if (error) {
      log('Wishlist: Fetch Failed', error.message, 'error');
    }
  }, [categories]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setView('home');
  };

  const handleAddToCart = (product: Product, quantity: number = 1) => {
    log('Cart: Item Added', { productId: product.id, quantity });
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item);
      return [...prev, { ...product, quantity }];
    });
    setIsCartOpen(true);
  };

  const handleToggleWishlist = async (product: Product) => {
    if (!user?.db_id) return setView('login');
    const isInWishlist = wishlist.some(item => item.id === product.id);
    log('Wishlist: Toggle Request', { productId: product.id, isInWishlist });

    if (isInWishlist) {
      const { error } = await supabase.from('wishlist').delete().eq('user_id', user.db_id).eq('product_id', product.id);
      if (!error) {
        setWishlist(prev => prev.filter(item => item.id !== product.id));
        log('Wishlist: Removed', product.id, 'success');
      }
    } else {
      const { error } = await supabase.from('wishlist').insert({ user_id: user.db_id, product_id: product.id });
      if (!error) {
        setWishlist(prev => [...prev, product]);
        log('Wishlist: Added', product.id, 'success');
      }
    }
  };

  const handleUpdateOrderStatus = async (orderId: number, status: string) => {
    log('Admin: Order Update', { orderId, status });
    const oldOrder = orders.find(o => o.id === orderId);
    if (!oldOrder) return;

    const oldStatus = oldOrder.status;

    // Stock Reconciliation Logic
    if (oldStatus !== 'Cancelled' && status === 'Cancelled') {
      // Reverting stock: Adding items back to inventory
      log('Admin: Reverting stock for cancelled order', orderId);
      for (const item of oldOrder.items || []) {
        const { data: product } = await supabase.from('products').select('stock_quantity').eq('id', item.product_id).single();
        if (product) {
          const newStock = (product.stock_quantity || 0) + (item.quantity || 0);
          await supabase.from('products').update({ stock_quantity: newStock }).eq('id', item.product_id);
        }
      }
    } else if (oldStatus === 'Cancelled' && status !== 'Cancelled') {
      // Deducting stock: Moving from Cancelled back to an active state
      log('Admin: Re-deducting stock for un-cancelled order', orderId);
      for (const item of oldOrder.items || []) {
        const { data: product } = await supabase.from('products').select('stock_quantity').eq('id', item.product_id).single();
        if (product) {
          const newStock = Math.max(0, (product.stock_quantity || 0) - (item.quantity || 0));
          await supabase.from('products').update({ stock_quantity: newStock }).eq('id', item.product_id);
        }
      }
    }

    const { error } = await supabase.from('orders').update({ status }).eq('id', orderId);
    if (!error) {
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
      log('Admin: Order Updated', orderId, 'success');
      // Refresh products if stock changed
      if ((oldStatus === 'Cancelled' && status !== 'Cancelled') || (oldStatus !== 'Cancelled' && status === 'Cancelled')) {
        fetchGlobalData(false);
      }
    } else {
      log('Admin: Order Update Failed', error.message, 'error');
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (!confirm('Are you sure you want to permanently delete this product?')) return;
    log('Admin: Product Deletion', { productId: id });
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (!error) {
      setProducts(prev => prev.filter(p => p.id !== id));
      log('Admin: Product Deleted', id, 'success');
    } else {
      log('Admin: Deletion Failed', error.message, 'error');
    }
  };

  if (isInitialAuthCheck) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white p-8">
        <Loader2 size={48} className="text-indigo-600 animate-spin mb-4" />
        <p className="text-slate-500 font-bold animate-pulse uppercase tracking-widest text-[10px]">Verifying Session...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50/50">
      <Header
        cartCount={cartItems.reduce((a, b) => a + b.quantity, 0)}
        wishlistCount={wishlist.length}
        user={user}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAI={() => setIsAIOpen(true)}
        setView={setView}
        onLogout={handleLogout}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onNavNew={handleNavNew}
        onNavOffers={handleNavOffers}
        onNavAbout={handleNavAbout}
        onNavCollection={() => {
          setView('home');
          setShowOnlyNew(false);
          setShowOnlyOffers(false);
          setActiveCategoryId('All');
          setSearchQuery('');
          window.scrollTo({ top: 400, behavior: 'smooth' });
        }}
      />

      <main className="flex-1 relative">
        {/* Syncing Overlay Indicator */}
        {isDataSyncing && (
          <div className="fixed bottom-8 left-8 z-[200] bg-slate-900 text-white px-4 py-2 rounded-xl flex items-center gap-3 shadow-2xl animate-fadeIn border border-white/10">
            <Loader2 size={16} className="animate-spin text-indigo-400" />
            <span className="text-[10px] font-black uppercase tracking-widest">Master Link Sync Active</span>
          </div>
        )}

        {view.startsWith('admin-') && user?.role === 'admin' ? (
          <AdminLayout currentView={view} setView={setView}>
            {view === 'admin-dashboard' && <AdminDashboard onViewOrders={() => setView('admin-orders')} />}
            {view === 'admin-inventory' && (
              <ManageInventory
                products={products}
                onDelete={handleDeleteProduct}
                onEdit={(p) => { setEditProduct(p); setView('admin-edit-product'); }}
              />
            )}
            {view === 'admin-orders' && <AdminOrderHistory orders={orders} onUpdateStatus={handleUpdateOrderStatus} />}
            {view === 'admin-users' && <ManageUsers />}
            {view === 'admin-analytics' && <Analytics orders={orders} products={products} />}
            {view === 'admin-categories' && <ManageCategories onUpdate={() => fetchGlobalData(false)} />}
            {view === 'admin-discounts' && <ManageDiscounts onUpdate={() => fetchGlobalData(false)} />}
            {(view === 'admin-add-product' || view === 'admin-edit-product') && (
              <AddProduct
                editProduct={view === 'admin-edit-product' ? editProduct : null}
                onAdd={async () => { await fetchGlobalData(true); setView('admin-inventory'); }}
                onUpdate={async () => { await fetchGlobalData(true); setView('admin-inventory'); }}
                categories={categories}
                onCancel={() => { setEditProduct(null); setView('admin-inventory'); }}
              />
            )}
          </AdminLayout>
        ) : (
          <>
            {view === 'login' && <LoginView onLogin={(u) => { setUser(u); setView('home'); }} onSwitchToRegister={() => setView('register')} setView={setView} />}
            {view === 'register' && <RegisterView onSwitchToLogin={() => setView('login')} setView={setView} />}
            {view === 'profile' && user && <ProfileView user={user} onUpdate={setUser} setView={setView} />}
            {view === 'home' && (
              <>
                <Hero content={{ title: "Elite Tech & Fashion", subtitle: "Dynamic shopping powered by real-time inventory management.", image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1000&h=1000&fit=crop" }} />
                <section className="py-24 bg-white">
                  <div className="max-w-7xl mx-auto px-4">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-8">
                      <h2 className="text-4xl font-extrabold text-slate-900">Dynamic Catalog<span className="text-indigo-600">.</span></h2>
                      <div className="flex flex-wrap gap-2">
                        <button onClick={() => setActiveCategoryId('All')} className={`px-6 py-2.5 rounded-2xl text-sm font-bold transition-all ${activeCategoryId === 'All' ? 'bg-slate-900 text-white shadow-lg' : 'bg-gray-50 text-slate-500 hover:bg-gray-100'}`}>All</button>
                        {categories.map(cat => <button key={cat.id} onClick={() => setActiveCategoryId(cat.id)} className={`px-6 py-2.5 rounded-2xl text-sm font-bold transition-all ${activeCategoryId === cat.id ? 'bg-slate-900 text-white shadow-lg' : 'bg-gray-50 text-slate-500 hover:bg-gray-100'}`}>{cat.name}</button>)}
                      </div>
                    </div>

                    {/* Filter Controls */}
                    <div className="bg-gray-50/50 rounded-[2rem] p-6 mb-16 border border-gray-100/50 flex flex-wrap items-center gap-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-indigo-600 shadow-sm">
                          <SlidersHorizontal size={18} />
                        </div>
                        <p className="text-sm font-bold text-slate-900">Filters</p>
                      </div>

                      <div className="h-8 w-px bg-gray-200 hidden md:block" />

                      {/* Sort Selector */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Sort By</label>
                        <select
                          value={sortBy}
                          onChange={(e) => setSortBy(e.target.value as any)}
                          className="bg-white border border-gray-100 rounded-xl px-4 py-2 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20"
                        >
                          <option value="newest">Newest First</option>
                          <option value="price-low">Price: Low to High</option>
                          <option value="price-high">Price: High to Low</option>
                        </select>
                      </div>

                      {/* Price Range */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Price Range (DZD)</label>
                        <div className="flex items-center gap-3">
                          <input
                            type="number"
                            placeholder="Min"
                            value={tempPriceRange[0]}
                            onChange={(e) => setTempPriceRange([Number(e.target.value), tempPriceRange[1]])}
                            className="w-24 bg-white border border-gray-100 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 outline-none"
                          />
                          <span className="text-slate-300">-</span>
                          <input
                            type="number"
                            placeholder="Max"
                            value={tempPriceRange[1]}
                            onChange={(e) => setTempPriceRange([tempPriceRange[0], Number(e.target.value)])}
                            className="w-24 bg-white border border-gray-100 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 outline-none"
                          />
                        </div>
                      </div>

                      {/* In Stock Toggle */}
                      <button
                        onClick={() => setTempShowInStockOnly(!tempShowInStockOnly)}
                        className={`mt-auto flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all border ${tempShowInStockOnly
                          ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                          : 'bg-white text-slate-500 border-gray-100 hover:border-gray-200'
                          }`}
                      >
                        <CheckCircle2 size={16} />
                        <span>In Stock Only</span>
                      </button>

                      {/* Apply Button */}
                      <button
                        onClick={() => {
                          setPriceRange(tempPriceRange);
                          setShowInStockOnly(tempShowInStockOnly);
                        }}
                        className="mt-auto px-8 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-black shadow-lg shadow-indigo-100 hover:bg-indigo-700 active:scale-95 transition-all flex items-center gap-2"
                      >
                        Apply Filters
                      </button>

                      {/* Reset Filters */}
                      {(activeCategoryId !== 'All' || searchQuery !== '' || sortBy !== 'newest' || tempPriceRange[0] !== 0 || tempPriceRange[1] !== 10000000 || tempShowInStockOnly || showOnlyNew || showOnlyOffers) && (
                        <button
                          onClick={() => {
                            setActiveCategoryId('All');
                            setSearchQuery('');
                            setSortBy('newest');
                            setPriceRange([0, 10000000]);
                            setShowInStockOnly(false);
                            setTempPriceRange([0, 10000000]);
                            setTempShowInStockOnly(false);
                            setShowOnlyNew(false);
                            setShowOnlyOffers(false);
                          }}
                          className="mt-auto ml-auto text-xs font-bold text-indigo-600 hover:text-indigo-700 underline underline-offset-4"
                        >
                          Reset All Filters
                        </button>
                      )}
                    </div>
                    {products.length === 0 && isFetchingRef.current ? (
                      <div className="flex flex-col items-center justify-center py-32 gap-4">
                        <Loader2 size={40} className="animate-spin text-indigo-600" />
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Loading Collection...</p>
                      </div>
                    ) : filteredProducts.length === 0 ? (
                      <div className="py-20 text-center bg-gray-50 rounded-[3rem] border border-dashed border-gray-200">
                        <p className="text-slate-400 font-bold">No products found in this category.</p>
                      </div>
                    ) : (
                      <div className="space-y-12">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                          {paginatedProducts.map(p => (
                            <div key={p.id} onClick={() => { setSelectedProduct(p); setView('product-detail'); window.scrollTo(0, 0); }}>
                              <ProductCard product={p} isWishlisted={wishlist.some(w => w.id === p.id)} onToggleWishlist={() => handleToggleWishlist(p)} onAddToCart={handleAddToCart} />
                            </div>
                          ))}
                        </div>

                        {totalPages > 1 && (
                          <div className="flex items-center justify-center gap-2 pt-8 border-t border-gray-100">
                            <button
                              disabled={currentPage === 1}
                              onClick={() => { setCurrentPage(prev => prev - 1); window.scrollTo({ top: 400, behavior: 'smooth' }); }}
                              className="p-2.5 rounded-xl border border-gray-100 text-slate-500 hover:bg-gray-50 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                            >
                              <ChevronLeft size={20} />
                            </button>

                            <div className="flex items-center gap-1">
                              {[...Array(totalPages)].map((_, i) => (
                                <button
                                  key={i + 1}
                                  onClick={() => { setCurrentPage(i + 1); window.scrollTo({ top: 400, behavior: 'smooth' }); }}
                                  className={`w-10 h-10 rounded-xl text-sm font-black transition-all ${currentPage === i + 1
                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100'
                                    : 'text-slate-500 hover:bg-gray-50'
                                    }`}
                                >
                                  {i + 1}
                                </button>
                              ))}
                            </div>

                            <button
                              disabled={currentPage === totalPages}
                              onClick={() => { setCurrentPage(prev => prev + 1); window.scrollTo({ top: 400, behavior: 'smooth' }); }}
                              className="p-2.5 rounded-xl border border-gray-100 text-slate-500 hover:bg-gray-50 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                            >
                              <ChevronRight size={20} />
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </section>
              </>
            )}
            {view === 'product-detail' && selectedProduct && (
              <ProductDetailView
                product={selectedProduct}
                allProducts={products}
                wishlist={wishlist}
                onAddToCart={handleAddToCart}
                onToggleWishlist={() => handleToggleWishlist(selectedProduct)}
                onProductClick={setSelectedProduct}
                onEditProduct={(p) => { setEditProduct(p); setView('admin-edit-product'); }}
                isWishlisted={wishlist.some(p => p.id === selectedProduct.id)}
                setView={setView}
                user={user}
              />
            )}
            {view === 'checkout' && <CheckoutView items={cartItems} subtotal={cartSubtotal} discountAmount={discountAmount} appliedDiscount={appliedDiscount} total={cartTotal} onApplyDiscount={async (code) => {
              const { data, error } = await supabase.from('discount_codes').select('*').eq('code', code.toUpperCase()).eq('is_active', true).single();
              if (data && !error) {
                // Validation
                const now = new Date();

                // If the string from DB has no timezone, and we want to treat it as UTC,
                // we should append 'Z'. Many DBs return local-like strings.
                const parseDate = (d: string | null) => {
                  if (!d) return null;
                  // If it's just a space instead of T, and no Z, it might be local.
                  // But to be safe and consistent with standard Supabase/ISO, we check:
                  const isoStr = d.includes(' ') ? d.replace(' ', 'T') : d;
                  return new Date(isoStr.includes('Z') || isoStr.includes('+') ? isoStr : isoStr + 'Z');
                };

                const startDate = parseDate(data.start_date);
                const endDate = parseDate(data.end_date);

                if (startDate && now < startDate) {
                  alert('This promo code is not active yet.');
                  return false;
                }

                if (endDate && now > endDate) {
                  alert('This promo code has expired.');
                  return false;
                }

                if (data.usage_limit && data.usage_count >= data.usage_limit) {
                  alert('This promo code has reached its usage limit.');
                  return false;
                }

                if (data.min_purchase_amount && cartSubtotal < parseFloat(data.min_purchase_amount)) {
                  alert(`This code requires a minimum purchase of ${data.min_purchase_amount} DZD.`);
                  return false;
                }

                // Parse the value for UI helper percentage if it is a percentage type
                const val = parseFloat(data.discount_value);
                setAppliedDiscount({
                  ...data,
                  percentage: data.discount_type === 'percentage' ? val : undefined
                });
                return true;
              }
              return false;
            }} onPlaceOrder={async (info) => {
              if (!user?.db_id) return setView('login');
              const orderNumber = `SN-${Date.now().toString().slice(-6)}`;
              const { data: order, error } = await supabase.from('orders').insert({
                user_id: user.db_id, order_number: orderNumber, status: 'Pending', subtotal: cartSubtotal,
                discount_amount: discountAmount, total: cartTotal, shipping_address: `${info.name}, ${info.wilaya}, ${info.phone}`,
                payment_method: 'Cash on Delivery'
              }).select().single();
              if (!error && order) {
                const items = cartItems.map(item => ({
                  order_id: order.id, product_id: item.id, product_name: item.name,
                  product_price: item.price, quantity: item.quantity, subtotal: item.price * item.quantity
                }));
                await supabase.from('order_items').insert(items);

                // Update stock quantities for each product
                for (const item of cartItems) {
                  const { data: product } = await supabase.from('products').select('stock_quantity').eq('id', item.id).single();
                  if (product) {
                    const newStock = Math.max(0, product.stock_quantity - item.quantity);
                    await supabase.from('products').update({ stock_quantity: newStock }).eq('id', item.id);
                  }
                }

                // Increment discount usage count
                if (appliedDiscount) {
                  const { data: disc } = await supabase.from('discount_codes').select('usage_count').eq('id', appliedDiscount.id).single();
                  if (disc) {
                    await supabase.from('discount_codes').update({ usage_count: (disc.usage_count || 0) + 1 }).eq('id', appliedDiscount.id);
                  }
                }

                setCartItems([]); setAppliedDiscount(null); await fetchGlobalData(true); setView('orders');
              }
            }} setView={setView} />}
            {view === 'orders' && <OrderHistoryView orders={orders.filter(o => o.user_id === user?.db_id)} setView={setView} />}
            {view === 'wishlist' && <WishlistView items={wishlist} onRemove={handleToggleWishlist} onAddToCart={handleAddToCart} setView={setView} />}
          </>
        )}
      </main>
      <Footer setView={setView} />
      <FloatingButtons />

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} items={cartItems} onUpdateQuantity={(id, d) => setCartItems(prev => prev.map(x => x.id === id ? { ...x, quantity: Math.max(1, x.quantity + d) } : x))} onRemove={id => setCartItems(prev => prev.filter(x => x.id !== id))} onCheckout={() => { setIsCartOpen(false); setView('checkout'); }} />
      <AIShopper isOpen={isAIOpen} onClose={() => setIsAIOpen(false)} products={products.filter(p => p.is_active)} />

      {/* Dev Diagnostics Overlay (Visible to Admins only) */}
      {user?.role === 'admin' && (
        <div className="fixed top-4 left-4 z-[200] group">
          <div className="p-2 bg-slate-900/80 backdrop-blur rounded-lg text-white/50 cursor-help hover:text-white transition-colors">
            <Terminal size={14} />
          </div>
          <div className="absolute top-full left-0 mt-2 w-48 bg-slate-900 p-3 rounded-xl border border-white/10 hidden group-hover:block animate-fadeIn shadow-2xl">
            <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-2">Diagnostics</p>
            <div className="space-y-1">
              <p className="text-[9px]">Session: <span className="text-emerald-400">Active</span></p>
              <p className="text-[9px]">View: <span className="text-emerald-400">{view}</span></p>
              <p className="text-[9px]">Products: <span className="text-emerald-400">{products.length}</span></p>
              <p className="text-[9px]">Categories: <span className="text-emerald-400">{categories.length}</span></p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
