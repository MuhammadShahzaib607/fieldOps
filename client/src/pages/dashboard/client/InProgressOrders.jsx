import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  FiActivity, FiMapPin, FiPhone, FiUser, 
  FiCalendar, FiHash, FiMessageSquare,
  FiZap, FiArrowRight, FiInbox, FiLoader
} from 'react-icons/fi';

const InProgressOrders = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchInProgress = async () => {
      try {
        const res = await axios.get(`${API_URL}/job/my-orders`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data.success) {
          // Filtering only 'in-progress' jobs
          const activeOnly = res.data.data.filter(job => job.status === 'in-progress');
          setJobs(activeOnly);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchInProgress();
  }, []);

  if (loading) return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center bg-white">
      <FiLoader className="animate-spin text-blue-600 mb-4" size={30} />
      <span className="text-[10px] font-black uppercase tracking-[4px] text-slate-400">Accessing Live Stream</span>
    </div>
  );

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-12">
      
      {/* --- Page Header & Analytics --- */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-20 gap-8">
        <div className="max-w-xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
            <span className="text-[10px] font-black text-blue-600 uppercase tracking-[4px]">Live Operations</span>
          </div>
          <h1 className="text-5xl font-black text-zinc-900 tracking-tighter uppercase leading-[0.9]">
            In Progress <span className="text-blue-600 italic">Orders</span>
          </h1>
          <p className="text-slate-500 font-medium mt-6 leading-relaxed">
            Currently monitoring <span className="text-zinc-950 font-bold">{jobs.length} active deployments</span>. 
            These tasks are being handled by the technical team in real-time.
          </p>
        </div>

        {/* Live Status Card */}
        <div className="bg-white border-2 border-blue-600 rounded-[35px] p-8 min-w-[280px] shadow-xl shadow-blue-100 flex items-center gap-6 relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Active Pulse</p>
            <h2 className="text-5xl font-black text-zinc-900 tracking-tighter">{jobs.length}</h2>
          </div>
          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 relative z-10">
            <FiZap size={32} />
          </div>
          {/* Decorative background circle */}
          <div className="absolute -right-10 -top-10 w-32 h-32 bg-blue-50 rounded-full opacity-50"></div>
        </div>
      </div>

      {/* --- Active Jobs Grid --- */}
      {jobs.length > 0 ? (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
          {jobs.map((job) => (
            <div key={job._id} className="group bg-white border border-slate-100 rounded-[50px] overflow-hidden hover:border-blue-200 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-50">
              
              {/* Card Accent Top */}
              <div className="h-1.5 w-full bg-slate-50 group-hover:bg-blue-600 transition-colors duration-500"></div>

              <div className="p-10">
                {/* Meta Header */}
                <div className="flex justify-between items-center mb-8">
                  <div className="flex items-center gap-2">
                    <FiHash className="text-slate-300" />
                    <span className="text-[11px] font-black text-zinc-400 uppercase tracking-widest">Job Node: {job._id.slice(-8)}</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-1.5 bg-blue-600 text-white rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg shadow-blue-200">
                    {job.status}
                  </div>
                </div>

                {/* Title & Description */}
                <h3 className="text-3xl font-black text-zinc-900 mb-4 tracking-tight group-hover:translate-x-2 transition-transform duration-300 flex items-center gap-3">
                  <FiArrowRight className="text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" size={24}/>
                  {job.title}
                </h3>
                <p className="text-slate-500 text-sm font-medium leading-relaxed mb-10 bg-slate-50 p-6 rounded-[24px] border-l-4 border-blue-600">
                  {job.description}
                </p>

                {/* Deployment Intel Grid */}
                <div className="grid grid-cols-2 gap-6 mb-12 ml-2">
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Lead Technician</span>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-zinc-900 rounded-lg flex items-center justify-center text-[10px] text-white font-bold">{job.workerId?.username?.charAt(0)}</div>
                      <span className="text-xs font-black text-zinc-800 uppercase">{job.workerId?.username || 'In Transit'}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Site Coordinates</span>
                    <span className="text-xs font-black text-zinc-800 uppercase flex items-center gap-1">
                      <FiMapPin className="text-blue-600" /> {job.location}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Operational Support</span>
                    <span className="text-xs font-black text-zinc-800 uppercase flex items-center gap-1">
                      <FiPhone className="text-blue-600" /> {job.phone}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Deployment Date</span>
                    <span className="text-xs font-black text-zinc-800 uppercase flex items-center gap-1">
                      <FiCalendar className="text-blue-600" /> {new Date(job.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Updates / Notes Section */}
                {job.notes && job.notes.length > 0 && (
                  <div className="space-y-4 pt-8 border-t border-slate-100">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[3px]">System Logs</span>
                      <FiActivity className="text-blue-200" />
                    </div>
                    {job.notes.map((note, idx) => (
                      <div key={idx} className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm hover:border-blue-100 transition-colors">
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black text-zinc-900 uppercase">{note.senderName}</span>
                            <span className="text-[8px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md font-black uppercase tracking-tighter border border-blue-100">
                              {note.senderRole}
                            </span>
                          </div>
                          <span className="text-[9px] text-slate-400 font-bold">{note.time}</span>
                        </div>
                        <p className="text-[12px] text-slate-600 font-medium italic leading-relaxed">"{note.text}"</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty Stream */
        <div className="py-40 flex flex-col items-center justify-center bg-slate-50/50 rounded-[80px] border-4 border-double border-slate-200">
          <div className="w-24 h-24 bg-white rounded-[32px] flex items-center justify-center shadow-xl shadow-slate-200/50 mb-8 border border-slate-100">
            <FiActivity className="text-slate-200" size={40} />
          </div>
          <h2 className="text-3xl font-black text-zinc-900 uppercase tracking-tighter">No Active Orders</h2>
          <p className="text-slate-400 font-medium mt-2">There are currently no orders in the progress phase.</p>
        </div>
      )}

      {/* --- Footer Signature --- */}
      <div className="mt-32 text-center">
        <div className="inline-flex items-center gap-3 px-6 py-2 bg-slate-50 rounded-full border border-slate-100">
          <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-ping"></div>
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-[4px]">Data Stream Active • 2026</span>
        </div>
      </div>
    </div>
  );
};

export default InProgressOrders;