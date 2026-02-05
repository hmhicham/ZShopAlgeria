
import React, { useEffect, useState, useRef } from 'react';
import { DollarSign, ShoppingCart, Users, Package, TrendingUp, ArrowUpRight, Loader2, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface AdminDashboardProps {
  onViewOrders: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onViewOrders }) => {
  const [stats, setStats] = useState([
    { label: 'Total Revenue', value: '0.00 DZD', icon: <DollarSign size={24} />, color: 'bg-emerald-100 text-emerald-600', trend: '...' },
    { label: 'Total Orders', value: '0', icon: <ShoppingCart size={24} />, color: 'bg-indigo-100 text-indigo-600', trend: '...' },
    { label: 'Customers', value: '0', icon: <Users size={24} />, color: 'bg-purple-100 text-purple-600', trend: '...' },
    { label: 'Stock Alerts', value: '0', icon: <Package size={24} />, color: 'bg-rose-100 text-rose-600', trend: '...' },
  ]);
  const [recentSales, setRecentSales] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    const fetchStats = async () => {
      if (!mountedRef.current) return;
      setLoading(true);
      setError(null);

      try {
        const [ordersRes, usersRes, stockRes] = await Promise.all([
          supabase.from('orders').select('total, status, created_at'),
          supabase.from('users').select('id', { count: 'exact' }),
          supabase.from('products').select('id').lt('stock_quantity', 10)
        ]);

        if (!mountedRef.current) return;

        // Current requirement: Cancelled orders should not count towards Revenue
        const nonCancelledOrders = ordersRes.data?.filter(o => o.status !== 'Cancelled') || [];
        const totalRevenue = nonCancelledOrders.reduce((acc, curr) => acc + (curr.total || 0), 0);
        const totalOrders = nonCancelledOrders.length;
        const totalUsers = usersRes.count || 0;
        const totalAlerts = stockRes.data?.length || 0;

        setStats([
          { label: 'Total Revenue', value: `${totalRevenue.toLocaleString()} DZD`, icon: <DollarSign size={24} />, color: 'bg-emerald-100 text-emerald-600', trend: '+Live' },
          { label: 'Total Orders', value: totalOrders.toString(), icon: <ShoppingCart size={24} />, color: 'bg-indigo-100 text-indigo-600', trend: '+Live' },
          { label: 'Customers', value: totalUsers.toString(), icon: <Users size={24} />, color: 'bg-purple-100 text-purple-600', trend: '+Live' },
          { label: 'Stock Alerts', value: totalAlerts.toString(), icon: <Package size={24} />, color: 'bg-rose-100 text-rose-600', trend: 'Alert' },
        ]);

        const { data: recent } = await supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5);

        if (recent && mountedRef.current) setRecentSales(recent);
      } catch (e: any) {
        console.error("Dashboard fetch error:", e);
        if (mountedRef.current) setError("Unable to reach live metrics. Please check your database connection.");
      } finally {
        if (mountedRef.current) setLoading(false);
      }
    };

    fetchStats();

    return () => {
      mountedRef.current = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center py-32 gap-4 text-center">
        <Loader2 size={40} className="animate-spin text-indigo-600" />
        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Assembling Dashboard Analytics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-black text-slate-900">Store Overview</h2>
        <p className="text-slate-500">Live performance tracking from your Supabase backend.</p>
      </div>

      {error && (
        <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl flex items-center gap-3 text-amber-700 font-bold text-sm">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${stat.color} rounded-2xl flex items-center justify-center`}>
                {stat.icon}
              </div>
              <span className={`text-[10px] font-black px-2 py-1 rounded-lg flex items-center gap-1 uppercase tracking-tighter ${stat.trend.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                }`}>
                <TrendingUp size={10} />
                {stat.trend}
              </span>
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black text-slate-900">Recent Transactions</h3>
            <button
              onClick={onViewOrders}
              className="text-indigo-600 font-bold text-sm hover:underline flex items-center gap-1"
            >
              View All Orders <ArrowUpRight size={16} />
            </button>
          </div>
          <div className="space-y-6">
            {recentSales.length === 0 ? (
              <p className="text-slate-400 text-center py-8 font-medium">No recent orders found.</p>
            ) : (
              recentSales.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-2xl transition-colors cursor-pointer border border-transparent hover:border-indigo-50">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center font-bold text-xs">
                      #{order.order_number.slice(-3)}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-sm">{order.shipping_address.split(',')[0]}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">{new Date(order.created_at).toLocaleTimeString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-slate-900">{order.total.toLocaleString()} DZD</p>
                    <p className={`text-[9px] font-black uppercase tracking-widest ${order.status === 'Delivered' ? 'text-emerald-600' : 'text-amber-600'
                      }`}>{order.status}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm">
          <h3 className="text-xl font-black text-slate-900 mb-8">Inventory Levels</h3>
          <div className="space-y-6">
            {['Electronics', 'Fashion', 'Home', 'Sports'].map((cat, i) => (
              <div key={cat} className="space-y-2">
                <div className="flex justify-between text-[11px] font-black uppercase tracking-widest">
                  <span className="text-slate-500">{cat}</span>
                  <span className="text-indigo-600">{Math.max(10, 85 - i * 15)}%</span>
                </div>
                <div className="h-2 bg-gray-50 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 rounded-full transition-all duration-1000"
                    style={{ width: `${Math.max(10, 85 - i * 15)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
