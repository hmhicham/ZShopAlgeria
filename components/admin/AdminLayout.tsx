
import React from 'react';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  BarChart3, 
  Tags, 
  TicketPercent, 
  PlusCircle,
  ChevronLeft,
  Users
} from 'lucide-react';
import { View } from '../../types';

interface AdminLayoutProps {
  children: React.ReactNode;
  currentView: View;
  setView: (v: View) => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children, currentView, setView }) => {
  const menuItems = [
    { id: 'admin-dashboard', label: 'Overview', icon: <LayoutDashboard size={20} /> },
    { id: 'admin-inventory', label: 'Inventory', icon: <Package size={20} /> },
    { id: 'admin-orders', label: 'Orders', icon: <ShoppingCart size={20} /> },
    { id: 'admin-users', label: 'Customers', icon: <Users size={20} /> },
    { id: 'admin-analytics', label: 'Analytics', icon: <BarChart3 size={20} /> },
    { id: 'admin-categories', label: 'Categories', icon: <Tags size={20} /> },
    { id: 'admin-discounts', label: 'Discounts', icon: <TicketPercent size={20} /> },
    { id: 'admin-add-product', label: 'Add Product', icon: <PlusCircle size={20} /> },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50/50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 sticky top-20 h-[calc(100vh-80px)] hidden lg:flex flex-col p-4">
        <div className="mb-8 px-4">
          <button 
            onClick={() => setView('home')}
            className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold transition-colors group"
          >
            <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm">Back to Store</span>
          </button>
        </div>

        <nav className="space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id as View)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                currentView === item.id 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' 
                  : 'text-slate-500 hover:bg-gray-50 hover:text-indigo-600'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Content Area */}
      <main className="flex-1 p-8 overflow-x-hidden">
        {children}
      </main>
    </div>
  );
};
