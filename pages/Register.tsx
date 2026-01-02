import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { mockAuth } from '../services/mockDb';
import { Button } from '../components/ui/Button';
import { UserRole } from '../types';
import { useToast } from '../context/ToastContext';
import { ArrowLeft, User, Phone, Store } from 'lucide-react';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();
  
  const initialRole = location.state?.role || UserRole.OWNER; // Default to Owner if coming directly
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    messName: '',
  });
  const [role, setRole] = useState<UserRole>(initialRole);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'phone') {
        const numeric = value.replace(/\D/g, '');
        if (numeric.length <= 10) setFormData(prev => ({ ...prev, [name]: numeric }));
    } else {
        setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (formData.phone.length !== 10) {
      showToast('Please enter a valid 10-digit mobile number', 'error');
      setIsLoading(false);
      return;
    }

    if (formData.name.length < 3) {
      showToast('Name must be at least 3 characters', 'error');
      setIsLoading(false);
      return;
    }

    if (role === UserRole.OWNER && formData.messName.length < 3) {
      showToast('Mess Name is required for owners', 'error');
      setIsLoading(false);
      return;
    }

    try {
      await mockAuth.register(formData.name, formData.phone, role, formData.messName);
      showToast('Account created successfully!', 'success');
      
      // Auto redirect based on role
      if (role === UserRole.OWNER) {
        navigate('/owner/dashboard');
      } else {
        navigate('/student/dashboard');
      }
    } catch (err: any) {
      if (err.message === 'User already exists') {
        showToast('This phone number is already registered. Please Login.', 'error');
        navigate('/login');
      } else {
        showToast('Failed to register. Please try again.', 'error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col p-6 max-w-md mx-auto">
      <div className="pt-2">
        <button 
          onClick={() => navigate('/login')}
          className="p-2 -ml-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
      </div>

      <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full -mt-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Create Account</h1>
          <p className="text-slate-500 mt-2">Join MessMate to manage your meals simply.</p>
        </div>

        {/* Role Toggle */}
        <div className="bg-slate-100 p-1 rounded-xl flex mb-6">
            <button 
                type="button"
                onClick={() => setRole(UserRole.OWNER)}
                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
                    role === UserRole.OWNER ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
            >
                Mess Owner
            </button>
            <button 
                type="button"
                onClick={() => setRole(UserRole.STUDENT)}
                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
                    role === UserRole.STUDENT ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
            >
                Student
            </button>
        </div>

        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label className="text-sm font-semibold text-slate-700 ml-1">Full Name</label>
            <div className="relative mt-1">
                <User size={20} className="absolute left-4 top-3.5 text-slate-400" />
                <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all text-slate-900 placeholder-slate-400"
                    placeholder="e.g. Rahul Kumar"
                    required
                />
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-700 ml-1">Phone Number</label>
            <div className="relative mt-1">
                <span className="absolute left-4 top-3.5 text-slate-400 font-medium select-none">+91</span>
                <input
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full pl-14 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all text-slate-900 placeholder-slate-400"
                    placeholder="00000 00000"
                    maxLength={10}
                    required
                />
            </div>
          </div>

          {role === UserRole.OWNER && (
             <div className="animate-in fade-in slide-in-from-top-2">
                <label className="text-sm font-semibold text-slate-700 ml-1">Mess Name</label>
                <div className="relative mt-1">
                    <Store size={20} className="absolute left-4 top-3.5 text-slate-400" />
                    <input
                        name="messName"
                        value={formData.messName}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all text-slate-900 placeholder-slate-400"
                        placeholder="e.g. Annapurna Mess"
                        required
                    />
                </div>
            </div>
          )}

          <div className="pt-4">
            <Button type="submit" fullWidth disabled={isLoading} className="py-3.5">
                {isLoading ? 'Creating Account...' : 'Sign Up'}
            </Button>
          </div>
        </form>

        <p className="text-center text-slate-500 text-sm mt-6">
            Already have an account?{' '}
            <button 
            onClick={() => navigate('/login')}
            className="text-primary-600 font-bold hover:underline"
            >
            Log In
            </button>
        </p>
      </div>
    </div>
  );
};

export default Register;