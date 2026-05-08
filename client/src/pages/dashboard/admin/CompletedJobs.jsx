import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  FiEdit, FiTrash2, FiFileText, FiMapPin, 
  FiPhone, FiUser, FiCheckCircle, FiArchive,
  FiRefreshCw, FiArrowLeft, FiInfo, FiLayers
} from 'react-icons/fi';

const CompletedJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(null);
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchCompletedJobs();
  }, []);

  const fetchCompletedJobs = async () => {
    try {
      const res = await axios.get(`${API_URL}/job/all`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        // Sirf completed status wali jobs filter
        const done = res.data.data.filter(job => job.status === 'completed');
        setJobs(done);
      }
    } catch (err) {
      console.error("Archive fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (jobId) => {
    if (!window.confirm("Confirm: Permanently remove this record from archives?")) return;
    
    setIsDeleting(jobId);
    try {
      await axios.delete(`${API_URL}/job/delete/${jobId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setJobs(prev => prev.filter(j => j._id !== jobId));
    } catch (err) {
      alert("System Error: Failed to delete archive.");
    } finally {
      setIsDeleting(null);
    }
  };

  if (loading) return (
    <div className="flex h-96 items-center justify-center">
      <div className="w-12 h-12 border-[3px] border-slate-100 border-t-red-600 animate-spin rounded-full"></div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto pb-20 px-4">
      {/* Archive Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <FiArchive className="text-red-600" size={18} />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[4px]">Completed Jobs</span>
          </div>
          <h1 className="text-5xl font-black text-zinc-950 tracking-tighter uppercase leading-none">
            Completed<span className="text-red-600">.</span>
          </h1>
          <p className="text-slate-400 font-medium text-sm mt-3">
            Showing <span className="text-zinc-900 font-bold">{jobs.length} successful operations</span> stored in your digital archive.
          </p>
        </div>

        {/* Static Quality Badge */}
        <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-[32px] flex items-center gap-4 group hover:bg-emerald-100 transition-colors">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-emerald-600 group-hover:scale-110 transition-transform">
            <FiCheckCircle size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Quality Assurance</p>
            <p className="text-xs font-bold text-zinc-900 uppercase italic">100% Task Completion</p>
          </div>
        </div>
      </div>

      {jobs.length > 0 ? (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
          {jobs.map((job) => (
            <div key={job._id} className="relative bg-white rounded-[45px] border border-slate-100 p-2 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-[0.03] text-zinc-900 pointer-events-none">
                <FiCheckCircle size={120} />
              </div>

              <div className="bg-white rounded-[38px] p-8 md:p-10">
                
                {/* Status Bar */}
                <div className="flex justify-between items-center mb-8">
                  <span className="bg-slate-50 text-slate-400 px-4 py-1.5 rounded-full text-[9px] font-black tracking-widest uppercase">
                    ID: {job._id.slice(-6)}
                  </span>
                  <div className="flex items-center gap-2 text-emerald-600 text-[10px] font-black uppercase tracking-widest">
                    <FiCheckCircle strokeWidth={3} /> Job Finalized
                  </div>
                </div>

                <h2 className="text-2xl font-black text-zinc-950 mb-3 group-hover:text-red-600 transition-colors uppercase tracking-tight">
                  {job.title}
                </h2>
                
                <p className="text-slate-400 text-sm leading-relaxed mb-10 italic">
                  "{job.description}"
                </p>

                {/* Information Grid */}
                <div className="grid grid-cols-2 gap-5 mb-10">
                  <div className="flex flex-col gap-1 px-4 py-3 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="text-[9px] font-bold text-slate-400 uppercase">Worker Assigned</span>
                    <span className="text-[13px] font-black text-zinc-800">{job.workerId?.username || 'Archived'}</span>
                  </div>
                  <div className="flex flex-col gap-1 px-4 py-3 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="text-[9px] font-bold text-slate-400 uppercase">Deployment Site</span>
                    <span className="text-[13px] font-black text-zinc-800 truncate">{job.location}</span>
                  </div>
                </div>

                {/* Notes Feed - Legacy View */}
                {job.notes && job.notes.length > 0 && (
                  <div className="mb-10 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="h-px flex-1 bg-slate-100"></div>
                      <span className="text-[9px] font-black text-slate-300 uppercase tracking-[3px]">Final Communication</span>
                      <div className="h-px flex-1 bg-slate-100"></div>
                    </div>
                    {job.notes.slice(-1).map((note, idx) => (
                      <div key={idx} className="bg-zinc-950 rounded-[30px] p-6 relative group/note">
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

                {/* Tactical Footer Actions */}
                <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-bold text-slate-300 uppercase">Reference Contact</span>
                    <span className="text-xs font-black text-zinc-900">{job.phone}</span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => navigate(`/add-note/${job._id}`)}
                      className="w-11 h-11 flex items-center justify-center bg-white border border-slate-200 rounded-2xl text-zinc-400 hover:text-zinc-950 hover:border-zinc-950 transition-all"
                      title="Add Post-Job Note"
                    >
                      <FiFileText size={18} />
                    </button>
                    <button 
                      onClick={() => navigate(`/edit-job/${job._id}`)}
                      className="w-11 h-11 flex items-center justify-center bg-white border border-slate-200 rounded-2xl text-zinc-400 hover:text-zinc-950 hover:border-zinc-950 transition-all"
                    >
                      <FiEdit size={18} />
                    </button>
                    <button 
                      disabled={isDeleting === job._id}
                      onClick={() => handleDelete(job._id)}
                      className="w-11 h-11 flex items-center justify-center bg-red-50 text-red-500 rounded-2xl hover:bg-red-600 hover:text-white transition-all disabled:opacity-50"
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
        /* Empty Archive State */
        <div className="flex flex-col items-center justify-center py-40 bg-white rounded-[60px] border-2 border-dashed border-slate-100 shadow-inner">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mb-8 border border-slate-100">
            <FiLayers size={36} />
          </div>
          <h2 className="text-2xl font-black text-zinc-900 uppercase tracking-tighter">Archive is Empty</h2>
          <p className="text-slate-400 font-medium mt-2 max-w-xs text-center">No jobs have been marked as completed yet. Complete an active task to see it here.</p>
          <button 
            onClick={() => navigate('/admin/jobs/in-progress')}
            className="mt-10 px-8 py-4 border-2 border-zinc-950 text-zinc-950 text-[10px] font-black uppercase tracking-[3px] rounded-2xl hover:bg-zinc-950 hover:text-white transition-all flex items-center gap-2"
          >
            <FiArrowLeft strokeWidth={3} /> Active Operations
          </button>
        </div>
      )}
    </div>
  );
};

export default CompletedJobs;