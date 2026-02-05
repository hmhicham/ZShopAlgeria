
import React from 'react';
import { Package, Calendar, MapPin, ChevronRight, CheckCircle2, Truck, Clock } from 'lucide-react';
import { Order, View } from '../types';

interface OrderHistoryViewProps {
  orders: Order[];
  setView: (v: View) => void;
}

export const OrderHistoryView: React.FC<OrderHistoryViewProps> = ({ orders, setView }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="mb-12">
        <h2 className="text-4xl font-extrabold text-slate-900 mb-2">Order History<span className="text-indigo-600">.</span></h2>
        <p className="text-slate-500">Track and manage your recent purchases.</p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-[3rem] p-20 text-center border border-gray-100 shadow-sm">
          <div className="w-24 h-24 bg-indigo-50 text-indigo-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Package size={40} />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-2">No orders yet</h3>
          <p className="text-slate-500 mb-8 max-w-sm mx-auto">Start shopping and your order history will appear here.</p>
          <button 
            onClick={() => setView('home')}
            className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-indigo-600 transition-all"
          >
            Go to Shop
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map(order => (
            <div key={order.id} className="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-lg shadow-slate-100">
              <div className="p-6 sm:p-8 flex flex-col md:flex-row justify-between gap-6 border-b border-gray-50">
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Order Reference</span>
                  <h3 className="text-xl font-bold text-slate-900">#{order.order_number}</h3>
                  <div className="flex items-center gap-4 text-sm text-slate-500 mt-2">
                    <span className="flex items-center gap-1.5"><Calendar size={14} /> {order.date}</span>
                    <span className="flex items-center gap-1.5 truncate max-w-[200px]"><MapPin size={14} /> {order.shipping_address}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right hidden sm:block">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Amount</span>
                    <p className="text-2xl font-black text-indigo-600">{order.total.toFixed(2)} DZD</p>
                  </div>
                  <div className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 ${
                    order.status === 'Delivered' ? 'bg-green-50 text-green-600' :
                    order.status === 'Shipped' ? 'bg-blue-50 text-blue-600' :
                    'bg-amber-50 text-amber-600'
                  }`}>
                    {order.status === 'Delivered' ? <CheckCircle2 size={16} /> :
                     order.status === 'Shipped' ? <Truck size={16} /> :
                     <Clock size={16} />}
                    {order.status}
                  </div>
                </div>
              </div>
              <div className="p-6 sm:p-8 bg-gray-50/30">
                <div className="flex -space-x-4 overflow-hidden">
                  {order.items?.slice(0, 4).map((item, i) => (
                    <div key={i} className="w-12 h-12 rounded-full border-2 border-white overflow-hidden bg-white shadow-sm">
                      <img src={item.image} className="w-full h-full object-cover" />
                    </div>
                  ))}
                  {order.items && order.items.length > 4 && (
                    <div className="w-12 h-12 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                      +{order.items.length - 4}
                    </div>
                  )}
                </div>
                <button className="mt-6 flex items-center gap-2 text-sm font-bold text-indigo-600 hover:gap-3 transition-all">
                  <span>View Full Details</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
