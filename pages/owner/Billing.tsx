import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import { UserRole, Mess, MonthlyBill } from '../../types';
import { mockAuth, messService } from '../../services/mockDb';
import { ChevronDown, Download, Calendar, TrendingUp, Utensils } from 'lucide-react';
import { format } from 'date-fns';

const BillingPage: React.FC = () => {
  const [mess, setMess] = useState<Mess>();
  const [report, setReport] = useState<MonthlyBill[]>([]);
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    const user = mockAuth.getCurrentUser();
    if (user && user.role === UserRole.OWNER) {
      const myMess = messService.getMess(user.id);
      setMess(myMess);
    }
  }, []);

  useEffect(() => {
    if (mess) {
      const data = messService.getMonthlyReport(mess.id, year, month);
      // Sort by amount descending to show top revenue sources first
      setReport(data.sort((a, b) => b.totalAmount - a.totalAmount));
    }
  }, [mess, month, year]);

  const totalRevenue = report.reduce((acc, curr) => acc + curr.totalAmount, 0);
  const totalMeals = report.reduce((acc, curr) => acc + curr.totalMeals, 0);
  const activeStudents = report.filter(r => r.totalMeals > 0).length;

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <Layout role={UserRole.OWNER}>
      <div className="flex flex-col h-full bg-gray-50/50">
        
        {/* Header Section */}
        <div className="bg-slate-850 text-white p-6 pb-8 rounded-b-[2.5rem] shadow-xl shadow-slate-200 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none"></div>

            {/* Month Selector */}
            <div className="flex justify-between items-center mb-6 relative z-10">
                <div className="relative">
                    <select 
                        value={month} 
                        onChange={(e) => setMonth(Number(e.target.value))}
                        className="appearance-none bg-white/10 border border-white/10 hover:bg-white/20 transition-colors pl-10 pr-10 py-2 rounded-full text-sm font-semibold text-white focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer"
                    >
                        {months.map((m, idx) => (
                            <option key={idx} value={idx} className="text-slate-900">{m} {year}</option>
                        ))}
                    </select>
                    <Calendar size={14} className="absolute left-3.5 top-3 text-white/70 pointer-events-none" />
                    <ChevronDown size={14} className="absolute right-3.5 top-3 text-white/70 pointer-events-none" />
                </div>
                <button className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors text-white/80" title="Export Report">
                    <Download size={20} />
                </button>
            </div>

            {/* Main Stats */}
            <div className="relative z-10">
                <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-1">Total Revenue</p>
                <div className="flex items-baseline space-x-1">
                    <span className="text-2xl font-medium text-white/80">₹</span>
                    <span className="text-5xl font-bold tracking-tight text-white">{totalRevenue.toLocaleString()}</span>
                </div>
                
                {/* Secondary Stats Grid */}
                <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="bg-white/10 rounded-2xl p-3 backdrop-blur-sm border border-white/5">
                        <div className="flex items-center space-x-2 mb-1">
                            <Utensils size={14} className="text-emerald-400" />
                            <span className="text-xs text-white/70 font-medium">Meals Served</span>
                        </div>
                        <p className="text-xl font-bold">{totalMeals}</p>
                    </div>
                    <div className="bg-white/10 rounded-2xl p-3 backdrop-blur-sm border border-white/5">
                        <div className="flex items-center space-x-2 mb-1">
                            <TrendingUp size={14} className="text-blue-400" />
                            <span className="text-xs text-white/70 font-medium">Active Students</span>
                        </div>
                        <p className="text-xl font-bold">{activeStudents}</p>
                    </div>
                </div>
            </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 px-6 -mt-4 relative z-20 pb-4 space-y-4">
            <div className="flex items-center justify-between px-1">
                <h3 className="text-slate-800 font-bold text-lg">Student Bills</h3>
                <span className="text-xs font-medium text-gray-400">{report.length} Records</span>
            </div>

            {report.map((bill, index) => (
                <div 
                    key={bill.studentId} 
                    className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between group"
                    style={{ animationDelay: `${index * 50}ms` }}
                >
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-500 font-bold text-sm border border-gray-100 group-hover:bg-primary-50 group-hover:text-primary-600 group-hover:border-primary-100 transition-colors">
                            {bill.studentName.charAt(0)}
                        </div>
                        <div>
                            <p className="font-bold text-slate-850 text-sm">{bill.studentName}</p>
                            <p className="text-xs text-gray-400 font-medium tracking-wide">{bill.studentPhone}</p>
                        </div>
                    </div>
                    
                    <div className="text-right">
                        <p className="font-bold text-lg text-slate-850">₹{bill.totalAmount.toLocaleString()}</p>
                        <p className="text-xs text-gray-400 font-medium bg-gray-50 inline-block px-2 py-0.5 rounded-md mt-0.5">
                            {bill.totalMeals} meals
                        </p>
                    </div>
                </div>
            ))}

            {report.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-center bg-white rounded-3xl border border-dashed border-gray-200 mt-4">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                        <Calendar size={24} className="text-gray-300" />
                    </div>
                    <p className="text-slate-800 font-bold">No Data Available</p>
                    <p className="text-xs text-gray-400 mt-1 max-w-[150px]">
                        No meals have been recorded for {months[month]} yet.
                    </p>
                </div>
            )}
        </div>
      </div>
    </Layout>
  );
};

export default BillingPage;