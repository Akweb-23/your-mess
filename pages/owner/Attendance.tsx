import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import { UserRole, Mess, Student } from '../../types';
import { mockAuth, messService } from '../../services/mockDb';
import { format } from 'date-fns';
import { ChevronLeft, ChevronRight, Check, X } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const AttendancePage: React.FC = () => {
  const [mess, setMess] = useState<Mess>();
  const [students, setStudents] = useState<Student[]>([]);
  const [date, setDate] = useState(new Date());
  const [attendance, setAttendance] = useState<Record<string, boolean>>({});
  const { showToast } = useToast();

  useEffect(() => {
    try {
      const user = mockAuth.getCurrentUser();
      if (user && user.role === UserRole.OWNER) {
        const myMess = messService.getMess(user.id);
        setMess(myMess);
        if (myMess) {
          setStudents(messService.getStudents(myMess.id));
          fetchAttendance(myMess.id, format(date, 'yyyy-MM-dd'));
        }
      }
    } catch (e) {
      showToast('Error loading attendance data', 'error');
    }
  }, [date]);

  const fetchAttendance = (messId: string, dateStr: string) => {
    try {
      const data = messService.getAttendance(messId, dateStr);
      setAttendance(data);
    } catch (e) {
      showToast('Failed to sync attendance', 'error');
    }
  };

  const toggleAttendance = async (studentId: string) => {
    if (!mess) return;
    const dateStr = format(date, 'yyyy-MM-dd');
    const newStatus = !attendance[studentId]; // Toggle current status
    
    // Optimistic update
    setAttendance(prev => ({ ...prev, [studentId]: newStatus }));
    
    try {
      await messService.markAttendance(mess.id, dateStr, studentId, newStatus);
    } catch (e) {
      // Revert on failure
      setAttendance(prev => ({ ...prev, [studentId]: !newStatus }));
      showToast('Failed to save attendance. Please try again.', 'error');
    }
  };

  const changeDate = (days: number) => {
    const newDate = new Date(date);
    newDate.setDate(date.getDate() + days);
    setDate(newDate);
  };

  return (
    <Layout role={UserRole.OWNER}>
      <div className="flex flex-col h-full">
        {/* Date Selector */}
        <div className="bg-white px-6 py-4 border-b border-gray-100 flex items-center justify-between sticky top-0 z-10">
          <button onClick={() => changeDate(-1)} className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
            <ChevronLeft size={20} />
          </button>
          <div className="text-center">
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Date</p>
            <p className="text-lg font-bold text-slate-850">{format(date, 'dd MMM yyyy')}</p>
          </div>
          <button onClick={() => changeDate(1)} className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Student List */}
        <div className="p-4 space-y-3">
          {students.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              <p>No students added yet.</p>
              <p className="text-sm">Go to Students tab to add.</p>
            </div>
          ) : (
            students.map(student => {
              const isPresent = attendance[student.id] === true;
              return (
                <div 
                  key={student.id} 
                  onClick={() => toggleAttendance(student.id)}
                  className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all cursor-pointer ${
                    isPresent 
                      ? 'bg-emerald-50 border-emerald-500' 
                      : 'bg-white border-gray-100 hover:border-gray-200'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                      isPresent ? 'bg-emerald-200 text-emerald-700' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {student.name.charAt(0)}
                    </div>
                    <div>
                      <p className={`font-bold ${isPresent ? 'text-emerald-900' : 'text-slate-850'}`}>
                        {student.name}
                      </p>
                      <p className={`text-xs ${isPresent ? 'text-emerald-600' : 'text-gray-400'}`}>
                        {student.phone}
                      </p>
                    </div>
                  </div>

                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                    isPresent ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-400'
                  }`}>
                    {isPresent ? <Check size={18} strokeWidth={3} /> : <X size={18} strokeWidth={3} />}
                  </div>
                </div>
              );
            })
          )}
        </div>
        
        {/* Summary Footer */}
        <div className="mt-auto p-4 bg-white border-t border-gray-200 text-center">
            <p className="text-gray-500 text-sm">
                Total Present: <strong className="text-slate-850">{Object.values(attendance).filter(Boolean).length} / {students.length}</strong>
            </p>
        </div>
      </div>
    </Layout>
  );
};

export default AttendancePage;