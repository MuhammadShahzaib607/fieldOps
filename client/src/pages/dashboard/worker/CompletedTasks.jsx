import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  FiCheckCircle, FiMapPin, FiPhone, FiUser, 
  FiCalendar, FiHash, FiMessageSquare,
  FiAward, FiArchive, FiLoader
} from 'react-icons/fi';

const CompletedTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchCompletedTasks = async () => {
      try {
        const res = await axios.get(`${API_URL}/job/my-tasks`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data.success) {
          // Filtering 'completed' tasks locally
          const finishedOnly = res.data.data.filter(task => task.status === 'completed');
          setTasks(finishedOnly);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCompletedTasks();
  }, []);

  if (loading) return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center bg-white">
      <FiLoader className="animate-spin text-emerald-600 mb-4" size={32} />
      <span className="text-[10px] font-black uppercase tracking-[4px] text-slate-400">Archiving Records</span>
    </div>
  );

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-12 font-sans">
      
      {/* --- Page Header & Achievement Overview --- */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-20 gap-8">
        <div className="max-w-2xl">
          <div className="flex items-center gap-3 mb-4">
            {/* <FiShieldCheck className="text-emerald-600" size={18} /> */}
            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[5px]">Service Excellence</span>
          </div>
          <h1 className="text-6xl font-black text-zinc-900 tracking-tighter uppercase leading-[0.85]">
            Finished <span className="text-slate-300 italic font-light">Milestones</span>
          </h1>
          <p className="text-slate-500 font-medium mt-8 leading-relaxed max-w-lg">
            This repository contains all tasks you have successfully fulfilled. Each record serves as a verified proof of service completion.
          </p>
        </div>

        {/* Achievement Card */}
        <div className="bg-emerald-600 rounded-[45px] p-10 text-white min-w-[320px] shadow-2xl shadow-emerald-100 flex items-center justify-between relative overflow-hidden group">
          <div className="relative z-10">
            <p className="text-[10px] font-bold text-emerald-100 uppercase tracking-[3px] mb-2 opacity-80">Total Success</p>
            <h2 className="text-6xl font-black tracking-tighter">{tasks.length}</h2>
          </div>
          <div className="bg-emerald-500/50 p-5 rounded-[28px] relative z-10">
            <FiAward size={40} className="text-white" />
          </div>
          <FiCheckCircle className="absolute -left-4 -bottom-4 opacity-10 text-white rotate-12" size={150} />
        </div>
      </div>

      {/* --- Tasks Grid --- */}
      {tasks.length > 0 ? (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
          {tasks.map((task) => (
            <div key={task._id} className="bg-white border border-slate-100 rounded-[60px] p-2 hover:shadow-3xl hover:shadow-emerald-50/50 transition-all duration-700">
              <div className="bg-white rounded-[55px] p-8 md:p-12 border border-slate-50">
                
                {/* ID & Verification Seal */}
                <div className="flex justify-between items-center mb-10">
                  <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest bg-slate-50 px-4 py-1.5 rounded-full border border-slate-100">
                    LOG: {task._id.slice(-8).toUpperCase()}
                  </span>
                  <div className="flex items-center gap-2 text-emerald-600">
                    <FiCheckCircle size={18} strokeWidth={3} />
                    <span className="text-[10px] font-black uppercase tracking-[3px]">Verified</span>
                  </div>
                </div>

                <h3 className="text-3xl font-black text-zinc-900 mb-6 tracking-tight">
                  {task.title}
                </h3>
                
                {/* Summary Box */}
                <div className="relative mb-12">
                  <div className="absolute -left-6 top-0 bottom-0 w-1.5 bg-emerald-500 rounded-full"></div>
                  <p className="text-slate-500 text-sm font-medium leading-relaxed italic pl-4">
                    {task.description}
                  </p>
                </div>

                {/* Performance Analytics Grid */}
                <div className="grid grid-cols-2 gap-x-8 gap-y-10 mb-12 ml-2">
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-[2px] flex items-center gap-2">
                      <FiMapPin className="text-emerald-500" /> Completed At
                    </p>
                    <p className="text-xs font-black text-zinc-800 uppercase tracking-tighter">{task.location}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-[2px] flex items-center gap-2">
                      <FiPhone className="text-emerald-500" /> Client Ref
                    </p>
                    <p className="text-xs font-black text-zinc-800 uppercase tracking-tighter">{task.phone}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-[2px] flex items-center gap-2">
                      <FiCalendar className="text-emerald-500" /> Resolution Date
                    </p>
                    <p className="text-xs font-black text-zinc-800 uppercase tracking-tighter">
                       {new Date(task.updatedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-[2px] flex items-center gap-2">
                      <FiUser className="text-emerald-500" /> Assigned To
                    </p>
                    <p className="text-xs font-black text-zinc-800 uppercase tracking-tighter">Self / Specialist</p>
                  </div>
                </div>

                {/* Final Verification Notes */}
                {task.notes && task.notes.length > 0 && (
                  <div className="pt-10 border-t-2 border-dashed border-slate-100">
                    <div className="flex items-center gap-2 mb-6 ml-2">
                      <FiMessageSquare className="text-emerald-200" />
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Final Audit Memos</span>
                    </div>
                    <div className="space-y-4">
                      {task.notes.map((note, idx) => (
                        <div key={idx} className="bg-emerald-50/20 rounded-[35px] p-6 border border-emerald-50 hover:bg-white hover:border-emerald-100 transition-colors duration-300">
                          <div className="flex justify-between items-center mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-7 h-7 rounded-full bg-emerald-600 text-white text-[9px] flex items-center justify-center font-bold">{note.senderName?.charAt(0)}</div>
                              <span className="text-[11px] font-black text-zinc-900 uppercase tracking-tight">{note.senderName}</span>
                              <span className="text-[8px] border border-emerald-200 text-emerald-600 px-2 py-0.5 rounded-md font-black uppercase">
                                {note.senderRole}
                              </span>
                            </div>
                            <span className="text-[9px] text-slate-400 font-bold">{note.time}</span>
                          </div>
                          <p className="text-[12px] text-slate-600 font-medium leading-relaxed italic">"{note.text}"</p>
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
        <div className="py-40 flex flex-col items-center justify-center bg-white rounded-[100px] border-2 border-slate-50 shadow-inner">
          <div className="w-24 h-24 bg-emerald-50 rounded-[40px] flex items-center justify-center text-emerald-200 mb-8 border border-emerald-100">
            <FiArchive size={40} />
          </div>
          <h2 className="text-4xl font-black text-zinc-900 uppercase tracking-tighter">No History Found</h2>
          <p className="text-slate-400 font-medium mt-3">You haven't marked any tasks as completed yet.</p>
        </div>
      )}

      {/* --- Footer Signature --- */}
      <div className="mt-32 flex flex-col items-center gap-4 opacity-40">
        <FiCheckCircle className="text-emerald-200" size={50} />
        <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[10px]">Registry Finalized</span>
      </div>
    </div>
  );
};

export default CompletedTasks;