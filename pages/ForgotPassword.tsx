import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { useToast } from '../context/ToastContext';
import { ArrowLeft, KeyRound } from 'lucide-react';

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [phone, setPhone] = useState('');
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length !== 10) {
      showToast('Enter a valid 10-digit number', 'error');
      return;
    }
    
    // Mock API call
    setTimeout(() => {
      setIsSent(true);
      showToast('OTP sent successfully!', 'success');
    }, 1000);
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

      <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full -mt-10 text-center">
        <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <KeyRound size={32} />
        </div>
        
        <h1 className="text-2xl font-bold text-slate-900">Trouble Logging In?</h1>
        <p className="text-slate-500 mt-2 mb-8">
          Enter your registered mobile number and we'll send you an OTP to get back into your account.
        </p>

        {!isSent ? (
          <form onSubmit={handleSubmit} className="space-y-6 text-left">
             <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 ml-1">Phone Number</label>
                <div className="relative">
                <span className="absolute left-4 top-3.5 text-slate-400 font-medium select-none">+91</span>
                <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    className="w-full pl-14 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all text-lg font-medium text-slate-900 placeholder-slate-400"
                    placeholder="00000 00000"
                    inputMode="numeric"
                    autoFocus
                />
                </div>
            </div>
            <Button type="submit" fullWidth className="py-3.5">
              Send OTP
            </Button>
          </form>
        ) : (
          <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-6 animate-in fade-in zoom-in">
            <p className="text-emerald-800 font-medium mb-4">
              We've sent an OTP to <span className="font-bold">+91 {phone}</span>
            </p>
            <p className="text-xs text-emerald-600 mb-6">
              (Since this is a demo, just go back to Login and enter any number or use the demo credentials)
            </p>
            <Button variant="secondary" fullWidth onClick={() => navigate('/login')}>
              Back to Login
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;