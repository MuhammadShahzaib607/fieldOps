import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  FiEdit, FiTrash2, FiFileText, FiMapPin, 
  FiPhone, FiUser, FiCalendar, FiActivity,
  FiLoader, FiArrowRight, FiInfo, FiHash
} from 'react-icons/fi';

const InProgressJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(null);
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchInProgressJobs();
  }, []);

  const fetchInProgressJobs = async () => {
    try {
      const res = await axios.get(`${API_URL}/job/all`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        // Sirf in-progress status wali jobs filter
        const active = res.data.data.filter(job => job.status === 'in-progress');
        setJobs(active);
      }
    } catch (err) {
      console.error("Error fetching active jobs", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (jobId) => {
    if (!window.confirm("Action required: Delete this active job?")) return;
    
    setIsDeleting(jobId);
    try {
      const res = await axios.delete(`${API_URL}/job/delete/${jobId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setJobs(prev => prev.filter(j => j._id !== jobId));
      }
    } catch (err) {
      alert("Error: Could not terminate job.");
    } finally {
      setIsDeleting(null);
    }
  };

  if (loading) return (
    <div className="flex h-96 items-center justify-center">
      <div className="w-12 h-12 border-[3px] border-zinc-200 border-t-red-600 animate-spin rounded-full"></div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto pb-20 px-4">
      {/* Dynamic Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="bg-blue-500 w-2 h-2 rounded-full animate-ping"></div>
            <span className="text-[10px] font-black text-blue-600 uppercase tracking-[4px]">In-Progress Jobs</span>
          </div>
          <h1 className="text-5xl font-black text-zinc-950 tracking-tighter uppercase">
            Active Work<span className="text-red-600">.</span>
          </h1>
          <p className="text-slate-400 font-medium text-sm">
            Real-time tracking of <span className="text-zinc-900 font-bold">{jobs.length} operations</span> currently in the field.
          </p>
        </div>

        {/* Tactical Overview Card (Static) */}
        {/* <div className="bg-white border border-slate-200 p-5 rounded-[28px] shadow-sm flex items-center gap-6">
          <div className="flex -space-x-3">
            {[1,2,3].map(i => (
              <div key={i} className="w-10 h-10 rounded-full border-4 border-white bg-zinc-100 flex items-center justify-center text-[10px] font-bold text-zinc-400 italic">
                OP
              </div>
            ))}
          </div>
          <div className="h-10 w-[1px] bg-slate-100"></div>
          <div>
            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Field Status</p>
            <p className="text-xs font-bold text-emerald-500 uppercase">All Workers Online</p>
          </div>
        </div> */}
      </div>

      {jobs.length > 0 ? (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
          {jobs.map((job) => (
            <div key={job._id} className="group relative bg-white rounded-[45px] border border-slate-100 p-2 hover:border-red-100 transition-all duration-500">
              <div className="bg-white rounded-[38px] p-8 md:p-10 shadow-sm group-hover:shadow-2xl group-hover:shadow-red-500/5 transition-all">
                
                {/* Job ID and Progress Badge */}
                <div className="flex justify-between items-center mb-8">
                  <div className="flex items-center gap-2 text-slate-300 font-bold text-[11px] uppercase tracking-tighter">
                    <FiHash /> {job._id.slice(-8)}
                  </div>
                  <div className="bg-zinc-950 text-white flex items-center gap-2 pl-2 pr-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest">
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse"></span>
                    In-Progress
                  </div>
                </div>

                <h2 className="text-2xl font-black text-zinc-950 mb-3 group-hover:text-red-600 transition-colors uppercase tracking-tight">
                  {job.title}
                </h2>
                
                <p className="text-slate-500 text-sm leading-relaxed mb-8 opacity-80 font-medium italic">
                  "{job.description}"
                </p>

                {/* Logistics Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                  <div className="bg-slate-50/50 border border-slate-100 p-5 rounded-[30px] flex items-center gap-4">
                    <div className="w-11 h-11 bg-white rounded-2xl flex items-center justify-center shadow-sm text-red-600"><FiUser size={20}/></div>
                    <div className="min-w-0">
                      <p className="text-[9px] font-bold text-slate-400 uppercase">Primary Worker</p>
                      <p className="text-[13px] font-black text-zinc-900 truncate">{job.workerId?.username || 'None'}</p>
                    </div>
                  </div>
                  <div className="bg-slate-50/50 border border-slate-100 p-5 rounded-[30px] flex items-center gap-4">
                    <div className="w-11 h-11 bg-white rounded-2xl flex items-center justify-center shadow-sm text-zinc-900"><FiMapPin size={20}/></div>
                    <div className="min-w-0">
                      <p className="text-[9px] font-bold text-slate-400 uppercase">Deployment</p>
                      <p className="text-[13px] font-black text-zinc-900 truncate">{job.location}</p>
                    </div>
                  </div>
                </div>

                {/* Notes Feed - Modern Dark Style */}
                {job.notes && job.notes.length > 0 && (
                  <div className="mb-10 space-y-3">
                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest px-2">Timeline Updates</p>
                    {job.notes.slice(-2).map((note, idx) => (
                      <div key={idx} className="bg-zinc-900 rounded-[28px] p-6 group/note hover:bg-zinc-800 transition-colors">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-white text-[11px] font-black uppercase tracking-tight">{note.senderName}</span>
                            <span className={`text-[8px] px-2 py-0.5 rounded-full font-bold uppercase ${note.senderRole === 'admin' ? 'bg-red-600 text-white' : 'bg-zinc-700 text-zinc-400'}`}>
                              {note.senderRole}
                            </span>
                          </div>
                          <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">{note.time || 'Live'}</span>
                        </div>
                        <p className="text-zinc-400 text-xs leading-relaxed italic">"{note.text}"</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Interactive Actions */}
                <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                      <FiPhone size={14} />
                    </div>
                    <span className="text-xs font-black text-zinc-900">{job.phone}</span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => navigate(`/add-note/${job._id}`)}
                      className="w-12 h-12 flex items-center justify-center bg-white border border-slate-200 rounded-2xl text-zinc-400 hover:text-zinc-950 hover:border-zinc-950 transition-all shadow-sm"
                    >
                      <FiFileText size={20} />
                    </button>
                    <button 
                      onClick={() => navigate(`/edit-job/${job._id}`)}
                      className="w-12 h-12 flex items-center justify-center bg-white border border-slate-200 rounded-2xl text-zinc-400 hover:text-zinc-950 hover:border-zinc-950 transition-all shadow-sm"
                    >
                      <FiEdit size={20} />
                    </button>
                    <button 
                      disabled={isDeleting === job._id}
                      onClick={() => handleDelete(job._id)}
                      className="w-12 h-12 flex items-center justify-center bg-red-50 text-red-500 rounded-2xl hover:bg-red-600 hover:text-white transition-all shadow-sm disabled:opacity-50"
                    >
                      {isDeleting === job._id ? <FiLoader className="animate-spin" /> : <FiTrash2 size={20} />}
                    </button>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-40 bg-slate-50 rounded-[60px] border-2 border-dashed border-slate-200">
          <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-slate-200 shadow-xl mb-8">
            <FiActivity size={40} />
          </div>
          <h2 className="text-2xl font-black text-zinc-900 uppercase tracking-tighter">No Active Jobs</h2>
          <p className="text-slate-400 font-medium mt-2 max-w-xs text-center">There are no jobs currently in-progress. Check pending tasks to start new work.</p>
          <button 
            onClick={() => navigate('/admin/jobs/pending')}
            className="mt-10 px-8 py-4 bg-zinc-950 text-white text-[10px] font-black uppercase tracking-[3px] rounded-2xl hover:bg-red-600 transition-all shadow-lg active:scale-95"
          >
            Review Pending Tasks
          </button>
        </div>
      )}
    </div>
  );
};

export default InProgressJobs;