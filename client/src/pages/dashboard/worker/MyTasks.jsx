import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  FiPackage, FiMapPin, FiPhone, FiCalendar, 
  FiHash, FiMessageSquare, FiChevronDown, 
  FiCheckCircle, FiClock, FiActivity, FiLoader, FiZap 
} from 'react-icons/fi';

const WorkerTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem('token');

  const statusOptions = [
    { label: 'Pending', value: 'pending', color: 'text-amber-500', bg: 'bg-amber-50' },
    { label: 'In Progress', value: 'in-progress', color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Completed', value: 'completed', color: 'text-emerald-500', bg: 'bg-emerald-50' }
  ];

  useEffect(() => {
    fetchMyTasks();
  }, []);

  const fetchMyTasks = async () => {
    try {
      const res = await axios.get(`${API_URL}/job/my-tasks`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setTasks(res.data.data);
      }
    } catch (err) {
      console.error("Task fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (taskId, newStatus) => {
    setUpdatingId(taskId);
    setOpenDropdown(null);
    try {
      const res = await axios.put(`${API_URL}/job/update-my-job-status/${taskId}`, 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        setTasks(prev => prev.map(t => t._id === taskId ? { ...t, status: newStatus } : t));
      }
    } catch (err) {
      alert("Update failed. Please try again.");
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-white">
      <FiLoader className="animate-spin text-zinc-900 mb-4" size={32} />
      <p className="text-[10px] font-black uppercase tracking-[4px] text-slate-400">Loading Assignments</p>
    </div>
  );

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-12 font-sans">
      
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-16 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <FiZap className="text-blue-600" size={14} />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[4px]">Operations Interface</span>
          </div>
          <h1 className="text-6xl font-black text-zinc-900 tracking-tighter uppercase leading-[0.85]">
            My Active <span className="text-blue-600 italic">Tasks</span>
          </h1>
          <p className="text-slate-500 font-medium mt-6 max-w-md">
            Manage your assigned deployments, update real-time status, and track service documentation.
          </p>
        </div>

        {/* Status Counter Badge */}
        <div className="bg-zinc-900 px-10 py-8 rounded-[40px] text-white shadow-2xl shadow-zinc-200 flex flex-col gap-1">
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Total Load</span>
          <div className="flex items-center gap-4">
            <h2 className="text-5xl font-black">{tasks.length}</h2>
            <div className="h-8 w-[1px] bg-zinc-700"></div>
            <span className="text-[10px] font-bold uppercase text-blue-400">Ready for Dispatch</span>
          </div>
        </div>
      </div>

      {/* Tasks Grid */}
      {tasks.length > 0 ? (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
          {tasks.map((task) => (
            <div key={task._id} className="relative bg-white border border-slate-100 rounded-[60px] p-2 hover:shadow-2xl hover:shadow-slate-100 transition-all duration-500 group">
              <div className="bg-white rounded-[55px] p-8 md:p-12 overflow-visible">
                
                {/* Meta Header */}
                <div className="flex justify-between items-center mb-10">
                  <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest bg-slate-50 px-4 py-1 rounded-full border border-slate-100">
                    <FiHash className="inline mr-1" /> {task._id.slice(-8).toUpperCase()}
                  </span>

                  {/* CUSTOM DROPDOWN */}
                  {
                    task.status !== "cancelled" ? 
                    <div className="relative">
                    <button 
                      onClick={() => setOpenDropdown(openDropdown === task._id ? null : task._id)}
                      disabled={updatingId === task._id}
                      className={`flex items-center gap-3 px-5 py-2.5 rounded-2xl border transition-all duration-300 active:scale-95 ${
                        task.status === 'completed' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' :
                        task.status === 'in-progress' ? 'bg-blue-50 border-blue-100 text-blue-600' :
                        'bg-amber-50 border-amber-100 text-amber-600'
                      }`}
                    >
                      {updatingId === task._id ? (
                        <FiLoader className="animate-spin" />
                      ) : (
                        <>
                          <span className="text-[10px] font-black uppercase tracking-widest">{task.status}</span>
                          <FiChevronDown size={14} strokeWidth={3} />
                        </>
                      )}
                    </button>

                    {openDropdown === task._id && (
                      <div className="absolute right-0 mt-3 w-48 bg-white border border-slate-100 rounded-3xl shadow-2xl p-2 z-[100] animate-in fade-in slide-in-from-top-2">
                        {statusOptions.map((opt) => (
                          <button
                            key={opt.value}
                            onClick={() => handleStatusUpdate(task._id, opt.value)}
                            className={`w-full flex items-center justify-between p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-colors ${opt.color}`}
                          >
                            {opt.label}
                            {task.status === opt.value && <FiCheckCircle />}
                          </button>
                        ))}
                      </div>
                    )}
                  </div> : <span className='text-red-600 font-bold'>Cancelled</span>
                  }
                </div>

                {/* Content */}
                <h3 className="text-3xl font-black text-zinc-900 mb-4 tracking-tight">
                  {task.title}
                </h3>
                <p className="text-slate-500 text-sm font-medium leading-relaxed mb-10 border-l-4 border-slate-100 pl-6">
                  {task.description}
                </p>

                {/* Task Details */}
                <div className="grid grid-cols-2 gap-y-10 gap-x-4 mb-12">
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><FiMapPin className="text-blue-600"/> Site</p>
                    <p className="text-xs font-black text-zinc-800 uppercase truncate">{task.location}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><FiPhone className="text-blue-600"/> Contact</p>
                    <p className="text-xs font-black text-zinc-800 uppercase">{task.phone}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><FiCalendar className="text-blue-600"/> Assigned</p>
                    <p className="text-xs font-black text-zinc-800 uppercase">{new Date(task.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><FiClock className="text-blue-600"/> Current Phase</p>
                    <p className="text-xs font-black text-zinc-800 uppercase">{task.status}</p>
                  </div>
                </div>

                {/* History Section */}
                {task.notes && task.notes.length > 0 && (
                  <div className="pt-10 border-t border-slate-100">
                    <div className="flex items-center gap-2 mb-6">
                      <FiMessageSquare className="text-slate-300" />
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Protocol Updates</span>
                    </div>
                    <div className="space-y-4">
                      {task.notes.slice(-2).map((note, idx) => (
                        <div key={idx} className="bg-slate-50/50 rounded-[30px] p-6 border border-slate-100">
                          <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-black text-zinc-900 uppercase italic">{note.senderName}</span>
                              <span className="text-[8px] bg-zinc-900 text-white px-2 py-0.5 rounded font-black uppercase">{note.senderRole}</span>
                            </div>
                            <span className="text-[9px] text-slate-400 font-medium">{note.time}</span>
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
        <div className="py-40 flex flex-col items-center justify-center bg-white rounded-[100px] border-4 border-dashed border-slate-100">
           <FiPackage size={50} className="text-slate-100 mb-6" />
           <h3 className="text-2xl font-black text-zinc-900 uppercase tracking-tighter">No Tasks Assigned</h3>
           <p className="text-slate-400 font-medium">Your work queue is currently empty.</p>
        </div>
      )}
    </div>
  );
};

export default WorkerTasks;