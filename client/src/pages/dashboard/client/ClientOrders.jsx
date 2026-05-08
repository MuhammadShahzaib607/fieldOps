import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  FiPackage, FiMapPin, FiPhone, FiUser, 
  FiMessageSquare, FiXCircle, FiClock, 
  FiCheckCircle, FiSlash, FiLoader, FiPlus,
  FiTrendingUp, FiAlertCircle
} from 'react-icons/fi';

const ClientOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchMyOrders();
  }, []);

  const fetchMyOrders = async () => {
    try {
      const res = await axios.get(`${API_URL}/job/my-orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setOrders(res.data.data);
      }
    } catch (err) {
      console.error("Order fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  // Stats Calculation
  const stats = {
    pending: orders.filter(o => o.status === 'pending').length,
    inProgress: orders.filter(o => o.status === 'in-progress').length,
    completed: orders.filter(o => o.status === 'completed').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length,
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this service?")) return;
    setCancellingId(orderId);
    try {
      const res = await axios.put(`${API_URL}/job/cancel-my-order/${orderId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setOrders(prev => prev.map(order => 
          order._id === orderId ? { ...order, status: 'cancelled' } : order
        ));
      }
    } catch (err) {
      alert(err.response?.data?.message || "Cancellation failed.");
    } finally {
      setCancellingId(null);
    }
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        <FiLoader className="animate-spin text-zinc-950" size={40} />
        <span className="text-[10px] font-black uppercase tracking-[4px] text-zinc-400">Loading Fleet</span>
      </div>
    </div>
  );

  return (
    <div className="max-w-[1400px] mx-auto pb-24 px-6 pt-10">
      
      {/* 1. Page Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-black text-zinc-900 tracking-tight uppercase">Service Control <span className="text-red-600">Center</span></h1>
        <p className="text-slate-400 font-medium mt-1">Manage your active deployments and service requests.</p>
      </div>

      {/* 2. Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {[
          { label: 'Pending', count: stats.pending, icon: <FiClock />, color: 'text-amber-500', bg: 'bg-amber-50' },
          { label: 'Active', count: stats.inProgress, icon: <FiTrendingUp />, color: 'text-blue-500', bg: 'bg-blue-50' },
          { label: 'Completed', count: stats.completed, icon: <FiCheckCircle />, color: 'text-emerald-500', bg: 'bg-emerald-50' },
          { label: 'Cancelled', count: stats.cancelled, icon: <FiXCircle />, color: 'text-rose-500', bg: 'bg-rose-50' }
        ].map((item, i) => (
          <div key={i} className="bg-white border border-slate-100 p-6 rounded-[32px] shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{item.label}</p>
              <h3 className="text-3xl font-black text-zinc-900">{item.count}</h3>
            </div>
            <div className={`w-12 h-12 ${item.bg} ${item.color} rounded-2xl flex items-center justify-center text-xl`}>
              {item.icon}
            </div>
          </div>
        ))}
      </div>

      {/* 3. Orders Grid */}
      {orders.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {orders.map((order) => (
            <div key={order._id} className="bg-white border border-slate-100 rounded-[40px] overflow-hidden flex flex-col hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500">
              
              {/* Card Body */}
              <div className="p-8 md:p-10 flex-grow">
                {/* ID & Status Line */}
                <div className="flex justify-between items-start mb-6">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Job ID</span>
                    <span className="text-xs font-black text-zinc-900 tracking-tighter">#{order._id.slice(-8).toUpperCase()}</span>
                  </div>
                  <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                    order.status === 'in-progress' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                    order.status === 'completed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                    order.status === 'cancelled' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                    'bg-amber-50 text-amber-600 border-amber-100'
                  }`}>
                    {order.status}
                  </div>
                </div>

                <h2 className="text-2xl font-black text-zinc-900 mb-3 tracking-tight">{order.title}</h2>
                <p className="text-slate-500 text-sm font-medium leading-relaxed mb-8">{order.description}</p>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter flex items-center gap-1">
                      <FiUser size={10} className="text-red-600"/> Assigned Expert
                    </span>
                    <span className="text-xs font-bold text-zinc-800">{order.workerId?.username || 'Dispatching...'}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter flex items-center gap-1">
                      <FiMapPin size={10} className="text-red-600"/> Location
                    </span>
                    <span className="text-xs font-bold text-zinc-800 truncate">{order.location}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter flex items-center gap-1">
                      <FiPhone size={10} className="text-red-600"/> Support Contact
                    </span>
                    <span className="text-xs font-bold text-zinc-800">{order.phone}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter flex items-center gap-1">
                      <FiClock size={10} className="text-red-600"/> Scheduled
                    </span>
                    <span className="text-xs font-bold text-zinc-800">{new Date(order.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Notes Section - Refined UI */}
                {order.notes && order.notes.length > 0 && (
                  <div className="mt-8 space-y-3">
                    <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[2px] ml-1">Recent Logs</span>
                    {order.notes.slice(-2).map((note, idx) => (
                      <div key={idx} className="bg-slate-50 rounded-2xl p-4 border border-slate-100 group/note">
                        <div className="flex justify-between items-center mb-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black text-zinc-900 uppercase tracking-tighter">{note.senderName}</span>
                            <span className="text-[8px] bg-white border border-slate-200 text-slate-400 px-1.5 py-0.5 rounded font-bold uppercase">{note.senderRole}</span>
                          </div>
                          <span className="text-[8px] text-slate-400 font-medium">{note.time}</span>
                        </div>
                        <p className="text-[11px] text-slate-600 font-medium leading-relaxed italic">"{note.text}"</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Bar */}
              <div className="bg-slate-50/50 p-6 border-t border-slate-100 flex items-center justify-between">
                <div className="flex -space-x-2">
                   {/* <div className="w-8 h-8 rounded-full bg-white border-2 border-slate-50 flex items-center justify-center text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                     {order.clientId?.username?.charAt(0)}
                   </div>
                   <div className="w-8 h-8 rounded-full bg-zinc-900 border-2 border-slate-50 flex items-center justify-center text-[10px] font-bold text-white uppercase tracking-tighter">
                     {order.workerId?.username?.charAt(0) || '?'}
                   </div> */}
                </div>

                <div className="flex items-center gap-3">
                  {!["cancelled", "completed"].includes(order.status) && (
                    <>
                      <button 
                        onClick={() => handleCancelOrder(order._id)}
                        disabled={cancellingId === order._id}
                        className="h-12 px-6 rounded-2xl bg-white border border-rose-100 text-rose-500 text-[10px] font-black uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all shadow-sm active:scale-95 disabled:opacity-50"
                      >
                        {cancellingId === order._id ? <FiLoader className="animate-spin mx-auto" /> : "Cancel Order"}
                      </button>
                      <button 
                        onClick={() => navigate(`/add-note/${order._id}`)}
                        className="h-12 w-12 rounded-2xl bg-zinc-900 text-white flex items-center justify-center hover:bg-red-600 shadow-lg shadow-zinc-900/10 transition-all active:scale-90"
                        title="Add Note"
                      >
                        <FiPlus size={20} strokeWidth={3} />
                      </button>
                    </>
                  )}
                  {order.status === 'cancelled' && (
                    <span className="text-[10px] font-black text-rose-300 uppercase tracking-widest px-4 py-2 border border-dashed border-rose-200 rounded-xl">Order Cancelled</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-[50px] border-4 border-dashed border-slate-100 py-32 flex flex-col items-center justify-center">
           <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mb-6">
             <FiPackage size={40} />
           </div>
           <h3 className="text-xl font-black text-zinc-900 uppercase">Archive Empty</h3>
           <p className="text-slate-400 font-medium text-sm mt-1">All your requested services will appear here.</p>
        </div>
      )}
    </div>
  );
};

export default ClientOrders;