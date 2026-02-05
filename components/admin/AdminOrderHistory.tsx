
import React from 'react';
import { ShoppingBag, Search, Eye, Truck, CheckCircle2, Clock, XCircle, X } from 'lucide-react';
import { Order } from '../../types';

interface AdminOrderHistoryProps {
  orders: Order[];
  onUpdateStatus: (id: number, status: Order['status']) => void;
}

export const AdminOrderHistory: React.FC<AdminOrderHistoryProps> = ({ orders, onUpdateStatus }) => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedOrder, setSelectedOrder] = React.useState<Order | null>(null);

  const filteredOrders = React.useMemo(() => {
    return orders.filter(order =>
      order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.shipping_address.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [orders, searchTerm]);

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3">
            <ShoppingBag className="text-indigo-600" />
            Global Order Fulfillment
          </h2>
          <p className="text-slate-500">Monitor and update the status of all active customer shipments.</p>
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by Order ID or Customer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white border border-gray-200 rounded-xl py-2.5 pl-11 pr-4 text-sm focus:ring-4 focus:ring-indigo-500/10 outline-none w-64"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-8 py-5 text-[11px] font-black uppercase tracking-widest text-slate-400">Order Ref</th>
              <th className="px-8 py-5 text-[11px] font-black uppercase tracking-widest text-slate-400">Customer</th>
              <th className="px-8 py-5 text-[11px] font-black uppercase tracking-widest text-slate-400">Date</th>
              <th className="px-8 py-5 text-[11px] font-black uppercase tracking-widest text-slate-400">Total</th>
              <th className="px-8 py-5 text-[11px] font-black uppercase tracking-widest text-slate-400">Status</th>
              <th className="px-8 py-5 text-[11px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-8 py-20 text-center">
                  <div className="flex flex-col items-center gap-4 text-slate-400">
                    <ShoppingBag size={48} className="opacity-20" />
                    <p className="font-bold">No orders found matching "{searchTerm}"</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-8 py-6">
                    <span className="font-mono font-black text-indigo-600">#{order.order_number}</span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-900 truncate max-w-[150px]">{order.shipping_address}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-sm font-medium text-slate-500">{order.date}</span>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-2xl font-black text-indigo-600">{order.total.toLocaleString()} DZD</p>
                  </td>
                  <td className="px-8 py-6">
                    <select
                      value={order.status}
                      onChange={(e) => onUpdateStatus(order.id, e.target.value as any)}
                      className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border outline-none cursor-pointer transition-colors ${order.status === 'Delivered' ? 'bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100' :
                        order.status === 'Shipped' ? 'bg-indigo-50 text-indigo-600 border-indigo-100 hover:bg-indigo-100' :
                          order.status === 'Cancelled' ? 'bg-rose-50 text-rose-600 border-rose-100 hover:bg-rose-100' :
                            'bg-amber-50 text-amber-600 border-amber-100 hover:bg-amber-100'
                        }`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"
                    >
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSelectedOrder(null)} />
          <div className="relative bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden animate-slideUp">
            <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Detailed Order Review</span>
                <h3 className="text-2xl font-black text-slate-900 mt-1">Order #{selectedOrder.order_number}</h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-3 bg-white hover:bg-gray-100 rounded-2xl border border-gray-100 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-8 max-h-[70vh] overflow-y-auto">
              {/* Order Info Grid */}
              <div className="grid grid-cols-2 gap-8 mb-10">
                <div className="space-y-4">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Customer & Shipping</p>
                    <p className="font-bold text-slate-900">{selectedOrder.shipping_address}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Order Date</p>
                    <p className="font-bold text-slate-900">{selectedOrder.date}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Payment Method</p>
                    <p className="font-bold text-slate-900">{selectedOrder.payment_method}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Current Status</p>
                    <select
                      value={selectedOrder.status}
                      onChange={(e) => {
                        const newStatus = e.target.value as any;
                        onUpdateStatus(selectedOrder.id, newStatus);
                        setSelectedOrder({ ...selectedOrder, status: newStatus });
                      }}
                      className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border outline-none cursor-pointer transition-colors ${selectedOrder.status === 'Delivered' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                        selectedOrder.status === 'Shipped' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' :
                          selectedOrder.status === 'Cancelled' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                            'bg-amber-50 text-amber-600 border-amber-100'
                        }`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Items Table */}
              <div className="rounded-3xl border border-gray-100 overflow-hidden mb-8">
                <table className="w-full text-left">
                  <thead className="bg-gray-50/50">
                    <tr>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Product</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Price</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Qty</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {selectedOrder.items?.map((item) => (
                      <tr key={item.id}>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0">
                              {item.image && <img src={item.image} className="w-full h-full object-cover" />}
                            </div>
                            <span className="font-bold text-slate-900 text-sm line-clamp-1">{item.product_name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-slate-500">{item.product_price} DZD</td>
                        <td className="px-6 py-4 text-sm font-bold text-slate-900">x{item.quantity}</td>
                        <td className="px-6 py-4 text-sm font-black text-indigo-600 text-right">{item.subtotal} DZD</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals Summary */}
              <div className="bg-slate-900 rounded-[2rem] p-8 text-white">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">Subtotal</span>
                    <span className="font-bold">{selectedOrder.subtotal} DZD</span>
                  </div>
                  {selectedOrder.discount_amount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-white/60">Discount Applied</span>
                      <span className="font-bold text-emerald-400">-{selectedOrder.discount_amount} DZD</span>
                    </div>
                  )}
                  <div className="pt-4 border-t border-white/10 flex justify-between items-end">
                    <span className="text-lg font-bold">Total Amount</span>
                    <span className="text-3xl font-black text-indigo-400">{selectedOrder.total.toFixed(2)} DZD</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
