import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL;

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/auth/login`, { email, password });
      
      const { token, role } = res.data.data;
      localStorage.setItem('token', token);
      localStorage.setItem('role', role); 

      if (role === 'admin') {
        navigate('/all-jobs');
      } else if (role === 'worker') {
        navigate('/my-tasks');
      } else if (role === 'client') {
        navigate('/all-orders');
      } else {
        navigate('/');
      }

    } catch (err) {
      alert(err.response?.data?.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans antialiased">
      
      {/* LEFT SIDE: Deep Dark Gradient with Modern Typography */}
      <div className="hidden lg:flex w-[42%] bg-gradient-to-br from-zinc-950 via-black to-zinc-900 flex-col justify-between p-12 relative overflow-hidden">
        {/* Abstract Background Element */}
        <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-red-600/10 blur-[120px] rounded-full"></div>
        
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-9 h-9 bg-red-600 flex items-center justify-center rounded-xl shadow-lg shadow-red-600/20">
             <span className="text-white font-black text-xl italic">F</span>
          </div>
          <span className="text-xl font-bold tracking-tight text-white uppercase">Field<span className="text-red-600">Ops</span></span>
        </div>

        <div className="relative z-10">
          <h1 className="text-5xl font-bold text-white leading-[1.1] tracking-tight">
            The next generation <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-800">
              Work Management.
            </span>
          </h1>
          <p className="mt-6 text-gray-400 text-lg max-w-sm font-light leading-relaxed">
            Stop juggling spreadsheets. Start closing tasks with our high-performance portal designed for professionals.
          </p>

          <div className="mt-12 space-y-5">
            {['Lightning Fast', 'Enterprise Security', 'Deep Insights'].map((text, i) => (
              <div key={i} className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-red-500/50 transition-all">
                  <span className="text-red-500 text-sm">✦</span>
                </div>
                <span className="text-gray-300 font-medium">{text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-xs text-zinc-600 font-medium">
          © 2026 FIELDOPS CRM. SYSTEM VERSION 4.0.1
        </div>
      </div>

      {/* RIGHT SIDE: Clean White Card (BTS CRM Style) */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-[460px] bg-white p-12 rounded-[40px] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.08)] border border-gray-100/50">
          <div className="mb-10">
            <h2 className="text-4xl font-extrabold text-zinc-900 tracking-tight">Login</h2>
            <p className="text-slate-500 mt-2 font-medium">Enter your credentials to continue</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-[1.5px] ml-1">Work Email</label>
              <input 
                type="email" 
                required
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:border-red-500 focus:ring-4 focus:ring-red-500/5 transition-all outline-none text-[15px] text-zinc-700 placeholder:text-slate-300" 
                placeholder="shahzaib@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-[1.5px]">Password</label>
              </div>
              <input 
                type="password" 
                required
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:border-red-500 focus:ring-4 focus:ring-red-500/5 transition-all outline-none text-[15px] text-zinc-700 placeholder:text-slate-300" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button 
              disabled={loading}
              className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-4 rounded-2xl shadow-xl shadow-red-500/20 transform active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-[15px] mt-4"
            >
              {loading ? "Verifying Account..." : "Login →"}
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-slate-500 text-sm font-medium">
              Don't have an Account? 
              <span 
                className="text-red-600 font-bold cursor-pointer hover:underline ml-1.5" 
                onClick={()=> navigate("/")}
              >
                Signup here
              </span>
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Login;