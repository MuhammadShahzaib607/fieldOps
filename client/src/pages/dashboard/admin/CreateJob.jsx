import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  FiPlus, FiCpu, FiUser, FiMapPin, FiPhone, 
  FiType, FiAlignLeft, FiCheck, FiX, FiRefreshCw 
} from 'react-icons/fi';

const CreateJob = () => {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem('token');

  // Form States
  const [formData, setFormData] = useState({
    title: '', description: '', workerId: '', clientId: '', phone: '', location: ''
  });

  // Data & UI States
  const [workers, setWorkers] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState(null); // AI Data store karne ke liye

  useEffect(() => {
    fetchUsers();
  }, []);

  // Fetch Users and categorize by role
  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API_URL}/auth/all-users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        const allUsers = res.data.data;
        setWorkers(allUsers.filter(user => user.role === 'worker'));
        setClients(allUsers.filter(user => user.role === 'client'));
      }
    } catch (err) {
      console.error("Error fetching users", err);
    }
  };

  // AI Logic: Improve Title & Description
  const handleAiImprove = async () => {
    if (!formData.title) return alert("Please enter a basic title first!");
    
    setAiLoading(true);
    try {
      const res = await axios.post(`${API_URL}/job/ai/improve-job-content`, 
        { title: formData.title },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      setAiSuggestion(res.data.data);
    } catch (err) {
      console.error("AI Error", err);
    } finally {
      setAiLoading(false);
    }
  };

  // Accept AI Suggestions
  const applyAiSuggestion = () => {
    setFormData({
      ...formData,
      title: aiSuggestion.improvedTitle,
      description: aiSuggestion.description
    });
    setAiSuggestion(null);
  };

  // Final Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/job/create`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        alert("Job Created Successfully!");
        navigate('/all-jobs');
      }
    } catch (err) {
      alert(err.response?.data?.message || "Error creating job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-zinc-900 tracking-tight">Create New Operation</h1>
        <p className="text-slate-500 font-medium">Draft a new job and assign it to your field team.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Main Content Card */}
        <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-8 space-y-6">
          
          {/* Title with AI Button */}
          <div className="relative">
            <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">
              <FiType /> Job Title
            </label>
            <div className="relative">
              <input 
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-zinc-800 font-bold focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all"
                placeholder="e.g. AC Repair"
              />
              <button 
                type="button"
                onClick={handleAiImprove}
                disabled={aiLoading}
                className="absolute right-2 top-2 bottom-2 bg-zinc-950 text-white px-4 rounded-xl flex items-center gap-2 hover:bg-zinc-800 transition-all disabled:opacity-50"
              >
                {aiLoading ? <FiRefreshCw className="animate-spin" /> : <FiCpu className="text-red-500" />}
                <span className="text-xs font-bold uppercase tracking-tight">Generate AI</span>
              </button>
            </div>

            {/* AI Suggestion Box */}
            {aiSuggestion && (
              <div className="mt-4 p-5 bg-zinc-50 border-2 border-dashed border-zinc-200 rounded-2xl animate-in fade-in slide-in-from-top-2">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-[10px] font-black bg-zinc-950 text-white px-2 py-0.5 rounded tracking-widest uppercase">AI Suggestion</span>
                  <div className="flex gap-2">
                    <button type="button" onClick={applyAiSuggestion} className="p-1.5 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-all"><FiCheck size={14}/></button>
                    <button type="button" onClick={() => setAiSuggestion(null)} className="p-1.5 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-all"><FiX size={14}/></button>
                  </div>
                </div>
                <p className="text-sm font-bold text-zinc-900 opacity-60 mb-1">{aiSuggestion.improvedTitle}</p>
                <p className="text-xs text-zinc-500 italic">"{aiSuggestion.description}"</p>
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">
              <FiAlignLeft /> Job Description
            </label>
            <textarea 
              required
              rows="4"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-zinc-800 font-medium focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all resize-none"
              placeholder="Describe the task details..."
            />
          </div>

          {/* Users Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">
                <FiUser className="text-blue-500" /> Assign Worker
              </label>
              <select 
                required
                value={formData.workerId}
                onChange={(e) => setFormData({...formData, workerId: e.target.value})}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-zinc-800 font-bold appearance-none outline-none focus:border-blue-500 transition-all"
              >
                <option value="">Select a Worker</option>
                {workers.map(w => <option key={w._id} value={w._id}>{w.username}</option>)}
              </select>
            </div>
            <div>
              <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">
                <FiUser className="text-emerald-500" /> Select Client
              </label>
              <select 
                required
                value={formData.clientId}
                onChange={(e) => setFormData({...formData, clientId: e.target.value})}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-zinc-800 font-bold appearance-none outline-none focus:border-emerald-500 transition-all"
              >
                <option value="">Select a Client</option>
                {clients.map(c => <option key={c._id} value={c._id}>{c.username}</option>)}
              </select>
            </div>
          </div>

          {/* Contact & Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">
                <FiPhone /> Contact Phone
              </label>
              <input 
                type="text"
                required
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-zinc-800 font-bold outline-none focus:border-zinc-950 transition-all"
                placeholder="+92 3xx xxxxxxx"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">
                <FiMapPin /> Service Location
              </label>
              <input 
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-zinc-800 font-bold outline-none focus:border-zinc-950 transition-all"
                placeholder="Plot, Sector, Area..."
              />
            </div>
          </div>

        </div>

        {/* Submit Button */}
        <button 
          type="submit"
          disabled={loading}
          className="w-full bg-red-600 text-white py-5 rounded-[24px] font-black uppercase tracking-[2px] shadow-xl shadow-red-600/20 hover:bg-red-700 active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
        >
          {loading ? "Initializing..." : <><FiPlus strokeWidth={4} /> Create Operational Job</>}
        </button>

      </form>
    </div>
  );
};

export default CreateJob;