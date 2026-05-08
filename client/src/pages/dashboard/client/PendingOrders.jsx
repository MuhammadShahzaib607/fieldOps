import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  FiClock, FiMapPin, FiPhone, FiUser, 
  FiLayers, FiCalendar, FiHash, FiMessageSquare,
  FiInfo, FiActivity, FiInbox
} from 'react-icons/fi';

const PendingOrders = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchPending = async () => {
      try {
        const res = await axios.get(`${API_URL}/job/my-orders`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data.success) {
          // Filtering only 'pending' jobs locally
          const pendingOnly = res.data.data.filter(job => job.status === 'pending');
          setJobs(pendingOnly);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPending();
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-3">
        <div className="w-12 h-12 border-[3px] border-slate-100 border-t-zinc-900 animate-spin rounded-full"></div>
        <p className="text-[10px] font-black uppercase tracking-[4px] text-slate-400">Syncing Data</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-12">
      
      {/* --- Static Content & Header --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
        <div className="max-w-2xl">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 bg-amber-50 text-amber-600 text-[10px] font-black uppercase tracking-widest rounded-lg border border-amber-100">
              Action Required
            </span>
            <div className="h-[1px] w-12 bg-slate-200"></div>
          </div>
          <h1 className="text-5xl font-black text-zinc-900 tracking-tighter uppercase leading-[0.9]">
            Pending <span className="text-slate-300 italic font-light">Queue</span>
          </h1>
          <p className="text-slate-500 font-medium mt-6 leading-relaxed">
            These jobs are currently in the awaiting state. Please review the notes and assigned personnel to initiate the workflow. 
            High-priority tasks are marked with timestamps.
          </p>
        </div>

        {/* Dynamic Counter Card */}
        <div className="bg-zinc-900 rounded-[35px] p-8 text-white min-w-[240px] shadow-2xl shadow-zinc-200 relative overflow-hidden group">
          <div className="relative z-10">
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[3px] mb-2">Awaiting Action</p>
            <h2 className="text-6xl font-black tracking-tighter">{jobs.length}</h2>
            <p className="text-[10px] text-zinc-400 mt-2 flex items-center gap-2">
              <FiActivity className="text-red-500" /> Active System Pulse
            </p>
          </div>
          <FiClock className="absolute -right-4 -bottom-4 text-zinc-800" size={120} />
        </div>
      </div>

      {/* --- Jobs Grid --- */}
      {jobs.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {jobs.map((job) => (
            <div key={job._id} className="bg-white border border-slate-100 rounded-[50px] p-2 hover:shadow-2xl hover:shadow-slate-100 transition-all duration-700 group">
              <div className="bg-white rounded-[44px] p-10">
                
                {/* Header: ID & Meta */}
                <div className="flex justify-between items-center mb-10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-50 rounded-2xl flex items-center justify-center text-zinc-400">
                      <FiHash size={18} />
                    </div>
                    <span className="text-[11px] font-black text-zinc-900 uppercase tracking-widest">
                      JOB-{job._id.slice(-6).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-600 rounded-full text-[9px] font-black uppercase tracking-widest border border-amber-100">
                    <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"></span>
                    {job.status}
                  </div>
                </div>

                {/* Title & Desc */}
                <h3 className="text-3xl font-black text-zinc-900 mb-4 tracking-tight group-hover:text-amber-600 transition-colors">
                  {job.title}
                </h3>
                <p className="text-slate-500 text-sm font-medium leading-relaxed mb-10 border-l-2 border-slate-100 pl-6 italic">
                  {job.description}
                </p>

                {/* Specs Grid */}
                <div className="grid grid-cols-2 gap-y-8 gap-x-4 mb-12">
                  <div className="flex items-start gap-4">
                    <div className="mt-1 text-red-600"><FiUser size={16}/></div>
                    <div>
                      <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">Worker</p>
                      <p className="text-xs font-black text-zinc-800 uppercase tracking-tighter">{job.workerId?.username || 'Unassigned'}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="mt-1 text-red-600"><FiMapPin size={16}/></div>
                    <div className="min-w-0">
                      <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">Location</p>
                      <p className="text-xs font-black text-zinc-800 truncate uppercase tracking-tighter">{job.location}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="mt-1 text-red-600"><FiPhone size={16}/></div>
                    <div>
                      <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">Contact</p>
                      <p className="text-xs font-black text-zinc-800 uppercase tracking-tighter">{job.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="mt-1 text-red-600"><FiCalendar size={16}/></div>
                    <div>
                      <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">Logged On</p>
                      <p className="text-xs font-black text-zinc-800 uppercase tracking-tighter">{new Date(job.createdAt).toLocaleDateString('en-GB')}</p>
                    </div>
                  </div>
                </div>

                {/* Notes Section - Clean List */}
                {job.notes && job.notes.length > 0 && (
                  <div className="space-y-4 pt-10 border-t border-slate-50">
                    <div className="flex items-center gap-2 mb-2">
                      <FiMessageSquare className="text-slate-300" size={14} />
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Discussion Thread</span>
                    </div>
                    {job.notes.map((note, idx) => (
                      <div key={idx} className="bg-slate-50/50 rounded-[24px] p-5 border border-slate-100 hover:bg-white transition-colors">
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black text-zinc-900 uppercase italic underline decoration-red-500 underline-offset-4">{note.senderName}</span>
                            <span className="text-[8px] bg-zinc-900 text-white px-2 py-0.5 rounded font-black uppercase tracking-tighter">
                              {note.senderRole}
                            </span>
                          </div>
                          <span className="text-[9px] text-slate-400 font-bold">{note.time}</span>
                        </div>
                        <p className="text-[12px] text-slate-600 font-medium leading-relaxed">"{note.text}"</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="py-40 flex flex-col items-center justify-center bg-slate-50/50 rounded-[80px] border-2 border-dashed border-slate-200">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-xl mb-8">
            <FiInbox className="text-slate-200" size={40} />
          </div>
          <h2 className="text-3xl font-black text-zinc-900 uppercase tracking-tighter">No Pending Tasks</h2>
          <p className="text-slate-400 font-medium mt-2">The queue is completely clear. Good job!</p>
        </div>
      )}

      {/* --- Static Footer Branding --- */}
      <div className="mt-24 pt-12 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-red-600 rounded-full animate-ping"></div>
          <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[5px]">System Online</span>
        </div>
        <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">© 2026 Enterprise Service Management</p>
      </div>
    </div>
  );
};

export default PendingOrders;