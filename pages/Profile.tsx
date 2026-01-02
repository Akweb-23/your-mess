import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { UserRole, User, Mess } from '../types';
import { mockAuth, messService } from '../services/mockDb';
import { Button } from '../components/ui/Button';
import { useToast } from '../context/ToastContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, User as UserIcon, Phone, Store, CreditCard, Save, GraduationCap } from 'lucide-react';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  const [user, setUser] = useState<User | null>(null);
  const [mess, setMess] = useState<Mess | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Edit State
  const [name, setName] = useState('');
  const [messName, setMessName] = useState('');
  const [rate, setRate] = useState<string>('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const currentUser = mockAuth.getCurrentUser();
    setUser(currentUser);
    
    if (currentUser) {
      setName(currentUser.name);
      
      if (currentUser.role === UserRole.OWNER) {
        const myMess = messService.getMess(currentUser.id);
        setMess(myMess);
        if (myMess) {
          setMessName(myMess.name);
          setRate(myMess.perMealRate.toString());
        }
      } else if (currentUser.messId) {
        const myMess = messService.getMessById(currentUser.messId);
        setMess(myMess);
      }
    }
    setIsLoading(false);
  };

  const handleLogout = () => {
    mockAuth.logout();
    navigate('/');
    showToast('Logged out successfully', 'info');
  };

  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);

    try {
      // 1. Update User Profile
      if (name !== user.name) {
        await mockAuth.updateUser(user.id, { name });
      }

      // 2. Update Mess Settings (Owner Only)
      if (user.role === UserRole.OWNER && mess) {
        const numRate = parseFloat(rate);
        if (isNaN(numRate) || numRate < 0) {
            showToast('Please enter a valid rate', 'error');
            setIsSaving(false);
            return;
        }

        if (messName !== mess.name || numRate !== mess.perMealRate) {
            await messService.updateMess(mess.id, { 
                name: messName, 
                perMealRate: numRate 
            });
        }
      }

      showToast('Profile updated successfully', 'success');
      loadData(); // Refresh data
    } catch (e) {
      console.error(e);
      showToast('Failed to save changes', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || !user) {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="w-8 h-8 border-4 border-primary-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );
  }

  const hasChanges = 
    name !== user.name || 
    (user.role === UserRole.OWNER && mess && (messName !== mess.name || rate !== mess.perMealRate.toString()));

  return (
    <Layout role={user.role}>
      <div className="p-6 space-y-6">
        
        {/* Profile Header Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-2xl font-bold mb-3 shadow-inner">
                {user.name.charAt(0).toUpperCase()}
            </div>
            <h2 className="text-xl font-bold text-slate-850">{user.name}</h2>
            
            {/* Role Badge */}
            <div className={`mt-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border flex items-center gap-1.5 ${
                user.role === UserRole.OWNER 
                    ? 'bg-blue-50 text-blue-700 border-blue-100' 
                    : 'bg-emerald-50 text-emerald-700 border-emerald-100'
            }`}>
                {user.role === UserRole.OWNER ? <Store size={12} /> : <GraduationCap size={14} />}
                <span>{user.role === UserRole.OWNER ? 'Mess Owner' : 'Student'}</span>
            </div>
        </div>

        {/* Personal Details */}
        <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wide ml-1">Personal Info</h3>
            
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                <div className="p-4 border-b border-gray-50 flex items-center space-x-3">
                    <UserIcon size={18} className="text-gray-400" />
                    <div className="flex-1">
                        <label className="block text-xs text-gray-400 font-medium mb-1">Full Name</label>
                        <input 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full text-sm font-semibold text-slate-850 placeholder-gray-300 focus:outline-none focus:ring-0 bg-transparent"
                            placeholder="Your Name"
                        />
                    </div>
                </div>
                <div className="p-4 flex items-center space-x-3 bg-gray-50/50">
                    <Phone size={18} className="text-gray-400" />
                    <div className="flex-1">
                        <label className="block text-xs text-gray-400 font-medium mb-1">Phone Number</label>
                        <p className="text-sm font-semibold text-gray-500">{user.phone}</p>
                    </div>
                </div>
            </div>
        </div>

        {/* Mess Settings (Owner) */}
        {user.role === UserRole.OWNER && mess && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wide ml-1">Mess Settings</h3>
                
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                    <div className="p-4 border-b border-gray-50 flex items-center space-x-3">
                        <Store size={18} className="text-gray-400" />
                        <div className="flex-1">
                            <label className="block text-xs text-gray-400 font-medium mb-1">Mess Name</label>
                            <input 
                                value={messName}
                                onChange={(e) => setMessName(e.target.value)}
                                className="w-full text-sm font-semibold text-slate-850 placeholder-gray-300 focus:outline-none focus:ring-0 bg-transparent"
                            />
                        </div>
                    </div>
                    <div className="p-4 flex items-center space-x-3">
                        <CreditCard size={18} className="text-gray-400" />
                        <div className="flex-1">
                            <label className="block text-xs text-gray-400 font-medium mb-1">Per Meal Rate (₹)</label>
                            <input 
                                type="number"
                                value={rate}
                                onChange={(e) => setRate(e.target.value)}
                                className="w-full text-sm font-semibold text-slate-850 placeholder-gray-300 focus:outline-none focus:ring-0 bg-transparent"
                            />
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* Mess Info (Student) */}
        {user.role === UserRole.STUDENT && mess && (
             <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wide ml-1">Mess Details</h3>
                <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center space-x-4">
                     <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center">
                        <Store size={20} />
                     </div>
                     <div>
                        <p className="text-xs text-gray-400">Current Mess</p>
                        <p className="font-bold text-slate-850">{mess.name}</p>
                     </div>
                </div>
             </div>
        )}

        {/* Save Button */}
        {hasChanges && (
            <div className="fixed bottom-24 left-0 right-0 px-6 max-w-md mx-auto z-30 animate-in slide-in-from-bottom-4">
                <Button 
                    onClick={handleSave} 
                    disabled={isSaving} 
                    fullWidth 
                    className="shadow-xl shadow-primary-500/20 flex items-center justify-center space-x-2"
                >
                    <Save size={18} />
                    <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
                </Button>
            </div>
        )}

        {/* Logout Section */}
        <div className="pt-4">
            <button 
                onClick={handleLogout}
                className="w-full bg-red-50 text-red-600 font-semibold py-4 rounded-xl border border-red-100 flex items-center justify-center space-x-2 hover:bg-red-100 transition-colors"
            >
                <LogOut size={18} />
                <span>Log Out</span>
            </button>
            <p className="text-center text-xs text-gray-300 mt-4">Version 1.0.0</p>
        </div>

      </div>
    </Layout>
  );
};

export default Profile;