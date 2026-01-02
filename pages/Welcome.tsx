import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UserRole } from '../types';
import { Store, GraduationCap, ChevronRight, ShieldCheck } from 'lucide-react';

const Welcome: React.FC = () => {
  const navigate = useNavigate();

  const handleRoleSelect = (role: UserRole) => {
    navigate('/login', { state: { role } });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 max-w-md mx-auto relative overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 z-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#64748b 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
      
      {/* Decorative Blur Orbs */}
      <div className="absolute top-0 -left-10 w-64 h-64 bg-primary-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

      <div className="w-full space-y-8 relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
        
        {/* Header Section */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center p-4 bg-white rounded-3xl shadow-xl shadow-slate-200/50 mb-4 transform -rotate-3 hover:rotate-0 transition-transform duration-500">
            <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center">
               <span className="text-white font-bold text-3xl">M</span>
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Welcome to MessMate</h1>
            <p className="text-slate-500 text-lg mt-2">Who are you logging in as?</p>
          </div>
        </div>

        {/* Role Selection Cards */}
        <div className="space-y-4 pt-2">
          
          {/* Owner Card */}
          <button
            onClick={() => handleRoleSelect(UserRole.OWNER)}
            className="w-full group relative bg-white border border-slate-200 p-5 rounded-2xl shadow-sm hover:shadow-xl hover:shadow-blue-500/10 hover:border-blue-200 transition-all duration-300 active:scale-[0.98] flex items-center text-left"
          >
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mr-5 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300 shadow-inner">
              <Store size={32} strokeWidth={1.5} />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-slate-800 text-lg group-hover:text-blue-700 transition-colors">Mess Owner</h3>
              <p className="text-slate-400 text-sm mt-0.5 font-medium">Manage attendance, billing & students</p>
            </div>
            <div className="text-slate-300 group-hover:text-blue-500 transition-colors transform group-hover:translate-x-1 duration-300">
              <ChevronRight size={24} />
            </div>
          </button>

          {/* Student Card */}
          <button
            onClick={() => handleRoleSelect(UserRole.STUDENT)}
            className="w-full group relative bg-white border border-slate-200 p-5 rounded-2xl shadow-sm hover:shadow-xl hover:shadow-emerald-500/10 hover:border-emerald-200 transition-all duration-300 active:scale-[0.98] flex items-center text-left"
          >
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mr-5 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300 shadow-inner">
              <GraduationCap size={32} strokeWidth={1.5} />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-slate-800 text-lg group-hover:text-emerald-700 transition-colors">Student</h3>
              <p className="text-slate-400 text-sm mt-0.5 font-medium">Check daily menu, attendance & status</p>
            </div>
            <div className="text-slate-300 group-hover:text-emerald-500 transition-colors transform group-hover:translate-x-1 duration-300">
              <ChevronRight size={24} />
            </div>
          </button>

        </div>

        {/* Trust/Footer */}
        <div className="flex flex-col items-center space-y-4 pt-8 opacity-60">
          <div className="flex items-center space-x-2 text-xs font-medium text-slate-400 bg-white px-3 py-1 rounded-full border border-slate-100 shadow-sm">
            <ShieldCheck size={12} />
            <span>Secure & Private</span>
          </div>
          <p className="text-center text-[10px] text-slate-400 max-w-xs leading-relaxed">
            By continuing, you acknowledge that you have read and understood, and agree to our Terms & Conditions and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Welcome;