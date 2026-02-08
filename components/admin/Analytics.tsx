import React, { useMemo } from 'react';
import { BarChart3, TrendingUp, Download, PieChart, ShoppingBag, ArrowUpRight, XCircle, CheckCircle2 } from 'lucide-react';
import { Order, Product } from '../../types';

interface AnalyticsProps {
  orders: Order[];
  products: Product[];
}

export const Analytics: React.FC<AnalyticsProps> = ({ orders, products }) => {
  const stats = useMemo(() => {
    const totalOrders = orders.length;
    const delivered = orders.filter(o => o.status === 'Delivered').length;
    const cancelled = orders.filter(o => o.status === 'Cancelled').length;
    const pending = orders.filter(o => o.status === 'Pending' || o.status === 'Processing').length;
    const totalRevenue = orders.filter(o => o.status !== 'Cancelled').reduce((acc, curr) => acc + (curr.total || 0), 0);

    // Delivery rate
    const deliveryRate = totalOrders > 0 ? (delivered / (delivered + cancelled || 1)) * 100 : 0;

    // Monthly Growth - Using real data for last 6 months
    const last6Months = Array.from({ length: 6 }, (_, i) => {
      const d = new Date();
      d.setMonth(d.getMonth() - (5 - i));
      return {
        label: d.toLocaleString('fr-FR', { month: 'short' }).toUpperCase(),
        revenue: 0,
        month: d.getMonth(),
        year: d.getFullYear()
      };
    });

    orders.filter(o => o.status !== 'Cancelled').forEach(o => {
      const orderDate = new Date(o.created_at);
      const m = last6Months.find(m => m.month === orderDate.getMonth() && m.year === orderDate.getFullYear());
      if (m) m.revenue += (o.total || 0);
    });

    const maxMonthlyRevenue = Math.max(...last6Months.map(m => m.revenue), 1000); // 1000 minimum for base scale
    const monthlyData = last6Months.map(m => ({
      ...m,
      height: (m.revenue / maxMonthlyRevenue) * 100
    }));

    // Product Sales Performance
    const productSalesMap: Record<string, { qty: number; revenue: number }> = {};
    orders.forEach(order => {
      if (order.status !== 'Cancelled' && order.items) {
        order.items.forEach((item: any) => {
          const key = item.product_id;
          if (!productSalesMap[key]) {
            productSalesMap[key] = { qty: 0, revenue: 0 };
          }
          productSalesMap[key].qty += (item.quantity || 0);
          productSalesMap[key].revenue += (item.subtotal || 0);
        });
      }
    });

    const topProducts = Object.entries(productSalesMap)
      .map(([id, data]) => {
        const prod = products.find(p => p.id === parseInt(id));
        return {
          name: prod?.name || 'Unknown Product',
          qty: data.qty,
          revenue: data.revenue,
          image: prod?.image
        };
      })
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    return {
      totalOrders,
      delivered,
      cancelled,
      pending,
      totalRevenue,
      deliveryRate: deliveryRate.toFixed(1),
      monthlyData,
      topProducts
    };
  }, [orders, products]);

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3">
            <BarChart3 className="text-indigo-600" />
            Statistiques & Performance
          </h2>
          <p className="text-slate-500 font-medium tracking-tight">Analyse détaillée de vos ventes et de la performance logistique.</p>
        </div>
        <button className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-black hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 uppercase tracking-widest">
          <Download size={18} />
          Exporter
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Revenue Growth Card */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h3 className="text-xl font-black text-slate-900">Croissance des Revenus</h3>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Volume des ventes mensuel (DA)</p>
            </div>
            <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-xl border border-gray-100">
              {['1W', '1M', '3M', '1Y'].map(t => (
                <button key={t} className={`px-4 py-1.5 text-[10px] font-black rounded-lg transition-all ${t === '1M' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="h-[250px] flex items-end gap-3 px-2">
            {stats.monthlyData.map((m, i) => (
              <div key={i} className="flex-1 h-full flex flex-col justify-end items-center gap-3 group">
                <div
                  className="w-full bg-indigo-50 group-hover:bg-indigo-600 transition-all rounded-t-xl relative border-x border-t border-transparent group-hover:border-indigo-700 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]"
                  style={{ height: `${Math.max(m.height, 5)}%` }}
                >
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100 font-black shadow-xl z-10 whitespace-nowrap pointer-events-none">
                    {m.revenue.toLocaleString()} DA
                  </div>
                </div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{m.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Order Status Card */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-black text-slate-900 mb-8">Statut des Commandes</h3>
            <div className="space-y-6">
              {[
                { label: 'Livrées', value: stats.delivered, total: stats.totalOrders, color: 'bg-emerald-500', icon: <CheckCircle2 size={16} /> },
                { label: 'Annulées', value: stats.cancelled, total: stats.totalOrders, color: 'bg-rose-500', icon: <XCircle size={16} /> },
                { label: 'En Cours', value: stats.pending, total: stats.totalOrders, color: 'bg-amber-500', icon: <TrendingUp size={16} /> },
              ].map((item) => (
                <div key={item.label} className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-3 text-slate-600 font-bold uppercase tracking-tight text-xs">
                      <div className={`p-1.5 rounded-lg ${item.color.replace('bg-', 'bg-opacity-10 text-')} ${item.color}`}>
                        {item.icon}
                      </div>
                      {item.label}
                    </div>
                    <span className="font-black text-slate-900">{item.value}</span>
                  </div>
                  <div className="h-2 bg-slate-50 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.color} transition-all duration-1000`}
                      style={{ width: `${(item.value / (stats.totalOrders || 1)) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-slate-50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Taux de Livraison</p>
                <h4 className="text-3xl font-black text-slate-900 mt-1">{stats.deliveryRate}%</h4>
              </div>
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                <PieChart size={24} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Products Section */}
      <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h3 className="text-xl font-black text-slate-900">Performance des Produits</h3>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Meilleures ventes par volume d'affaires</p>
          </div>
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
            <ShoppingBag size={24} />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[700px]">
            <thead>
              <tr className="border-b border-gray-50">
                <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest pl-4">Produit</th>
                <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Quantité Vendue</th>
                <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Chiffre d'Affaires</th>
                <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right pr-4">Performance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {stats.topProducts.map((p, i) => (
                <tr key={i} className="group hover:bg-slate-50/50 transition-colors">
                  <td className="py-5 pl-4 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 border border-gray-100 flex-shrink-0">
                      <img src={p.image} className="w-full h-full object-cover" alt={p.name} />
                    </div>
                    <span className="font-bold text-slate-900 tracking-tight">{p.name}</span>
                  </td>
                  <td className="py-5">
                    <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg font-black text-xs uppercase tracking-widest">
                      {p.qty} Unités
                    </span>
                  </td>
                  <td className="py-5">
                    <span className="font-black text-slate-900">{p.revenue.toLocaleString()} DA</span>
                  </td>
                  <td className="py-5 text-right pr-4">
                    <div className="inline-flex items-center gap-1.5 text-emerald-600 font-bold text-sm bg-emerald-50 px-3 py-1 rounded-full">
                      <TrendingUp size={14} />
                      {(p.revenue / (stats.totalRevenue || 1) * 100).toFixed(1)}%
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
