
import React, { useState, useEffect } from 'react';
import { Users, Search, Mail, Phone, MapPin, Shield, Loader2, MoreVertical, User as UserIcon } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { User } from '../../types';

export const ManageUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setUsers(data.map(u => ({
        ...u,
        db_id: u.id,
        id: u.id.toString(), // Simplified for UI mapping
      })));
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleRole = async (user: User) => {
    const newRole = user.role === 'admin' ? 'customer' : 'admin';
    const { error } = await supabase
      .from('users')
      .update({ role: newRole })
      .eq('id', user.db_id);

    if (!error) {
      setUsers(prev => prev.map(u => u.db_id === user.db_id ? { ...u, role: newRole as any } : u));
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3">
            <Users className="text-indigo-600" />
            User Management
          </h2>
          <p className="text-slate-500">Monitor your customer base and manage administrative roles.</p>
        </div>
        <div className="relative">
          <input 
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-white border border-gray-200 rounded-xl py-2.5 pl-11 pr-4 text-sm focus:ring-4 focus:ring-indigo-500/10 outline-none w-72 shadow-sm"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 size={40} className="animate-spin text-indigo-600" />
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Loading User Records...</p>
          </div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-8 py-5 text-[11px] font-black uppercase tracking-widest text-slate-400">User Profile</th>
                <th className="px-8 py-5 text-[11px] font-black uppercase tracking-widest text-slate-400">Contact Details</th>
                <th className="px-8 py-5 text-[11px] font-black uppercase tracking-widest text-slate-400">Address</th>
                <th className="px-8 py-5 text-[11px] font-black uppercase tracking-widest text-slate-400">Role</th>
                <th className="px-8 py-5 text-[11px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center text-slate-400 italic">No users matching your search.</td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.db_id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-indigo-50 rounded-2xl overflow-hidden flex items-center justify-center border-2 border-white shadow-sm shrink-0">
                          {user.avatar ? (
                            <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <UserIcon className="text-indigo-300" size={24} />
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{user.name}</p>
                          <p className="text-xs text-slate-400">Joined {new Date(user.created_at || '').toLocaleDateString()}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Mail size={14} className="text-slate-400" />
                          <span>{user.email}</span>
                        </div>
                        {user.phone && (
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Phone size={14} className="text-slate-400" />
                            <span>{user.phone}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="max-w-[200px] truncate text-sm text-slate-600 flex items-center gap-2">
                        <MapPin size={14} className="text-slate-400 shrink-0" />
                        <span>{user.address || 'Not provided'}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                        user.role === 'admin' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 'bg-gray-50 text-slate-500 border-gray-100'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button 
                        onClick={() => toggleRole(user)}
                        className={`p-2.5 rounded-xl transition-all ${
                          user.role === 'admin' ? 'bg-rose-50 text-rose-600 hover:bg-rose-100' : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
                        }`}
                        title={user.role === 'admin' ? "Revoke Admin Access" : "Grant Admin Access"}
                      >
                        <Shield size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
