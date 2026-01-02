import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import { UserRole, Mess, User } from '../../types';
import { mockAuth, messService } from '../../services/mockDb';
import { format } from 'date-fns';
import { CheckCircle, XCircle, UtensilsCrossed, RefreshCw, Copy, Check } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const StudentDashboard: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [mess, setMess] = useState<Mess | undefined>();
  const [todayStatus, setTodayStatus] = useState<boolean | null>(null);
  const [currentBill, setCurrentBill] = useState(0);
  const [mealCount, setMealCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [copied, setCopied] = useState(false);
  const { showToast } = useToast();

  const loadData = () => {
    setIsRefreshing(true);
    // Ensure we have the latest user data (in case they were just added to a mess)
    const freshUser = mockAuth.refreshSession(); 
    setUser(freshUser);
    
    if (freshUser && freshUser.messId) {
      const myMess = messService.getMessById(freshUser.messId);
      setMess(myMess);
      
      if (myMess) {
        const today = new Date().toISOString().split('T')[0];
        const attendance = messService.getAttendance(freshUser.messId, today);
        setTodayStatus(attendance[freshUser.id] || false);

        // Get current month bill
        const now = new Date();
        const report = messService.getMonthlyReport(freshUser.messId, now.getFullYear(), now.getMonth());
        const myBill = report.find(r => r.studentId === freshUser.id);
        if (myBill) {
          setCurrentBill(myBill.totalAmount);
          setMealCount(myBill.totalMeals);
        }
      }
    }
    setIsLoading(false);
    setTimeout(() => setIsRefreshing(false), 500);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCopy = () => {
    if (user?.phone) {
      navigator.clipboard.writeText(user.phone);
      setCopied(true);
      showToast('Phone number copied!', 'success');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (isLoading) {
    return (
      <Layout role={UserRole.STUDENT}>
        <div className="flex items-center justify-center h-[60vh] text-gray-400">
          <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
        </div>
      </Layout>
    );
  }

  // CASE: Student not assigned to a mess
  if (!user?.messId || !mess) {
    return (
      <Layout role={UserRole.STUDENT}>
        <div className="flex flex-col h-[calc(100vh-140px)] p-6">
          <div className="flex-1 flex flex-col items-center justify-center text-center space-y-8 animate-in fade-in zoom-in duration-300">
            
            <div className="relative">
               <div className="w-28 h-28 bg-slate-50 rounded-full flex items-center justify-center border-2 border-dashed border-slate-200">
                  <UtensilsCrossed size={48} className="text-slate-300" />
               </div>
               <div className="absolute -bottom-2 -right-2 bg-yellow-100 p-2 rounded-full border border-white shadow-sm">
                 <RefreshCw size={20} className={`text-yellow-600 ${isRefreshing ? 'animate-spin' : ''}`} />
               </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-850">Waiting for Mess Approval</h2>
              <p className="text-gray-500 mt-3 text-sm leading-relaxed max-w-xs mx-auto">
                Your account is ready! To start tracking meals, ask your Mess Owner to add you using this number:
              </p>
            </div>
            
            <div className="w-full max-w-xs bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between group cursor-pointer hover:border-primary-200 transition-colors" onClick={handleCopy}>
               <div className="text-left">
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Your Registered Phone</p>
                  <p className="text-xl font-bold text-slate-850 tracking-wide mt-1">{user?.phone || '...'}</p>
               </div>
               <button className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-500 group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
                  {copied ? <Check size={20} /> : <Copy size={20} />}
               </button>
            </div>

            <div className="w-full max-w-xs pt-4">
              <p className="text-xs text-gray-400 mb-3">Owner already added you?</p>
              <button 
                onClick={loadData}
                disabled={isRefreshing}
                className="w-full bg-slate-850 text-white font-semibold py-4 rounded-xl shadow-lg shadow-slate-200 active:scale-[0.98] transition-all flex items-center justify-center space-x-2 disabled:opacity-70"
              >
                <RefreshCw size={18} className={isRefreshing ? "animate-spin" : ""} />
                <span>Refresh Status</span>
              </button>
            </div>

          </div>
        </div>
      </Layout>
    );
  }

  // CASE: Normal Dashboard
  return (
    <Layout role={UserRole.STUDENT}>
      <div className="p-6 space-y-6">
        <div className="bg-slate-850 rounded-2xl p-6 text-white shadow-xl shadow-slate-200 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
          <div className="relative z-10">
            <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2 flex items-center">
               <span className="w-2 h-2 bg-emerald-400 rounded-full mr-2"></span>
               {mess.name}
            </p>
            <h1 className="text-2xl font-bold">Hello, {user.name.split(' ')[0]}</h1>
            <p className="text-slate-400 text-sm mt-1">Check your daily meal status</p>
          </div>
        </div>

        {/* Today's Status Card */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm text-center relative overflow-hidden">
            <div className={`absolute top-0 left-0 w-full h-1 ${todayStatus ? 'bg-emerald-500' : 'bg-gray-200'}`}></div>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-wide mb-6">Today's Attendance</p>
            <div className="flex flex-col items-center">
                {todayStatus ? (
                    <div className="animate-in zoom-in duration-300">
                        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-4 mx-auto shadow-emerald-100 shadow-lg">
                            <CheckCircle size={40} className="text-emerald-600" strokeWidth={2.5} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-850">Marked Present</h3>
                        <p className="text-sm text-emerald-600 font-medium mt-1 bg-emerald-50 inline-block px-3 py-1 rounded-full">Meal Counted</p>
                    </div>
                ) : (
                    <div>
                         <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4 mx-auto border border-gray-100">
                            <XCircle size={40} className="text-gray-300" strokeWidth={2} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-850">Not Marked</h3>
                        <p className="text-sm text-gray-400 mt-1">You haven't eaten today</p>
                    </div>
                )}
            </div>
        </div>

        {/* Bill Summary Card */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
             <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-slate-850">Current Month Bill</h3>
                <span className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-bold uppercase tracking-wide">{format(new Date(), 'MMMM')}</span>
             </div>
             
             <div className="flex justify-between items-end border-b border-dashed border-gray-200 pb-6 mb-4">
                <div>
                    <p className="text-xs text-gray-400 mb-1">Total Amount</p>
                    <p className="text-4xl font-bold text-primary-600 tracking-tight">₹{currentBill}</p>
                </div>
                <div className="text-right">
                    <p className="text-xs text-gray-400 mb-1">Total Meals</p>
                    <p className="text-2xl font-bold text-slate-850">{mealCount}</p>
                </div>
             </div>
             
             <div className="flex justify-between text-sm">
                <span className="text-gray-500 font-medium">Rate per meal</span>
                <span className="font-bold text-slate-850">₹{mess.perMealRate}</span>
             </div>
        </div>

        <button onClick={loadData} className="w-full py-3 text-xs text-gray-400 font-medium flex items-center justify-center space-x-1 hover:text-gray-600 transition-colors">
           <RefreshCw size={12} className={isRefreshing ? "animate-spin" : ""} />
           <span>Refresh Data</span>
        </button>
      </div>
    </Layout>
  );
};

export default StudentDashboard;