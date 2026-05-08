import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  FiXCircle, FiMapPin, FiPhone, FiUser, 
  FiCalendar, FiHash, FiMessageSquare,
  FiSlash, FiAlertTriangle, FiTrash2, FiLoader
} from 'react-icons/fi';

const CancelledTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchCancelled = async () => {
      try {
        const res = await axios.get(`${API_URL}/job/my-tasks`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data.success) {
          // Filtering only 'cancelled' tasks locally
          const voidedOnly = res.data.data.filter(task => task.status === 'cancelled');
          setTasks(voidedOnly);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCancelled();
  }, []);

  if (loading) return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center bg-white">
      <FiLoader className="animate-spin text-rose-600 mb-4" size={30} />
      <span className="text-[10px] font-black uppercase tracking-[4px] text-slate-400">Retrieving Archives</span>
    </div>
  );

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-12 font-sans">
      
      {/* --- Header & Summary Section --- */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-20 gap-8">
        <div className="max-w-2xl">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-10 h-[2px] bg-rose-600"></span>
            <span className="text-[10px] font-black text-rose-600 uppercase tracking-[5px]">Terminated Stream</span>
          </div>
          <h1 className="text-6xl font-black text-zinc-900 tracking-tighter uppercase leading-[0.85]">
            Voided <span className="text-slate-300 italic font-light">Service</span>
          </h1>
          <p className="text-slate-500 font-medium mt-8 leading-relaxed max-w-lg">
            This archive contains service tasks that were cancelled or terminated. Review the logs below to understand the termination reasons.
          </p>
        </div>

        {/* Void Counter Card */}
        <div className="bg-white border-2 border-slate-100 rounded-[45px] p-10 min-w-[320px] shadow-xl shadow-slate-100/50 flex items-center justify-between relative overflow-hidden group">
          <div className="relative z-10">
            <p className="text-[10px] font-black text-rose-600 uppercase tracking-[3px] mb-2">Voided Count</p>
            <h2 className="text-6xl font-black text-zinc-900 tracking-tighter">{tasks.length}</h2>
          </div>
          <div className="w-16 h-16 bg-rose-50 rounded-[24px] flex items-center justify-center text-rose-600 shadow-inner">
            <FiSlash size={32} strokeWidth={3} />
          </div>
          {/* Subtle Decorative Background */}
          <div className="absolute -right-4 -top-4 opacity-5 pointer-events-none">
            <FiXCircle size={150} />
          </div>
        </div>
      </div>

      {/* --- Cancelled Tasks Grid --- */}
      {tasks.length > 0 ? (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
          {tasks.map((task) => (
            <div key={task._id} className="group bg-white border border-slate-100 rounded-[60px] p-2 hover:border-rose-100 transition-all duration-700 hover:shadow-2xl hover:shadow-rose-50/50">
              <div className="bg-white rounded-[55px] p-8 md:p-12 border border-slate-50">
                
                {/* Meta Header: Reference & Status */}
                <div className="flex justify-between items-center mb-10">
                  <div className="flex items-center gap-2 px-4 py-1.5 bg-slate-50 border border-slate-100 rounded-full">
                    <FiHash className="text-slate-400" size={12} />
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                      REF-{task._id.slice(-8).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 px-5 py-2 bg-rose-50 text-rose-600 rounded-full text-[9px] font-black uppercase tracking-widest border border-rose-100">
                    <FiXCircle />
                    {task.status}
                  </div>
                </div>

                {/* Task Title & Reason Placeholder */}
                <h3 className="text-3xl font-black text-zinc-900 mb-6 tracking-tight group-hover:text-rose-600 transition-colors">
                  {task.title}
                </h3>
                <p className="text-slate-400 text-sm font-medium leading-relaxed mb-10 bg-rose-50/30 p-6 rounded-[30px] border-l-4 border-rose-200 italic">
                  {task.description}
                </p>

                {/* Technical Data Grid */}
                <div className="grid grid-cols-2 gap-y-10 gap-x-6 mb-12 ml-2">
                  <div className="flex flex-col gap-2">
                    <span className="text-[9px] font-black text-slate-300 uppercase tracking-[2px]">Specialist</span>
                    <div className="flex items-center gap-2">
                       <div className="w-5 h-5 bg-slate-100 rounded-md flex items-center justify-center text-[8px] text-slate-500 font-bold">
                         S
                       </div>
                       <span className="text-xs font-black text-zinc-800 uppercase tracking-tighter">Verified Worker</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="text-[9px] font-black text-slate-300 uppercase tracking-[2px]">Site Location</span>
                    <span className="text-xs font-black text-zinc-800 uppercase tracking-tighter flex items-center gap-1">
                      <FiMapPin size={14} className="text-rose-400" /> {task.location}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="text-[9px] font-black text-slate-300 uppercase tracking-[2px]">Contact Hash</span>
                    <span className="text-xs font-black text-zinc-800 uppercase tracking-tighter flex items-center gap-1">
                      <FiPhone size={14} className="text-rose-400" /> {task.phone}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="text-[9px] font-black text-slate-300 uppercase tracking-[2px]">Logged on</span>
                    <span className="text-xs font-black text-zinc-800 uppercase tracking-tighter flex items-center gap-1">
                      <FiCalendar size={14} className="text-rose-400" /> {new Date(task.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Final Log Thread (Notes) */}
                {task.notes && task.notes.length > 0 && (
                  <div className="pt-10 border-t border-slate-100">
                    <div className="flex items-center gap-2 mb-6 ml-2">
                      <FiMessageSquare size={16} className="text-rose-200" />
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Termination Logs</span>
                    </div>
                    <div className="space-y-4">
                      {task.notes.map((note, idx) => (
                        <div key={idx} className="bg-slate-50/50 rounded-[28px] p-5 border border-slate-100 hover:bg-white hover:border-rose-100 transition-all duration-300">
                          <div className="flex justify-between items-center mb-3">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-black text-zinc-900 uppercase underline decoration-rose-200 underline-offset-4">{note.senderName}</span>
                              <span className="text-[8px] bg-zinc-900 text-white px-2 py-0.5 rounded font-black uppercase tracking-tighter">
                                {note.senderRole}
                              </span>
                            </div>
                            <span className="text-[9px] text-slate-400 font-bold">{note.time}</span>
                          </div>
                          <p className="text-[12px] text-slate-500 font-medium italic leading-relaxed">"{note.text}"</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="py-40 flex flex-col items-center justify-center bg-slate-50/30 rounded-[100px] border-2 border-dashed border-slate-100">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-xl shadow-slate-100 mb-8 border border-slate-50">
            <FiTrash2 className="text-slate-200" size={40} />
          </div>
          <h2 className="text-3xl font-black text-zinc-900 uppercase tracking-tighter">Archive Empty</h2>
          <p className="text-slate-400 font-medium mt-3">No cancelled tasks found in the database.</p>
        </div>
      )}

      {/* --- Minimal Branding Footer --- */}
      <div className="mt-32 flex flex-col items-center gap-6 opacity-30">
        <div className="h-[1px] w-40 bg-gradient-to-r from-transparent via-rose-600 to-transparent"></div>
        <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[10px]">End of Stream</span>
      </div>
    </div>
  );
};

export default CancelledTasks;