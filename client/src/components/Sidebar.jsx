import React, { useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom'; // NavLink better hai active state ke liye
import { 
  FiGrid, FiPlusSquare, FiBriefcase, FiUsers, 
  FiClock, FiCheckCircle, FiAlertCircle, FiXCircle, 
  FiLogOut, FiChevronRight, FiChevronLeft 
} from 'react-icons/fi';

const Sidebar = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false)
  const navigate = useNavigate();
  const role = localStorage.getItem('role') || 'worker'; 

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const menuConfig = {
    admin: [
      { name: 'All Jobs', icon: <FiBriefcase />, path: '/all-jobs' },
      { name: 'Create Job', icon: <FiPlusSquare />, path: '/create-job' },
      { name: 'Users', icon: <FiUsers />, path: '/users' },
      { type: 'divider', label: 'Statuses' },
      { name: 'Pending', icon: <FiClock />, path: '/admin/jobs/pending', color: 'text-amber-500' },
      { name: 'In Progress', icon: <FiAlertCircle />, path: '/admin/jobs/in-progress', color: 'text-blue-500' },
      { name: 'Completed', icon: <FiCheckCircle />, path: '/admin/jobs/completed', color: 'text-emerald-500' },
      { name: 'Cancelled', icon: <FiXCircle />, path: '/admin/jobs/cancelled', color: 'text-emerald-500' },
    ],
    worker: [
      { name: 'My Tasks', icon: <FiGrid />, path: '/my-tasks' },
      { type: 'divider', label: 'Statuses' },
      { name: 'Pending', icon: <FiClock />, path: '/worker/jobs/pending', color: 'text-amber-500' },
      { name: 'In Progress', icon: <FiAlertCircle />, path: '/worker/jobs/in-progress', color: 'text-blue-500' },
      { name: 'Completed', icon: <FiCheckCircle />, path: '/worker/jobs/completed', color: 'text-emerald-500' },
      { name: 'Cancelled', icon: <FiXCircle />, path: '/worker/jobs/cancelled', color: 'text-emerald-500' },
    ],
    client: [
      { name: 'All Orders', icon: <FiGrid />, path: '/all-orders' },
      { type: 'divider', label: 'Statuses' },
      { name: 'Pending', icon: <FiClock />, path: '/client/jobs/pending', color: 'text-amber-500' },
      { name: 'In Progress', icon: <FiAlertCircle />, path: '/client/jobs/in-progress', color: 'text-blue-500' },
      { name: 'Completed', icon: <FiCheckCircle />, path: '/client/jobs/completed', color: 'text-emerald-500' },
      { name: 'Cancelled', icon: <FiXCircle />, path: '/client/jobs/cancelled', color: 'text-emerald-500' },
    ]
  };

  const currentMenu = menuConfig[role] || menuConfig['worker'];

  return (
    <aside 
      className={`${
        isSidebarOpen ? 'w-72' : 'w-20'
      } bg-zinc-950 h-screen transition-all duration-300 ease-in-out flex flex-col z-50 relative`}
    >
      {/* Toggle Button Inside Sidebar */}
      <button 
        onClick={() => setSidebarOpen(!isSidebarOpen)}
        className="absolute -right-3 top-24 bg-red-600 text-white rounded-full p-1 shadow-lg z-50 hover:bg-red-700 transition-colors"
      >
        {isSidebarOpen ? <FiChevronLeft size={16}/> : <FiChevronRight size={16}/>}
      </button>

      {/* Logo Section */}
      <div className="p-6 flex items-center gap-3 border-b border-white/5 mb-4">
        <div className="w-9 h-9 bg-red-600 rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-red-600/30">
          <span className="text-white font-black italic text-xl">F</span>
        </div>
        {isSidebarOpen && (
          <span className="text-white font-bold tracking-tight text-xl uppercase">
            Field<span className="text-red-600">Ops</span>
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-1.5 overflow-y-auto overflow-x-hidden pt-2">
        {currentMenu.map((item, idx) => {
          if (item.type === 'divider') {
            return isSidebarOpen ? (
              <div key={idx} className="px-4 pt-6 pb-2 text-[10px] font-bold text-zinc-600 uppercase tracking-[2px]">
                {item.label}
              </div>
            ) : <div key={idx} className="h-px bg-white/5 my-4 mx-2" />;
          }

          return (
            <NavLink
              key={idx}
              to={item.path}
              className={({ isActive }) => `
                flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all group relative
                ${isActive 
                  ? 'bg-red-600 text-white shadow-lg shadow-red-600/20' 
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'}
              `}
            >
              <div className="text-xl shrink-0">{item.icon}</div>
              {isSidebarOpen && (
                <span className="text-[14px] font-semibold tracking-wide flex-1 truncate">
                  {item.name}
                </span>
              )}

              {/* Tooltip for Mini Sidebar */}
              {!isSidebarOpen && (
                <div className="absolute left-20 bg-zinc-800 text-white px-3 py-2 rounded-lg text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all shadow-xl border border-white/10">
                  {item.name}
                </div>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-white/5">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-4 px-4 py-3.5 text-zinc-500 hover:text-rose-500 hover:bg-rose-500/5 rounded-2xl transition-all group"
        >
          <FiLogOut className="text-xl group-hover:scale-110 transition-transform" />
          {isSidebarOpen && <span className="font-bold text-sm">Sign Out</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;