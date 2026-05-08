import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FiEye, FiEyeOff } from 'react-icons/fi';

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'worker' // Default role
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL;

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/auth/signup`, formData);
      if (res.data.success) {
        alert("Account created successfully! Please login.");
        navigate('/login');
      } else {
        alert(res.data.message || "Signup failed.");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans antialiased">
      
      {/* LEFT SIDE: Brand & Value Prop */}
      <div className="hidden lg:flex w-[42%] bg-gradient-to-br from-zinc-950 via-black to-zinc-900 flex-col  gap-17  p-12 relative overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-red-600/10 blur-[120px] rounded-full"></div>
        
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-9 h-9 bg-red-600 flex items-center justify-center rounded-xl shadow-lg shadow-red-600/20">
             <span className="text-white font-black text-xl italic">F</span>
          </div>
          <span className="text-xl font-bold tracking-tight text-white uppercase">Field<span className="text-red-600">Ops</span></span>
        </div>

        <div className="relative z-10">
          <h1 className="text-5xl font-bold text-white leading-[1.1] tracking-tight">
            Join the <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-800">
              Elite Network.
            </span>
          </h1>
          <p className="mt-6 text-gray-400 text-lg max-w-sm font-light leading-relaxed">
            Register today to streamline your workflow and connect with top-tier professionals globally.
          </p>

          <div className="mt-12 space-y-5">
            {[
              { label: 'For Workers', desc: 'Access exclusive high-pay jobs.' },
              { label: 'For Clients', desc: 'Hire verified experts in seconds.' }
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4 group">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-red-500/50 transition-all shrink-0">
                  <span className="text-red-500 text-sm italic font-bold">{item.label[4]}</span>
                </div>
                <div>
                    <p className="text-gray-200 font-semibold text-sm">{item.label}</p>
                    <p className="text-gray-500 text-xs">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-[10px] text-zinc-600 font-medium tracking-widest uppercase">
          Safe • Secure • Reliable
        </div>
      </div>

      {/* RIGHT SIDE: Signup Card */}
      <div className="flex-1 flex items-center justify-center p-8 overflow-y-auto">
        <div className="w-full max-w-[480px] bg-white p-10 rounded-[40px] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.08)] border border-gray-100/50 my-10">
          <div className="mb-8">
            <h2 className="text-3xl font-extrabold text-zinc-900 tracking-tight">Create Account</h2>
            <p className="text-slate-500 mt-2 font-medium">Select your role and enter details</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-5">
            {/* Role Selection Tabs */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-[1.5px] ml-1">Account Type</label>
              <div className="grid grid-cols-2 gap-3 p-1.5 bg-slate-100 rounded-2xl">
                <button
                  type="button"
                  onClick={() => setFormData({...formData, role: 'worker'})}
                  className={`py-2.5 rounded-xl text-sm font-bold transition-all ${
                    formData.role === 'worker' ? 'bg-white text-red-600 shadow-sm' : 'text-slate-500 hover:text-zinc-800'
                  }`}
                >
                  Worker
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({...formData, role: 'client'})}
                  className={`py-2.5 rounded-xl text-sm font-bold transition-all ${
                    formData.role === 'client' ? 'bg-white text-red-600 shadow-sm' : 'text-slate-500 hover:text-zinc-800'
                  }`}
                >
                  Client
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-[1.5px] ml-1">Username</label>
              <input 
                type="text" required
                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:border-red-500 focus:ring-4 focus:ring-red-500/5 transition-all outline-none text-sm text-zinc-700" 
                placeholder="e.g. Muhammad Shahzaib"
                onChange={(e) => setFormData({...formData, username: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-[1.5px] ml-1">Email Address</label>
              <input 
                type="email" required
                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:border-red-500 focus:ring-4 focus:ring-red-500/5 transition-all outline-none text-sm text-zinc-700" 
                placeholder="example@gmail.com"
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-[1.5px] ml-1">Password</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  required
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:border-red-500 focus:ring-4 focus:ring-red-500/5 transition-all outline-none text-sm text-zinc-700" 
                  placeholder="••••••••"
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-red-500 transition-colors p-1"
                >
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
            </div>

            <button 
              disabled={loading}
              className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-4 rounded-2xl shadow-xl shadow-red-500/20 transform active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-sm mt-4"
            >
              {loading ? "Creating Account..." : "Get Started →"}
            </button>
          </form>

          <div className="mt-8 text-center pt-6 border-t border-slate-100">
            <p className="text-slate-500 text-xs font-medium">
              Member already? 
              <span 
                className="text-red-600 font-bold cursor-pointer hover:underline ml-1.5" 
                onClick={() => navigate('/login')}
              >
                Sign in here
              </span>
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Signup;