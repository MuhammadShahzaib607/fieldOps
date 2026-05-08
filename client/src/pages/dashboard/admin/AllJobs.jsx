import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  FiEdit, FiTrash2, FiFileText, FiMapPin, 
  FiPhone, FiUser, FiCalendar, FiBriefcase,
  FiPlus, FiLayers, FiCheckCircle, FiClock, FiXCircle
} from 'react-icons/fi';

const AllJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleDeleteJob = async (jobId) => {
  const confirmDelete = window.confirm("Are you sure you want to delete this job? This action cannot be undone.");
  if (!confirmDelete) return;

  setLoading(true);
  try {
    const res = await axios.delete(`${API_URL}/job/delete/${jobId}`, {
      headers: { 
        Authorization: `Bearer ${token}` 
      }
    });

    if (res.data.success) {
      setJobs((prevJobs) => prevJobs.filter(job => job._id !== jobId));
    } else {
      alert(res.data.message || "Failed to delete job.");
    }
  } catch (err) {
    console.error("Delete Error:", err);
    alert(err.response?.data?.message || "Something went wrong while deleting.");
  } finally {
    setLoading(false);
  }
};

  const fetchJobs = async () => {
    try {
      const res = await axios.get(`${API_URL}/job/all`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setJobs(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching jobs", err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'completed': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'in-progress': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'cancelled': return 'bg-rose-100 text-rose-700 border-rose-200';
      default: return 'bg-amber-100 text-amber-700 border-amber-200';
    }
  };

  if (loading) return (
    <div className="flex h-96 items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-zinc-900 tracking-tight">Job Inventory</h1>
          <p className="text-slate-500 font-medium">Manage and monitor all field operations in real-time.</p>
        </div>
        <button 
          onClick={() => navigate('/create-job')}
          className="flex items-center justify-center gap-2 bg-zinc-950 text-white px-6 py-3 rounded-2xl font-bold hover:bg-zinc-800 transition-all shadow-lg"
        >
          <FiPlus strokeWidth={3} /> Post New Job
        </button>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Jobs', count: jobs.length, icon: <FiLayers />, color: 'text-zinc-900' },
          { label: 'Pending', count: jobs.filter(j => j.status === 'pending').length, icon: <FiClock />, color: 'text-amber-500' },
          { label: 'Completed', count: jobs.filter(j => j.status === 'completed').length, icon: <FiCheckCircle />, color: 'text-emerald-500' },
          { label: 'Cancelled', count: jobs.filter(j => j.status === 'cancelled').length, icon: <FiXCircle />, color: 'text-rose-500' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-xl ${stat.color}`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
              <p className="text-2xl font-black text-zinc-900">{stat.count}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {jobs.map((job) => (
          <div key={job._id} className="bg-white rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all overflow-hidden group">
            <div className="p-8">
              {/* Top Row: Title & Status */}
              <div className="flex justify-between items-start mb-6">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-red-600 uppercase tracking-widest bg-red-50 px-2 py-0.5 rounded">Job ID: {job._id.slice(-6)}</span>
                  <h3 className="text-xl font-bold text-zinc-900 leading-tight group-hover:text-red-600 transition-colors">{job.title}</h3>
                </div>
                <div className={`px-4 py-1.5 rounded-full text-[11px] font-bold uppercase border tracking-wider ${getStatusStyle(job.status)}`}>
                  {job.status}
                </div>
              </div>

              {/* Description */}
              <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-2">
                {job.description}
              </p>

              {/* Personnel Info */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-1 flex items-center gap-1">
                    <FiUser size={10}/> Worker
                  </p>
                  <p className="text-xs font-bold text-zinc-700 truncate">{job.workerId?.username || 'Unassigned'}</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-1 flex items-center gap-1">
                    <FiBriefcase size={10}/> Client
                  </p>
                  <p className="text-xs font-bold text-zinc-700 truncate">{job.clientId?.username}</p>
                </div>
              </div>

              {/* Contact & Location */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-slate-600">
                  <FiMapPin className="text-red-500 shrink-0" />
                  <span className="text-xs font-medium">{job.location}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-600">
                  <FiPhone className="text-emerald-500 shrink-0" />
                  <span className="text-xs font-bold">{job.phone}</span>
                </div>
              </div>

              {/* Notes Section (Preview) */}
              {job.notes && job.notes.length > 0 && (
  <div className="mt-6 pt-6 border-t border-dashed border-slate-200">
    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[1px] mb-3">Recent Notes</p>
    <div className="space-y-3">
      {job.notes.slice(-2).map((note, idx) => (
        <div key={idx} className="text-[12px] bg-slate-50/80 p-3 rounded-2xl border border-slate-100 relative group/note">
          <div className="flex items-center justify-between mb-2">
            {/* Name and Role Container */}
            <div className="flex items-center gap-2">
              <span className="font-bold text-zinc-800 text-[11px] tracking-tight">
                {note.senderName}
              </span>
              {/* Role Badge - Separate Pill Style */}
              <span className={`
                text-[8px] px-2 py-0.5 rounded-full font-black uppercase tracking-tighter border
                ${note.senderRole === 'admin' 
                  ? 'bg-red-50 text-red-600 border-red-100' 
                  : note.senderRole === 'worker' 
                  ? 'bg-blue-50 text-blue-600 border-blue-100'
                  : 'bg-zinc-100 text-zinc-600 border-zinc-200'}
              `}>
                {note.senderRole || 'staff'}
              </span>
            </div>
            
            {/* Time Stamp */}
            <span className="text-[9px] font-medium text-slate-400 italic">
              {note.time || 'recently'}
            </span>
          </div>
          
          {/* Note Content */}
          <div className="relative pl-3 border-l-2 border-zinc-300">
            <p className="text-zinc-600 text-[11px] leading-relaxed italic">
              {note.text}
            </p>
          </div>
        </div>
      ))}
    </div>
  </div>
)}
            </div>

            {/* Action Footer */}
            <div className="bg-slate-50/50 px-8 py-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1 uppercase">
                <FiCalendar /> {new Date(job.createdAt).toLocaleDateString()}
              </span>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => navigate(`/add-note/${job._id}`)}
                  className="p-2.5 bg-white text-zinc-600 rounded-xl border border-slate-200 hover:border-blue-500 hover:text-blue-500 transition-all shadow-sm"
                  title="Add Note"
                >
                  <FiFileText size={16} />
                </button>
                <button 
                  onClick={() => navigate(`/edit-job/${job._id}`)}
                  className="p-2.5 bg-white text-zinc-600 rounded-xl border border-slate-200 hover:border-amber-500 hover:text-amber-500 transition-all shadow-sm"
                  title="Edit Job"
                >
                  <FiEdit size={16} />
                </button>
                <button 
                  className="p-2.5 bg-white text-zinc-600 rounded-xl border border-slate-200 hover:border-red-500 hover:text-red-500 transition-all shadow-sm"
                  title="Delete Job"
                  onClick={()=> handleDeleteJob(job._id)}
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllJobs;