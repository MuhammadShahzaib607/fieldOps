import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  FiEdit3, FiMapPin, FiPhone, FiType, FiAlignLeft, 
  FiActivity, FiCheck, FiChevronLeft, FiLoader, FiZap,
  FiUser, FiHardDrive, FiChevronDown
} from 'react-icons/fi';

const EditJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem('token');

  // Form & UI States
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    phone: '',
    location: '',
    status: 'pending',
    clientId: '', // Added for update
    workerId: ''  // Added for update
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // New States for Custom Dropdowns
  const [users, setUsers] = useState({ clients: [], workers: [] });
  const [showClientDrop, setShowClientDrop] = useState(false);
  const [showWorkerDrop, setShowWorkerDrop] = useState(false);

  // 1. Fetch Existing Data & Users
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Users for Dropdowns
        const usersRes = await axios.get(`${API_URL}/auth/all-users`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Fetch Job Details
        const jobRes = await axios.get(`${API_URL}/job/all`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (usersRes.data.success) {
          const allUsers = usersRes.data.data;
          setUsers({
            clients: allUsers.filter(u => u.role === 'client'),
            workers: allUsers.filter(u => u.role === 'worker')
          });
        }

        if (jobRes.data.success) {
          const job = jobRes.data.data.find(j => j._id === id);
          if (job) {
            setFormData({
              title: job.title,
              description: job.description,
              phone: job.phone,
              location: job.location,
              status: job.status,
              clientId: job.clientId?._id || '',
              workerId: job.workerId?._id || ''
            });
          }
        }
      } catch (err) {
        console.error("Fetch error", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, API_URL, token]);

  // 2. Update Logic
  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const res = await axios.put(`${API_URL}/job/update/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        navigate(-1);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Update failed.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center">
      <FiLoader className="animate-spin text-red-600" size={32} />
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto pb-20 px-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-12">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-400 hover:text-zinc-950 font-bold text-xs uppercase tracking-widest transition-all"
        >
          <FiChevronLeft strokeWidth={3} /> Back to Fleet
        </button>
        <div className="text-right">
          <span className="text-[10px] font-black text-red-600 uppercase tracking-[3px]">Modification Mode</span>
          <h1 className="text-3xl font-black text-zinc-950 tracking-tighter uppercase">Edit Job Order</h1>
        </div>
      </div>

      <form onSubmit={handleUpdate} className="space-y-6">
        <div className="bg-white rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/40 p-8 md:p-12 relative overflow-hidden">
          
          {/* Decorative Accent */}
          <div className="absolute top-0 right-0 p-10 opacity-[0.03] text-zinc-950 pointer-events-none">
            <FiEdit3 size={120} />
          </div>

          <div className="grid grid-cols-1 gap-8 relative">
            
            {/* Title Field */}
            <div>
              <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">
                <FiType className="text-red-600" /> Identification Title
              </label>
              <input 
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-zinc-900 font-bold focus:ring-4 focus:ring-red-500/5 focus:border-red-500 outline-none transition-all"
                placeholder="Job Heading"
              />
            </div>

            {/* Description Field */}
            <div>
              <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">
                <FiAlignLeft className="text-red-600" /> Operational Details
              </label>
              <textarea 
                required
                rows="4"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-zinc-800 font-medium focus:ring-4 focus:ring-red-500/5 focus:border-red-500 outline-none transition-all resize-none italic"
                placeholder="Enter job specifics..."
              />
            </div>

            {/* CUSTOM DROPDOWNS SECTION (CLIENT & WORKER) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               {/* Custom Client Dropdown */}
               <div className="relative">
                <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">
                  <FiUser className="text-red-600" /> Assign Client
                </label>
                <div 
                  onClick={() => setShowClientDrop(!showClientDrop)}
                  className="w-full bg-zinc-900 text-white rounded-2xl px-6 py-4 flex items-center justify-between cursor-pointer border border-zinc-800 hover:bg-zinc-800 transition-all shadow-lg"
                >
                  <span className="text-xs font-black uppercase tracking-wider">
                    {users.clients.find(c => c._id === formData.clientId)?.username || "Select Client"}
                  </span>
                  <FiChevronDown className={`transition-transform ${showClientDrop ? 'rotate-180' : ''}`} />
                </div>
                {showClientDrop && (
                  <div className="absolute z-50 w-full mt-2 bg-white border border-slate-100 rounded-2xl shadow-2xl overflow-hidden max-h-48 overflow-y-auto">
                    {users.clients.map(client => (
                      <div 
                        key={client._id}
                        onClick={() => { setFormData({...formData, clientId: client._id}); setShowClientDrop(false); }}
                        className="px-6 py-3 text-xs font-bold text-zinc-600 hover:bg-red-50 hover:text-red-600 cursor-pointer transition-colors border-b border-slate-50 last:border-0"
                      >
                        {client.username}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Custom Worker Dropdown */}
              <div className="relative">
                <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">
                  <FiHardDrive className="text-red-600" /> Assign Worker
                </label>
                <div 
                  onClick={() => setShowWorkerDrop(!showWorkerDrop)}
                  className="w-full bg-zinc-900 text-white rounded-2xl px-6 py-4 flex items-center justify-between cursor-pointer border border-zinc-800 hover:bg-zinc-800 transition-all shadow-lg"
                >
                  <span className="text-xs font-black uppercase tracking-wider">
                    {users.workers.find(w => w._id === formData.workerId)?.username || "Select Worker"}
                  </span>
                  <FiChevronDown className={`transition-transform ${showWorkerDrop ? 'rotate-180' : ''}`} />
                </div>
                {showWorkerDrop && (
                  <div className="absolute z-50 w-full mt-2 bg-white border border-slate-100 rounded-2xl shadow-2xl overflow-hidden max-h-48 overflow-y-auto">
                    {users.workers.map(worker => (
                      <div 
                        key={worker._id}
                        onClick={() => { setFormData({...formData, workerId: worker._id}); setShowWorkerDrop(false); }}
                        className="px-6 py-3 text-xs font-bold text-zinc-600 hover:bg-red-50 hover:text-red-600 cursor-pointer transition-colors border-b border-slate-50 last:border-0"
                      >
                        {worker.username}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Two Column Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">
                  <FiPhone className="text-red-600" /> Contact Protocol
                </label>
                <input 
                  type="text"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-zinc-900 font-bold outline-none focus:border-zinc-950 transition-all"
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">
                  <FiMapPin className="text-red-600" /> Deployment Zone
                </label>
                <input 
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-zinc-900 font-bold outline-none focus:border-zinc-950 transition-all"
                />
              </div>
            </div>

            {/* Status Dropdown - The Game Changer */}
            <div>
              <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">
                <FiActivity className="text-red-600" /> Deployment Status
              </label>
              <div className="relative">
                <select 
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className={`w-full appearance-none border rounded-2xl px-6 py-4 font-black uppercase tracking-widest text-[12px] outline-none transition-all cursor-pointer
                    ${formData.status === 'pending' ? 'bg-amber-50 border-amber-200 text-amber-600' : 
                      formData.status === 'in-progress' ? 'bg-blue-50 border-blue-200 text-blue-600' : 
                      formData.status === 'completed' ? 'bg-emerald-50 border-emerald-200 text-emerald-600' :
                      'bg-rose-50 border-rose-200 text-rose-600'}
                  `}
                >
                  <option value="pending">Pending Review</option>
                  <option value="in-progress">In-Progress Operation</option>
                  <option value="completed">Completed / Archived</option>
                  <option value="cancelled">Cancelled / Terminated</option>
                </select>
                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
                  <FiZap />
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Submit Button */}
        <button 
          type="submit"
          disabled={updating}
          className="w-full bg-zinc-950 text-white py-6 rounded-[28px] font-black uppercase tracking-[3px] text-sm shadow-2xl shadow-zinc-950/20 hover:bg-red-600 transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50"
        >
          {updating ? (
            <FiLoader className="animate-spin" />
          ) : (
            <><FiCheck strokeWidth={4} /> Update Job</>
          )}
        </button>
      </form>
    </div>
  );
};

export default EditJob;