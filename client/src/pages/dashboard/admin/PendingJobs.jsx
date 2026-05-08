import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  FiEdit, FiTrash2, FiFileText, FiMapPin, 
  FiPhone, FiUser, FiCalendar, FiClock,
  FiAlertCircle, FiArrowRight, FiInfo
} from 'react-icons/fi';

const PendingJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(null);
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchPendingJobs();
  }, []);

  const fetchPendingJobs = async () => {
    try {
      const res = await axios.get(`${API_URL}/job/all`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        // Sirf pending status wali jobs filter kar rahe hain
        const pending = res.data.data.filter(job => job.status === 'pending');
        setJobs(pending);
      }
    } catch (err) {
      console.error("Error fetching pending jobs", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this pending task?")) return;
    
    setIsDeleting(jobId);
    try {
      const res = await axios.delete(`${API_URL}/job/delete/${jobId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setJobs(prev => prev.filter(j => j._id !== jobId));
      }
    } catch (err) {
      alert("Failed to delete job");
    } finally {
      setIsDeleting(null);
    }
  };

  if (loading) return (
    <div className="flex h-96 items-center justify-center">
      <div className="w-10 h-10 border-4 border-red-600 border-t-transparent animate-spin rounded-full"></div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto pb-20 px-4">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></span>
            <span className="text-[10px] font-black text-red-600 uppercase tracking-[3px]">Pending Jobs</span>
          </div>
          <h1 className="text-4xl font-black text-zinc-950 tracking-tighter uppercase">
            Pending Tasks<span className="text-red-600">.</span>
          </h1>
          <p className="text-slate-500 font-medium text-sm mt-1 italic">
            Currently monitoring {jobs.length} jobs waiting for deployment or action.
          </p>
        </div>
        
        {/* Static Info Card */}
        {/* <div className="hidden lg:flex items-center gap-4 bg-zinc-900 text-white p-4 rounded-3xl shadow-xl shadow-zinc-900/10">
          <div className="bg-red-600 p-3 rounded-2xl">
            <FiClock size={20} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Efficiency Goal</p>
            <p className="text-xs font-medium italic">"Swift response ensures client loyalty"</p>
          </div>
        </div> */}
      </div>

      {/* Conditional Rendering: Jobs or Empty State */}
      {jobs.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {jobs.map((job) => (
            <div key={job._id} className="bg-white rounded-[40px] border border-slate-200 shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 transition-all group overflow-hidden">
              <div className="p-8 md:p-10">
                
                {/* ID & Status Row */}
                <div className="flex justify-between items-center mb-6">
                  <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest group-hover:text-red-600 transition-colors">
                    #ORD-{job._id.slice(-6)}
                  </span>
                  <div className="flex items-center gap-2 bg-amber-50 text-amber-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border border-amber-100">
                    <FiClock className="animate-spin-slow" /> Pending Action
                  </div>
                </div>

                <h3 className="text-2xl font-black text-zinc-950 leading-tight mb-4 group-hover:translate-x-1 transition-transform">
                  {job.title}
                </h3>

                <p className="text-slate-500 text-sm leading-relaxed mb-8 line-clamp-3 italic">
                  {job.description}
                </p>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-3xl">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm text-zinc-900"><FiUser size={18}/></div>
                    <div className="min-w-0">
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Client</p>
                      <p className="text-xs font-black text-zinc-900 truncate">{job.clientId?.username}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-3xl">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm text-zinc-900"><FiMapPin size={18}/></div>
                    <div className="min-w-0">
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Location</p>
                      <p className="text-xs font-black text-zinc-900 truncate">{job.location}</p>
                    </div>
                  </div>
                </div>

                {/* Notes Loop (Professional Red/Zinc Badge) */}
                {job.notes && job.notes.length > 0 && (
                  <div className="space-y-3 mb-8">
                    {job.notes.slice(-1).map((note, idx) => (
                      <div key={idx} className="bg-zinc-950 rounded-[24px] p-5 relative overflow-hidden">
                        <div className="absolute right-0 top-0 p-4 opacity-10 text-white"><FiInfo size={40}/></div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-white font-bold text-[10px] tracking-tight">{note.senderName}</span>
                          <span className={`text-[8px] px-2 py-0.5 rounded-full font-black uppercase ${note.senderRole === 'admin' ? 'bg-red-600 text-white' : 'bg-zinc-700 text-zinc-300'}`}>
                            {note.senderRole}
                          </span>
                          <span className="text-[8px] text-zinc-500 ml-auto">{note.time || 'recent'}</span>
                        </div>
                        <p className="text-zinc-400 text-xs italic leading-relaxed">"{note.text}"</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Actions Row */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-2 text-slate-400">
                    <FiPhone size={14} className="text-red-600" />
                    <span className="text-xs font-bold">{job.phone}</span>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => navigate(`/add-note/${job._id}`)}
                      className="p-3 bg-white border border-slate-200 rounded-2xl text-zinc-600 hover:border-zinc-950 hover:text-zinc-950 transition-all shadow-sm"
                    >
                      <FiFileText size={18} />
                    </button>
                    <button 
                      onClick={() => navigate(`/edit-job/${job._id}`)}
                      className="p-3 bg-white border border-slate-200 rounded-2xl text-zinc-600 hover:border-zinc-950 hover:text-zinc-950 transition-all shadow-sm"
                    >
                      <FiEdit size={18} />
                    </button>
                    <button 
                      disabled={isDeleting === job._id}
                      onClick={() => handleDelete(job._id)}
                      className="p-3 bg-red-50 border border-red-100 rounded-2xl text-red-600 hover:bg-red-600 hover:text-white transition-all shadow-sm disabled:opacity-50"
                    >
                      {isDeleting === job._id ? <FiClock className="animate-spin" size={18} /> : <FiTrash2 size={18} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State with Professional Design */
        <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[60px] border-2 border-dashed border-slate-100 shadow-inner">
          <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mb-6">
            <FiAlertCircle size={48} />
          </div>
          <h2 className="text-2xl font-black text-zinc-900 tracking-tight mb-2 uppercase">Operational Clear</h2>
          <p className="text-slate-400 font-medium max-w-sm text-center px-6">
            Everything is on track. There are currently no pending jobs requiring your intervention.
          </p>
          <button 
            onClick={() => navigate('/all-jobs')}
            className="mt-8 flex items-center gap-2 text-red-600 font-black uppercase text-xs tracking-widest hover:gap-4 transition-all"
          >
            View All History <FiArrowRight strokeWidth={3} />
          </button>
        </div>
      )}
    </div>
  );
};

export default PendingJobs;