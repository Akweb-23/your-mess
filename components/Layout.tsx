import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { UserRole } from '../types';
import { Home, Users, ClipboardCheck, DollarSign, UserCircle2 } from 'lucide-react';
import { mockAuth } from '../services/mockDb';

interface LayoutProps {
  children: React.ReactNode;
  role: UserRole;
}

const Layout: React.FC<LayoutProps> = ({ children, role }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const NavItem = ({ to, icon: Icon, label }: { to: string; icon: any; label: string }) => (
    <button
      onClick={() => navigate(to)}
      className={`flex flex-col items-center justify-center w-full py-3 space-y-1 ${
        isActive(to) ? 'text-primary-600' : 'text-gray-400 hover:text-gray-600'
      }`}
    >
      <Icon size={24} strokeWidth={isActive(to) ? 2.5 : 2} />
      <span className="text-[10px] font-medium">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col max-w-md mx-auto shadow-2xl overflow-hidden relative border-x border-gray-200">
      {/* Top Header */}
      <header className="bg-white border-b border-gray-100 px-4 py-3 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">M</span>
          </div>
          <h1 className="text-lg font-bold text-slate-850">MessMate</h1>
        </div>
        <button onClick={() => navigate('/profile')} className="text-gray-400 hover:text-primary-600 transition-colors">
          <UserCircle2 size={26} />
        </button>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto pb-20 no-scrollbar">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="bg-white border-t border-gray-100 fixed bottom-0 w-full max-w-md flex justify-around pb-safe z-20">
        {role === UserRole.OWNER ? (
          <>
            <NavItem to="/owner/dashboard" icon={Home} label="Home" />
            <NavItem to="/owner/attendance" icon={ClipboardCheck} label="Attend" />
            <NavItem to="/owner/students" icon={Users} label="Students" />
            <NavItem to="/owner/billing" icon={DollarSign} label="Billing" />
          </>
        ) : (
          <>
            <NavItem to="/student/dashboard" icon={Home} label="Home" />
            <NavItem to="/student/billing" icon={DollarSign} label="History" />
          </>
        )}
      </nav>
    </div>
  );
};

export default Layout;