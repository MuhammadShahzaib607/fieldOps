import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  FiShield, FiHardDrive, FiUsers, FiMail, 
  FiCalendar, FiSearch, FiMoreVertical, FiAlertCircle 
} from 'react-icons/fi';

const AllUsers = () => {
  const [groupedUsers, setGroupedUsers] = useState({ admins: [], workers: [], clients: [] });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchAndGroupUsers();
  }, []);

  const fetchAndGroupUsers = async () => {
    try {
      const res = await axios.get(`${API_URL}/auth/all-users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        const users = res.data.data;
        setGroupedUsers({
          admins: users.filter(u => u.role === 'admin'),
          workers: users.filter(u => u.role === 'worker'),
          clients: users.filter(u => u.role === 'client')
        });
      }
    } catch (err) {
      console.error("User fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  const UserCard = ({ user }) => (
    <div className="bg-white rounded-[20px] p-6 border border-slate-200 shadow-sm hover:shadow-md hover:border-red-100 transition-all group">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          {/* Professional Avatar: Zinc Background with Red Dot */}
          <div className="relative">
            <div className="w-12 h-12 rounded-xl bg-zinc-900 flex items-center justify-center text-white text-lg font-bold shadow-inner">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-red-600 border-2 border-white rounded-full"></div>
          </div>
          <div className="min-w-0">
            <h3 className="text-[14px] font-black text-zinc-900 uppercase tracking-tight truncate">
              {user.username}
            </h3>
            <p className="text-[11px] text-slate-400 font-medium truncate flex items-center gap-1">
               <FiMail size={10} /> {user.email}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between text-[10px]">
        <span className="font-bold text-slate-400 uppercase flex items-center gap-1">
          <FiCalendar /> Joined {new Date(user.createdAt || Date.now()).toLocaleDateString('en-GB')}
        </span>
      </div>
    </div>
  );

  const SectionHeader = ({ icon, title, count }) => (
    <div className="flex items-center gap-4 mb-6 mt-12 first:mt-0">
      <div className="w-10 h-10 rounded-xl bg-zinc-950 text-white flex items-center justify-center shadow-lg shadow-zinc-950/20">
        {icon}
      </div>
      <div>
        <h2 className="text-lg font-black text-zinc-950 tracking-tighter uppercase">{title}</h2>
        <p className="text-[10px] font-bold text-red-600 uppercase tracking-[2px]">{count} Total Members</p>
      </div>
      <div className="flex-1 h-[1px] bg-slate-200 ml-4 opacity-50"></div>
    </div>
  );

  const EmptyState = ({ message }) => (
    <div className="flex flex-col items-center justify-center py-12 bg-slate-50 rounded-[32px] border-2 border-dashed border-slate-200">
      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-slate-300 shadow-sm mb-4">
        <FiAlertCircle size={24} />
      </div>
      <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{message}</p>
    </div>
  );

  if (loading) return (
    <div className="flex h-96 items-center justify-center">
      <div className="w-8 h-8 border-4 border-red-600 border-t-transparent animate-spin rounded-full"></div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto pb-20 px-4">
      {/* Search & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
        <div>
          <h1 className="text-4xl font-black text-zinc-950 tracking-tighter uppercase">
            Directory<span className="text-red-600">.</span>
          </h1>
          <p className="text-slate-500 font-medium text-sm">Organized view of all system participants.</p>
        </div>
        <div className="relative w-full md:w-96">
          <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Quick search team members..."
            className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-12 pr-6 text-sm outline-none focus:border-red-600 transition-all shadow-sm font-medium"
          />
        </div>
      </div>

      {/* ADMINS SECTION */}
      <section className="mb-16">
        <SectionHeader icon={<FiShield size={18} />} title="Administrators" count={groupedUsers.admins.length} />
        {groupedUsers.admins.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {groupedUsers.admins.map(user => <UserCard key={user._id} user={user} />)}
          </div>
        ) : (
          <EmptyState message="No administrators found in the system" />
        )}
      </section>

      {/* WORKERS SECTION */}
      <section className="mb-16">
        <SectionHeader icon={<FiHardDrive size={18} />} title="Workers" count={groupedUsers.workers.length} />
        {groupedUsers.workers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {groupedUsers.workers.map(user => <UserCard key={user._id} user={user} />)}
          </div>
        ) : (
          <EmptyState message="No field personnel currently registered" />
        )}
      </section>

      {/* CLIENTS SECTION */}
      <section>
        <SectionHeader icon={<FiUsers size={18} />} title="Clients" count={groupedUsers.clients.length} />
        {groupedUsers.clients.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {groupedUsers.clients.map(user => <UserCard key={user._id} user={user} />)}
          </div>
        ) : (
          <EmptyState message="No client accounts detected" />
        )}
      </section>
    </div>
  );
};

export default AllUsers;