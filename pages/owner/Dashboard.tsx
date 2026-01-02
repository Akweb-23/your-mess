import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import { UserRole, Mess } from '../../types';
import { mockAuth, messService } from '../../services/mockDb';
import { Users, Utensils, IndianRupee, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const StatCard = ({ icon: Icon, label, value, color, onClick }: any) => (
  <div onClick={onClick} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 active:scale-[0.98] transition-transform cursor-pointer">
    <div className={`w-10 h-10 ${color} rounded-full flex items-center justify-center mb-3`}>
      <Icon size={20} className="text-white" />
    </div>
    <p className="text-gray-500 text-xs font-medium uppercase tracking-wide">{label}</p>
    <p className="text-2xl font-bold text-slate-850 mt-1">{value}</p>
  </div>
);

const OwnerDashboard: React.FC = () => {
  const [mess, setMess] = useState<Mess | undefined>();
  const [studentCount, setStudentCount] = useState(0);
  const [todayAttendance, setTodayAttendance] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const user = mockAuth.getCurrentUser();
    if (user && user.role === UserRole.OWNER) {
      const myMess = messService.getMess(user.id);
      setMess(myMess);
      if (myMess) {
        const students = messService.getStudents(myMess.id);
        setStudentCount(students.length);
        
        const today = new Date().toISOString().split('T')[0];
        const attendance = messService.getAttendance(myMess.id, today);
        const present = Object.values(attendance).filter(Boolean).length;
        setTodayAttendance(present);
      }
    }
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
        <Layout role={UserRole.OWNER}>
            <div className="flex items-center justify-center h-[60vh] text-gray-400">
                Loading...
            </div>
        </Layout>
    );
  }

  if (!mess) {
    return (
        <Layout role={UserRole.OWNER}>
            <div className="p-6 text-center text-gray-500 mt-10">
                <p>Mess information not found.</p>
                <p className="text-sm">Please try logging in again.</p>
            </div>
        </Layout>
    );
  }

  return (
    <Layout role={UserRole.OWNER}>
      <div className="p-6 space-y-6">
        {/* Welcome Header */}
        <div>
          <h2 className="text-2xl font-bold text-slate-850">{mess.name}</h2>
          <p className="text-gray-500">Overview for today</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <StatCard 
            icon={Users} 
            label="Total Students" 
            value={studentCount} 
            color="bg-blue-500" 
            onClick={() => navigate('/owner/students')}
          />
          <StatCard 
            icon={Utensils} 
            label="Meals Served" 
            value={todayAttendance} 
            color="bg-emerald-500"
            onClick={() => navigate('/owner/attendance')} 
          />
        </div>

        {/* Quick Actions */}
        <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl p-6 text-white shadow-lg shadow-primary-500/30">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-bold">Mark Attendance</h3>
              <p className="text-primary-100 text-sm opacity-90">Track today's meals now</p>
            </div>
            <div className="bg-white/20 p-2 rounded-lg">
              <ClipboardIcon className="text-white" />
            </div>
          </div>
          <button 
            onClick={() => navigate('/owner/attendance')}
            className="w-full bg-white text-primary-700 py-3 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
          >
            <span>Start Tracking</span>
            <ArrowRight size={16} />
          </button>
        </div>

        {/* Recent Activity / Rate Info */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 flex items-center justify-between">
           <div>
             <p className="text-xs text-gray-400 font-medium uppercase">Current Rate</p>
             <p className="text-xl font-bold text-slate-850 mt-1">₹{mess.perMealRate}<span className="text-sm font-normal text-gray-400">/meal</span></p>
           </div>
           <button onClick={() => navigate('/owner/billing')} className="text-primary-600 font-medium text-sm">View Report</button>
        </div>

      </div>
    </Layout>
  );
};

const ClipboardIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>
);

export default OwnerDashboard;