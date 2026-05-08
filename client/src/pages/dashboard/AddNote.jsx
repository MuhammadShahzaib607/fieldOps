import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  FiMessageSquare, FiSend, FiChevronLeft, 
  FiLoader, FiInfo, FiActivity 
} from 'react-icons/fi';

const AddNote = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [noteText, setNoteText] = useState('');
  const [loading, setLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem('token');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!noteText.trim()) return;

    setLoading(true);
    try {
      const res = await axios.post(
        `${API_URL}/job/add-note/${id}`, 
        { text: noteText },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        navigate(-1); // Go back to the previous jobs page
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to broadcast note.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4">
      {/* Back Navigation */}
      <button 
        onClick={() => navigate(-1)}
        className="mb-8 flex items-center gap-2 text-slate-400 hover:text-zinc-950 font-black text-[10px] uppercase tracking-[3px] transition-all group"
      >
        <FiChevronLeft className="group-hover:-translate-x-1 transition-transform" strokeWidth={3} /> 
        Cancel Operation
      </button>

      <div className="w-full max-w-xl">
        <div className="bg-white rounded-[50px] border border-slate-100 shadow-2xl shadow-slate-200/60 overflow-hidden relative">
          
          {/* Top Decorative Bar */}
          <div className="h-2 w-full bg-gradient-to-r from-red-600 via-zinc-950 to-red-600"></div>

          <form onSubmit={handleSubmit} className="p-10 md:p-14">
            
            {/* Header Section */}
            <div className="flex items-center justify-between mb-10">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <FiActivity className="text-red-600 animate-pulse" size={14} />
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Internal Memo</span>
                </div>
                <h1 className="text-3xl font-black text-zinc-950 tracking-tighter uppercase leading-none">
                  Add Note<span className="text-red-600">.</span>
                </h1>
              </div>
              <div className="w-14 h-14 bg-zinc-50 rounded-2xl flex items-center justify-center text-zinc-300">
                <FiMessageSquare size={28} />
              </div>
            </div>

            {/* Input Field */}
            <div className="relative group mb-10">
              <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-4 ml-1">
                Communication Text
              </label>
              <textarea 
                autoFocus
                required
                rows="5"
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Type your operational update here..."
                className="w-full bg-slate-50 border-2 border-transparent rounded-[32px] px-8 py-6 text-zinc-800 font-medium italic focus:bg-white focus:border-red-100 focus:ring-4 focus:ring-red-500/5 outline-none transition-all resize-none shadow-inner"
              />
              
              {/* Floating Info Tag */}
              <div className="absolute -bottom-3 right-6 bg-zinc-950 text-white px-4 py-1 rounded-full flex items-center gap-2 shadow-xl">
                <FiInfo size={10} className="text-red-500" />
                <span className="text-[8px] font-black uppercase tracking-tighter">Visible to all assigned staff</span>
              </div>
            </div>

            {/* Submit Button */}
            <button 
              type="submit"
              disabled={loading || !noteText.trim()}
              className="w-full group relative overflow-hidden bg-zinc-950 text-white py-6 rounded-3xl font-black uppercase tracking-[4px] text-xs shadow-2xl transition-all active:scale-[0.97] disabled:opacity-30 disabled:grayscale"
            >
              <div className="relative z-10 flex items-center justify-center gap-3">
                {loading ? (
                  <FiLoader className="animate-spin" size={18} />
                ) : (
                  <>
                    Broadcast Note
                    <FiSend size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </>
                )}
              </div>
              
              {/* Button Hover Effect */}
              <div className="absolute inset-0 bg-red-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            </button>
          </form>

          {/* Bottom Branding (Static Content) */}
          <div className="bg-slate-50 px-10 py-6 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">Job Reference: #{id.slice(-6)}</span>
            <div className="flex gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-200"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-slate-200"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-red-600"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddNote;