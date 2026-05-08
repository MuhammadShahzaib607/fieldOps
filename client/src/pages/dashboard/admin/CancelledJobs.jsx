import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  FiEdit, FiTrash2, FiFileText, FiMapPin, 
  FiPhone, FiUser, FiXCircle, FiSlash,
  FiRefreshCw, FiInfo, FiHash, FiAlertTriangle
} from 'react-icons/fi';

const CancelledJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(null);
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchCancelledJobs();
  }, []);

  const fetchCancelledJobs = async () => {
    try {
      const res = await axios.get(`${API_URL}/job/all`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        // Filtering only cancelled jobs
        const cancelled = res.data.data.filter(job => job.status === 'cancelled');
        setJobs(cancelled);
      }
    } catch (err) {
      console.error("Termination fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (jobId) => {
    if (!window.confirm("Permanent Action: Remove this cancelled record?")) return;
    
    setIsDeleting(jobId);
    try {
      await axios.delete(`${API_URL}/job/delete/${jobId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setJobs(prev => prev.filter(j => j._id !== jobId));
    } catch (err) {
      alert("Error: System could not purge the record.");
    } finally {
      setIsDeleting(null);
    }
  };

  if (loading) return (
    <div className="flex h-96 items-center justify-center">
      <div className="w-12 h-12 border-[3px] border-zinc-100 border-t-zinc-900 animate-spin rounded-full"></div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto pb-20 px-4">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <FiSlash className="text-red-600 animate-pulse" size={18} />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[4px]">Terminated Operations</span>
          </div>
          <h1 className="text-5xl font-black text-zinc-950 tracking-tighter uppercase leading-none">
            Cancelled<span className="text-red-600">.</span>
          </h1>
          <p className="text-slate-400 font-medium text-sm mt-3">
            Reviewing <span className="text-red-600 font-bold">{jobs.length} terminated tasks</span> that were halted before completion.
          </p>
        </div>

        {/* Static Risk Card */}
        <div className="bg-zinc-50 border border-zinc-100 p-6 rounded-[32px] flex items-center gap-4">
          <div className="w-12 h-12 bg-zinc-950 rounded-2xl flex items-center justify-center shadow-lg text-white">
            <FiAlertTriangle size={20} />
          </div>
          <div>
            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Audit Notice</p>
            <p className="text-xs font-bold text-zinc-900 uppercase">Records are immutable</p>
          </div>
        </div>
      </div>

      {jobs.length > 0 ? (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
          {jobs.map((job) => (
            <div key={job._id} className="relative bg-white rounded-[45px] border border-slate-200 p-2 group hover:border-red-200 transition-all duration-500">
              <div className="bg-white rounded-[38px] p-8 md:p-10 shadow-sm group-hover:shadow-xl transition-all">
                
                {/* Header Row */}
                <div className="flex justify-between items-center mb-8">
                  <div className="flex items-center gap-2 text-slate-300 font-bold text-[11px] uppercase tracking-tighter">
                    <FiHash /> {job._id.slice(-6)}
                  </div>
                  <div className="bg-red-50 text-red-600 flex items-center gap-2 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border border-red-100">
                    <FiXCircle /> Terminated
                  </div>
                </div>

                <h2 className="text-2xl font-black text-zinc-950 mb-3 uppercase tracking-tight line-through opacity-50">
                  {job.title}
                </h2>
                
                <p className="text-slate-400 text-sm leading-relaxed mb-10 italic">
                  "{job.description}"
                </p>

                {/* Grid Data */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                  <div className="bg-zinc-50 p-5 rounded-[30px] border border-zinc-100">
                    <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">Previous Assignee</p>
                    <p className="text-[13px] font-black text-zinc-800">{job.workerId?.username || 'Unassigned'}</p>
                  </div>
                  <div className="bg-zinc-50 p-5 rounded-[30px] border border-zinc-100">
                    <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">Project Site</p>
                    <p className="text-[13px] font-black text-zinc-800 truncate">{job.location}</p>
                  </div>
                </div>

                {/* Final Notes (Red/Zinc Style) */}
                {job.notes && job.notes.length > 0 && (
                  <div className="mb-10 space-y-4">
                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest px-2">Reasoning & Logs</p>
                    {job.notes.slice(-1).map((note, idx) => (
                      <div key={idx} className="bg-zinc-950 rounded-[30px] p-6 relative">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-white text-[11px] font-black uppercase tracking-tight">{note.senderName}</span>
                          <span className={`text-[8px] px-2 py-0.5 rounded-full font-bold uppercase ${note.senderRole === 'admin' ? 'bg-red-600 text-white' : 'bg-zinc-800 text-zinc-400'}`}>
                            {note.senderRole}
                          </span>
                        </div>
                        <p className="text-zinc-400 text-xs italic leading-relaxed">"{note.text}"</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Footer Controls */}
                <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                      <FiPhone size={14} />
                    </div>
                    <span className="text-xs font-black text-zinc-400">{job.phone}</span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => navigate(`/add-note/${job._id}`)}
                      className="w-11 h-11 flex items-center justify-center bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-zinc-950 hover:border-zinc-950 transition-all shadow-sm"
                    >
                      <FiFileText size={18} />
                    </button>
                    <button 
                      onClick={() => navigate(`/edit-job/${job._id}`)}
                      className="w-11 h-11 flex items-center justify-center bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-zinc-950 hover:border-zinc-950 transition-all shadow-sm"
                    >
                      <FiEdit size={18} />
                    </button>
                    <button 
                      disabled={isDeleting === job._id}
                      onClick={() => handleDelete(job._id)}
                      className="w-11 h-11 flex items-center justify-center bg-red-50 text-red-600 rounded-2xl hover:bg-red-600 hover:text-white transition-all shadow-sm"
                    >
                      {isDeleting === job._id ? <FiRefreshCw className="animate-spin" /> : <FiTrash2 size={18} />}
                    </button>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty Log State (No Button) */
        <div className="flex flex-col items-center justify-center py-48 bg-white rounded-[60px] border-2 border-dashed border-slate-100 shadow-inner">
          <div className="w-20 h-20 bg-zinc-50 rounded-full flex items-center justify-center text-zinc-200 mb-8 border border-zinc-100">
            <FiSlash size={36} />
          </div>
          <h2 className="text-2xl font-black text-zinc-900 uppercase tracking-tighter">Zero Terminations</h2>
          <p className="text-slate-400 font-medium mt-3 max-w-sm text-center px-10 leading-relaxed italic">
            Currently, there are no cancelled jobs in the system logs. All initiated operations are either pending, active, or successfully archived.
          </p>
        </div>
      )}
    </div>
  );
};

export default CancelledJobs;