import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  FiClock, FiMapPin, FiPhone, FiUser, 
  FiCalendar, FiHash, FiMessageSquare,
  FiAlertCircle, FiLayers, FiInbox, FiLoader
} from 'react-icons/fi';

const PendingTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchPendingTasks = async () => {
      try {
        const res = await axios.get(`${API_URL}/job/my-tasks`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data.success) {
          // Filtering only 'pending' tasks locally
          const pendingOnly = res.data.data.filter(task => task.status === 'pending');
          setTasks(pendingOnly);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPendingTasks();
  }, []);

  if (loading) return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center bg-white">
      <FiLoader className="animate-spin text-amber-500 mb-4" size={30} />
      <span className="text-[10px] font-black uppercase tracking-[4px] text-slate-400">Syncing Pending Queue</span>
    </div>
  );

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-12 font-sans">
      
      {/* --- Page Header & Summary --- */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-20 gap-8">
        <div className="max-w-2xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
            <span className="text-[10px] font-black text-amber-600 uppercase tracking-[5px]">Awaiting Initiation</span>
          </div>
          <h1 className="text-6xl font-black text-zinc-900 tracking-tighter uppercase leading-[0.85]">
            Pending <span className="text-slate-300 italic font-light">Assignments</span>
          </h1>
          <p className="text-slate-500 font-medium mt-8 leading-relaxed max-w-lg">
            These tasks are currently in the queue. Please review the service details and client notes before initiating the deployment.
          </p>
        </div>

        {/* Status Insight Card */}
        <div className="bg-zinc-900 rounded-[45px] p-10 text-white min-w-[320px] shadow-2xl shadow-zinc-200 flex items-center justify-between relative overflow-hidden group">
          <div className="relative z-10">
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[3px] mb-2">Backlog Items</p>
            <h2 className="text-6xl font-black tracking-tighter">{tasks.length}</h2>
          </div>
          <div className="bg-amber-500 p-4 rounded-3xl relative z-10 shadow-lg shadow-amber-500/20">
            <FiLayers size={35} className="text-white" />
          </div>
          <FiClock className="absolute -left-6 -bottom-6 opacity-10 text-white rotate-12" size={150} />
        </div>
      </div>

      {/* --- Tasks Grid --- */}
      {tasks.length > 0 ? (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
          {tasks.map((task) => (
            <div key={task._id} className="group bg-white border border-slate-100 rounded-[60px] p-2 hover:border-amber-200 transition-all duration-700 hover:shadow-2xl hover:shadow-amber-50/50">
              <div className="bg-white rounded-[55px] p-8 md:p-12">
                
                {/* ID & Priority Badge */}
                <div className="flex justify-between items-center mb-10">
                  <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest bg-slate-50 px-5 py-1.5 rounded-full border border-slate-100">
                    TASK-ID: {task._id.slice(-8).toUpperCase()}
                  </span>
                  <div className="flex items-center gap-2 px-4 py-1.5 bg-amber-50 text-amber-600 rounded-full text-[9px] font-black uppercase tracking-widest border border-amber-100">
                    <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"></span>
                    {task.status}
                  </div>
                </div>

                <h3 className="text-3xl font-black text-zinc-900 mb-6 tracking-tight group-hover:text-amber-600 transition-colors">
                  {task.title}
                </h3>
                
                {/* Description Box */}
                <div className="bg-slate-50 rounded-[35px] p-8 mb-12 border-l-4 border-amber-500">
                  <p className="text-slate-500 text-sm font-medium leading-relaxed italic">
                    {task.description}
                  </p>
                </div>

                {/* Logistics Intel Grid */}
                <div className="grid grid-cols-2 gap-x-8 gap-y-10 mb-12 ml-2">
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-[2px] flex items-center gap-2">
                      <FiUser className="text-amber-500" /> Client Contact
                    </p>
                    <p className="text-xs font-black text-zinc-800 uppercase tracking-tighter">Verified Client</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-[2px] flex items-center gap-2">
                      <FiMapPin className="text-amber-500" /> Site Location
                    </p>
                    <p className="text-xs font-black text-zinc-800 truncate uppercase tracking-tighter">{task.location}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-[2px] flex items-center gap-2">
                      <FiPhone className="text-amber-500" /> Phone
                    </p>
                    <p className="text-xs font-black text-zinc-800 uppercase tracking-tighter">{task.phone}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-[2px] flex items-center gap-2">
                      <FiCalendar className="text-amber-500" /> Assigned Date
                    </p>
                    <p className="text-xs font-black text-zinc-800 uppercase tracking-tighter">
                       {new Date(task.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Pre-Deployment Notes */}
                {task.notes && task.notes.length > 0 && (
                  <div className="pt-10 border-t border-slate-100">
                    <div className="flex items-center gap-2 mb-6 ml-2">
                      <FiMessageSquare className="text-amber-200" />
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Protocol Memos</span>
                    </div>
                    <div className="space-y-4">
                      {task.notes.map((note, idx) => (
                        <div key={idx} className="bg-white border border-slate-100 rounded-[30px] p-6 shadow-sm hover:border-amber-100 transition-colors">
                          <div className="flex justify-between items-center mb-3">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-black text-zinc-900 uppercase">{note.senderName}</span>
                              <span className="text-[8px] bg-zinc-900 text-white px-2 py-0.5 rounded font-black uppercase">
                                {note.senderRole}
                              </span>
                            </div>
                            <span className="text-[9px] text-slate-400 font-bold">{note.time}</span>
                          </div>
                          <p className="text-[12px] text-slate-600 font-medium italic leading-relaxed">"{note.text}"</p>
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
        <div className="py-40 flex flex-col items-center justify-center bg-slate-50/50 rounded-[100px] border-2 border-dashed border-slate-200">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-xl mb-8 border border-slate-100">
            <FiInbox className="text-slate-200" size={40} />
          </div>
          <h2 className="text-3xl font-black text-zinc-900 uppercase tracking-tighter">Queue Clear</h2>
          <p className="text-slate-400 font-medium mt-3">There are no pending tasks assigned to you.</p>
        </div>
      )}

      {/* --- Footer Signature --- */}
      <div className="mt-32 flex flex-col items-center gap-4 opacity-50">
        <FiAlertCircle className="text-amber-100" size={40} />
        <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[6px]">Awaiting Deployment Operations</span>
      </div>
    </div>
  );
};

export default PendingTasks;