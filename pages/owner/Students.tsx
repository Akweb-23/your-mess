import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import { UserRole, Mess, Student } from '../../types';
import { mockAuth, messService } from '../../services/mockDb';
import { Button } from '../../components/ui/Button';
import { Plus, User as UserIcon, Phone } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const StudentsPage: React.FC = () => {
  const [mess, setMess] = useState<Mess>();
  const [students, setStudents] = useState<Student[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const { showToast } = useToast();
  
  // Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    loadData();
  }, [isAdding]); // Reload when adding mode changes (e.g. after add)

  const loadData = () => {
    try {
      const user = mockAuth.getCurrentUser();
      if (user && user.role === UserRole.OWNER) {
        const myMess = messService.getMess(user.id);
        setMess(myMess);
        if (myMess) {
          setStudents(messService.getStudents(myMess.id));
        } else {
          showToast('Could not load mess details.', 'error');
        }
      }
    } catch (e) {
      showToast('Failed to load students.', 'error');
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mess) return;
    
    if (phone.length < 10) {
      showToast('Phone number must be at least 10 digits', 'error');
      return;
    }

    try {
      await messService.addStudent(mess.id, name, phone);
      showToast('Student added successfully', 'success');
      setIsAdding(false);
      setName('');
      setPhone('');
    } catch (error) {
      showToast('Failed to add student. Please try again.', 'error');
    }
  };

  if (isAdding) {
    return (
      <Layout role={UserRole.OWNER}>
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6 text-slate-850">Add New Student</h2>
            <form onSubmit={handleAdd} className="space-y-6">
                <div>
                    <label className="text-sm font-medium text-gray-700 ml-1">Full Name</label>
                    <input 
                        className="w-full mt-1 px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:outline-none"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="e.g. Amit Kumar"
                        required
                    />
                </div>
                <div>
                    <label className="text-sm font-medium text-gray-700 ml-1">Phone Number</label>
                    <input 
                        className="w-full mt-1 px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:outline-none"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        placeholder="10 digit number"
                        type="tel"
                        required
                    />
                </div>
                <div className="flex gap-4 pt-4">
                    <Button type="button" variant="secondary" fullWidth onClick={() => setIsAdding(false)}>Cancel</Button>
                    <Button type="submit" fullWidth>Save Student</Button>
                </div>
            </form>
        </div>
      </Layout>
    );
  }

  return (
    <Layout role={UserRole.OWNER}>
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-850">Students</h2>
                <button 
                    onClick={() => setIsAdding(true)}
                    className="bg-primary-600 text-white p-3 rounded-full shadow-lg shadow-primary-500/30 hover:bg-primary-700 active:scale-95 transition-all"
                >
                    <Plus size={24} />
                </button>
            </div>

            <div className="space-y-4">
                {students.map(student => (
                    <div key={student.id} className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center space-x-4 shadow-sm">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 font-bold text-lg">
                            {student.name.charAt(0)}
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-slate-850">{student.name}</h3>
                            <div className="flex items-center text-xs text-gray-400 mt-1">
                                <Phone size={12} className="mr-1" />
                                {student.phone}
                            </div>
                        </div>
                    </div>
                ))}
                {students.length === 0 && (
                  <div className="text-center py-10 text-gray-400">
                    <p>No students found.</p>
                  </div>
                )}
            </div>
        </div>
    </Layout>
  );
};

export default StudentsPage;