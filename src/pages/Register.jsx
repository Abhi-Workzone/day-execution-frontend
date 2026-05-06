import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Loader2, UserPlus, ArrowRight } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await register({ name, email, password });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="max-w-md w-full space-y-8 bg-white p-6 sm:p-8 lg:p-10 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary-600 rounded-2xl mx-auto flex items-center justify-center text-white font-black text-lg sm:text-xl shadow-lg shadow-primary-200">
            DE
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight pt-4">Join Us</h2>
          <p className="text-slate-500 font-medium text-sm sm:text-base">Create your account to start planning</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-2xl text-sm font-bold animate-in shake-1">
            {error}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="relative">
              <label className="text-xs font-black text-slate-400 uppercase ml-1 mb-1 block">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  required
                  className="w-full pl-12 pr-4 py-3 sm:py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-primary-500 outline-none transition-all font-medium text-slate-700 text-sm sm:text-base"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            <div className="relative">
              <label className="text-xs font-black text-slate-400 uppercase ml-1 mb-1 block">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="email"
                  required
                  className="w-full pl-12 pr-4 py-3 sm:py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-primary-500 outline-none transition-all font-medium text-slate-700 text-sm sm:text-base"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="relative">
              <label className="text-xs font-black text-slate-400 uppercase ml-1 mb-1 block">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="password"
                  required
                  className="w-full pl-12 pr-4 py-3 sm:py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-primary-500 outline-none transition-all font-medium text-slate-700 text-sm sm:text-base"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-600 text-white py-3 sm:py-4 rounded-2xl font-black text-base sm:text-lg hover:bg-primary-700 transition-all shadow-xl shadow-primary-200 flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" /> : (
              <>Get Started <ArrowRight size={18} sm:size={20} /></>
            )}
          </button>
        </form>

        <div className="text-center pt-4">
          <p className="text-slate-500 font-medium text-sm sm:text-base">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 font-black hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
