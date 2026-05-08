import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  FiCheckCircle, FiMapPin, FiPhone, FiUser, 
  FiCalendar, FiHash, FiMessageSquare,
  FiAward, FiClipboard, FiArchive, FiLoader
} from 'react-icons/fi';

const CompletedOrders = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchCompleted = async () => {
      try {
        const res = await axios.get(`${API_URL}/job/my-orders`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data.success) {
          // Filtering only 'completed' jobs
          const finishedOnly = res.data.data.filter(job => job.status === 'completed');
          setJobs(finishedOnly);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCompleted();
  }, []);

  if (loading) return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center bg-white">
      <FiLoader className="animate-spin text-emerald-600 mb-4" size={30} />
      <span className="text-[10px] font-black uppercase tracking-[4px] text-slate-400">Finalizing Records</span>
    </div>
  );

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-12">
      
      {/* --- Page Header & Success Summary --- */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-20 gap-8">
        <div className="max-w-2xl">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-10 h-[2px] bg-emerald-600"></span>
            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[5px]">Service Archive</span>
          </div>
          <h1 className="text-6xl font-black text-zinc-900 tracking-tighter uppercase leading-[0.85]">
            Successful <span className="text-slate-300 italic font-light">Completions</span>
          </h1>
          <p className="text-slate-500 font-medium mt-8 leading-relaxed max-w-lg">
            A comprehensive list of all fulfilled service requests. These jobs have been verified and closed by the administration.
          </p>
        </div>

        {/* Milestone Card */}
        <div className="bg-emerald-600 rounded-[40px] p-10 text-white min-w-[300px] shadow-2xl shadow-emerald-100 flex items-center justify-between relative overflow-hidden group">
          <div className="relative z-10">
            <p className="text-[10px] font-bold text-emerald-100 uppercase tracking-[3px] mb-2 opacity-80">Fulfilled Tasks</p>
            <h2 className="text-6xl font-black tracking-tighter">{jobs.length}</h2>
          </div>
          <div className="bg-emerald-500/50 p-4 rounded-3xl relative z-10">
            <FiAward size={40} className="text-white" />
          </div>
          {/* Subtle pattern background */}
          <div className="absolute -left-4 -bottom-4 opacity-10 rotate-12">
            <FiCheckCircle size={150} />
          </div>
        </div>
      </div>

      {/* --- Completed Jobs Grid --- */}
      {jobs.length > 0 ? (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
          {jobs.map((job) => (
            <div key={job._id} className="bg-white border border-slate-100 rounded-[60px] p-4 hover:shadow-3xl hover:shadow-emerald-50/50 transition-all duration-700">
              <div className="bg-white border border-slate-50 rounded-[50px] p-8 md:p-12">
                
                {/* ID & Verification Stamp */}
                <div className="flex justify-between items-center mb-10">
                  <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest bg-slate-50 px-4 py-1 rounded-full">
                    Batch: {job._id.slice(-8).toUpperCase()}
                  </span>
                  <div className="flex items-center gap-2 text-emerald-600">
                    <FiCheckCircle size={20} />
                    <span className="text-[11px] font-black uppercase tracking-widest">Verified</span>
                  </div>
                </div>

                <h3 className="text-3xl font-black text-zinc-900 mb-6 tracking-tight">
                  {job.title}
                </h3>
                
                {/* Abstract Description Box */}
                <div className="relative mb-12">
                  <div className="absolute -left-6 top-0 bottom-0 w-1 bg-emerald-500 rounded-full"></div>
                  <p className="text-slate-500 text-sm font-medium leading-relaxed italic pl-2">
                    {job.description}
                  </p>
                </div>

                {/* Job Summary Intel */}
                <div className="grid grid-cols-2 gap-x-8 gap-y-10 mb-12">
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-[2px] flex items-center gap-2">
                      <FiUser className="text-emerald-500" /> Specialist
                    </p>
                    <p className="text-xs font-black text-zinc-800 uppercase tracking-tighter">{job.workerId?.username || 'System'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-[2px] flex items-center gap-2">
                      <FiMapPin className="text-emerald-500" /> Destination
                    </p>
                    <p className="text-xs font-black text-zinc-800 truncate uppercase tracking-tighter">{job.location}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-[2px] flex items-center gap-2">
                      <FiPhone className="text-emerald-500" /> Contact
                    </p>
                    <p className="text-xs font-black text-zinc-800 uppercase tracking-tighter">{job.phone}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-[2px] flex items-center gap-2">
                      <FiCalendar className="text-emerald-500" /> Closed Date
                    </p>
                    <p className="text-xs font-black text-zinc-800 uppercase tracking-tighter">
                       {new Date(job.updatedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                </div>

                {/* Final Memos / Notes */}
                {job.notes && job.notes.length > 0 && (
                  <div className="pt-10 border-t-2 border-dashed border-slate-100">
                    <div className="flex items-center gap-2 mb-6">
                      <FiClipboard className="text-emerald-200" />
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Final Documentation</span>
                    </div>
                    <div className="space-y-4">
                      {job.notes.map((note, idx) => (
                        <div key={idx} className="bg-emerald-50/30 rounded-[30px] p-6 border border-emerald-50">
                          <div className="flex justify-between items-center mb-3">
                            <div className="flex items-center gap-2">
                              <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-[8px] flex items-center justify-center font-bold uppercase">{note.senderName?.charAt(0)}</span>
                              <span className="text-[10px] font-black text-zinc-900 uppercase">{note.senderName}</span>
                              <span className="text-[8px] border border-emerald-200 text-emerald-600 px-2 py-0.5 rounded font-black uppercase">
                                {note.senderRole}
                              </span>
                            </div>
                            <span className="text-[9px] text-slate-400 font-bold">{note.time}</span>
                          </div>
                          <p className="text-[12px] text-slate-600 font-medium leading-relaxed">"{note.text}"</p>
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
          <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-200 mb-8 border border-emerald-100">
            <FiArchive size={40} />
          </div>
          <h2 className="text-4xl font-black text-zinc-900 uppercase tracking-tighter">No Completed Records</h2>
          <p className="text-slate-400 font-medium mt-3 text-center max-w-sm">
            Looks like there are no finalized jobs in your history at the moment.
          </p>
        </div>
      )}

      {/* --- Footer Branding --- */}
      <div className="mt-32 border-t border-slate-100 pt-12 flex flex-col items-center gap-4">
        <FiCheckCircle className="text-emerald-100" size={50} />
        <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[8px]">Quality Guaranteed</span>
      </div>
    </div>
  );
};

export default CompletedOrders;