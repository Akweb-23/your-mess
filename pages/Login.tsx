import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { mockAuth } from '../services/mockDb';
import { Button } from '../components/ui/Button';
import { UserRole } from '../types';
import { useToast } from '../context/ToastContext';
import { ArrowLeft } from 'lucide-react';

const Login: React.FC = () => {
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();

  const selectedRole = location.state?.role as UserRole | undefined;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numericValue = value.replace(/\D/g, '');
    if (numericValue.length <= 10) {
      setPhone(numericValue);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const cleanPhone = phone.replace(/\D/g, '');

    if (cleanPhone.length !== 10) {
      showToast('Please enter a valid 10-digit mobile number', 'error');
      setIsLoading(false);
      return;
    }

    try {
      const user = await mockAuth.login(cleanPhone);
      
      if (user) {
        showToast(`Welcome back, ${user.name}!`, 'success');
        if (user.role === UserRole.OWNER) {
          navigate('/owner/dashboard');
        } else {
          navigate('/student/dashboard');
        }
      } else {
        showToast('Account not found. Please register first.', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Network error. Please try again later.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemoLogin = (number: string) => {
    setPhone(number);
  };

  const getGreeting = () => {
    if (selectedRole === UserRole.OWNER) return "Owner Login";
    if (selectedRole === UserRole.STUDENT) return "Student Login";
    return "Welcome Back";
  };

  return (
    <div className="min-h-screen bg-white flex flex-col p-6 max-w-md mx-auto">
      {/* Back Button */}
      <div className="pt-2">
        <button 
          onClick={() => navigate('/welcome')}
          className="p-2 -ml-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
      </div>

      <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full -mt-10">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-primary-500/20">
            <span className="text-white font-bold text-3xl">M</span>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{getGreeting()}</h1>
            <p className="text-slate-500 mt-2">Enter your mobile number to access your account</p>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-6 mt-8">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 ml-1">Phone Number</label>
            <div className="relative">
              <span className="absolute left-4 top-3.5 text-slate-400 font-medium select-none">+91</span>
              <input
                type="tel"
                value={phone}
                onChange={handleInputChange}
                className="w-full pl-14 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all text-lg font-medium tracking-wide text-slate-900 placeholder-slate-400"
                placeholder="00000 00000"
                inputMode="numeric"
                maxLength={10}
                required
                autoFocus
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button 
              type="button" 
              onClick={() => navigate('/forgot-password')}
              className="text-sm font-medium text-primary-600 hover:text-primary-700"
            >
              Trouble logging in?
            </button>
          </div>

          <Button type="submit" fullWidth disabled={isLoading} className="py-3.5 text-lg">
            {isLoading ? 'Verifying...' : 'Get OTP'}
          </Button>
        </form>

        <div className="mt-8 text-center space-y-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-slate-400">Or continue with demo</span>
            </div>
          </div>

          <div className="flex gap-3 justify-center">
            {(!selectedRole || selectedRole === UserRole.OWNER) && (
              <button onClick={() => fillDemoLogin('9876543210')} className="text-xs bg-blue-50 border border-blue-100 px-4 py-2 rounded-full text-blue-700 font-medium hover:bg-blue-100 transition-colors">
                Fill Owner
              </button>
            )}
            {(!selectedRole || selectedRole === UserRole.STUDENT) && (
              <button onClick={() => fillDemoLogin('9000000001')} className="text-xs bg-emerald-50 border border-emerald-100 px-4 py-2 rounded-full text-emerald-700 font-medium hover:bg-emerald-100 transition-colors">
                Fill Student
              </button>
            )}
          </div>

          <div className="pt-2">
            <p className="text-slate-500 text-sm">
              Don't have an account?{' '}
              <button 
                onClick={() => navigate('/register', { state: { role: selectedRole } })}
                className="text-primary-600 font-bold hover:underline"
              >
                Sign Up
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;