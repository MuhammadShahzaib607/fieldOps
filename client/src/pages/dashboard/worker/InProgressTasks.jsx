import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  FiActivity, FiMapPin, FiPhone, FiUser, 
  FiCalendar, FiHash, FiMessageSquare,
  FiLoader, FiZap, FiTarget, FiInbox
} from 'react-icons/fi';

const InProgressTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchInProgressTasks = async () => {
      try {
        const res = await axios.get(`${API_URL}/job/my-tasks`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data.success) {
          // Filtering 'in-progress' tasks locally
          const activeOnly = res.data.data.filter(task => task.status === 'in-progress');
          setTasks(activeOnly);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchInProgressTasks();
  }, []);

  if (loading) return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center bg-white">
      <FiLoader className="animate-spin text-indigo-600 mb-4" size={32} />
      <span className="text-[10px] font-black uppercase tracking-[4px] text-slate-400">Loading Active Stream</span>
    </div>
  );

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-12 font-sans">
      
      {/* --- Dynamic Header & Active Count --- */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-20 gap-8">
        <div className="max-w-xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-2 h-2 bg-indigo-600 rounded-full animate-ping"></div>
            <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[5px]">Live Deployment</span>
          </div>
          <h1 className="text-6xl font-black text-zinc-900 tracking-tighter uppercase leading-[0.85]">
            Active <span className="text-indigo-600 italic">Workload</span>
          </h1>
          <p className="text-slate-500 font-medium mt-8 leading-relaxed">
            Monitoring <span className="text-zinc-950 font-bold">{tasks.length} tasks</span> currently in the execution phase. Ensure all protocol notes are updated in real-time.
          </p>
        </div>

        {/* Performance Card */}
        <div className="bg-white border-2 border-indigo-600 rounded-[45px] p-10 min-w-[300px] shadow-2xl shadow-indigo-100 flex items-center gap-6 relative overflow-hidden group">
          <div className="relative z-10">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[3px] mb-2">Ongoing Phase</p>
            <h2 className="text-6xl font-black text-zinc-900 tracking-tighter">{tasks.length}</h2>
          </div>
          <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 relative z-10">
            <FiActivity size={32} />
          </div>
          <div className="absolute -right-6 -top-6 w-32 h-32 bg-indigo-50 rounded-full opacity-40 group-hover:scale-110 transition-transform duration-700"></div>
        </div>
      </div>

      {/* --- Tasks Grid --- */}
      {tasks.length > 0 ? (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
          {tasks.map((task) => (
            <div key={task._id} className="group bg-white border border-slate-100 rounded-[60px] p-2 hover:border-indigo-100 transition-all duration-700 hover:shadow-3xl hover:shadow-indigo-50/50">
              <div className="bg-white rounded-[55px] p-8 md:p-12 border border-slate-50">
                
                {/* Meta Header */}
                <div className="flex justify-between items-center mb-10">
                  <div className="flex items-center gap-2">
                    <FiHash className="text-slate-300" />
                    <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Node: {task._id.slice(-8).toUpperCase()}</span>
                  </div>
                  <div className="flex items-center gap-2 px-5 py-2 bg-indigo-600 text-white rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg shadow-indigo-200">
                    <FiZap size={12} className="animate-pulse" />
                    {task.status}
                  </div>
                </div>

                <h3 className="text-3xl font-black text-zinc-900 mb-6 tracking-tight group-hover:translate-x-1 transition-transform duration-300">
                  {task.title}
                </h3>
                
                {/* Visual Description Box */}
                <div className="bg-indigo-50/30 rounded-[35px] p-8 mb-12 border-l-4 border-indigo-600">
                  <p className="text-slate-500 text-sm font-medium leading-relaxed italic">
                    {task.description}
                  </p>
                </div>

                {/* Operations Intel Grid */}
                <div className="grid grid-cols-2 gap-x-8 gap-y-10 mb-12 ml-2">
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-[2px] flex items-center gap-2">
                      <FiTarget className="text-indigo-500" /> Site Objective
                    </p>
                    <p className="text-xs font-black text-zinc-800 uppercase tracking-tighter">{task.location}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-[2px] flex items-center gap-2">
                      <FiPhone className="text-indigo-500" /> Dispatch Line
                    </p>
                    <p className="text-xs font-black text-zinc-800 uppercase tracking-tighter">{task.phone}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-[2px] flex items-center gap-2">
                      <FiCalendar className="text-indigo-500" /> Commencement
                    </p>
                    <p className="text-xs font-black text-zinc-800 uppercase tracking-tighter">
                       {new Date(task.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-[2px] flex items-center gap-2">
                      <FiUser className="text-indigo-500" /> Personnel
                    </p>
                    <p className="text-xs font-black text-zinc-800 uppercase tracking-tighter">Verified Specialist</p>
                  </div>
                </div>

                {/* Protocol Notes (History) */}
                {task.notes && task.notes.length > 0 && (
                  <div className="pt-10 border-t border-slate-100">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-2">
                        <FiMessageSquare className="text-indigo-200" />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Deployment Memos</span>
                      </div>
                      <span className="text-[8px] font-bold text-indigo-400 uppercase tracking-tighter">Live Feed</span>
                    </div>
                    <div className="space-y-4">
                      {task.notes.map((note, idx) => (
                        <div key={idx} className="bg-white border border-slate-100 rounded-[30px] p-6 shadow-sm hover:border-indigo-100 transition-colors duration-300">
                          <div className="flex justify-between items-center mb-3">
                            <div className="flex items-center gap-2">
                              <span className="w-6 h-6 rounded-lg bg-indigo-50 text-indigo-600 text-[8px] flex items-center justify-center font-bold">{note.senderName?.charAt(0)}</span>
                              <span className="text-[10px] font-black text-zinc-900 uppercase underline decoration-indigo-100 underline-offset-4">{note.senderName}</span>
                              <span className="text-[8px] bg-zinc-900 text-white px-2 py-0.5 rounded font-black uppercase tracking-tighter">
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
          <div className="w-24 h-24 bg-white rounded-[40px] flex items-center justify-center shadow-xl mb-8">
            <FiActivity className="text-slate-200 animate-pulse" size={40} />
          </div>
          <h2 className="text-3xl font-black text-zinc-900 uppercase tracking-tighter">No Active Stream</h2>
          <p className="text-slate-400 font-medium mt-3">You don't have any tasks in progress at the moment.</p>
        </div>
      )}

      {/* --- Footer Signature --- */}
      <div className="mt-32 text-center opacity-40">
        <div className="inline-flex items-center gap-3 px-8 py-3 bg-slate-50 rounded-full border border-slate-100">
          <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-[6px]">System Frequency Balanced • 2026</span>
        </div>
      </div>
    </div>
  );
};

export default InProgressTasks;