import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockAuth } from '../services/mockDb';
import { UserRole } from '../types';

const Splash: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      const user = mockAuth.getCurrentUser();
      const onboardingSeen = localStorage.getItem('messmate_onboarding_seen');

      if (user) {
        // User is already logged in, go to dashboard
        if (user.role === UserRole.OWNER) {
          navigate('/owner/dashboard');
        } else {
          navigate('/student/dashboard');
        }
      } else {
        // User not logged in
        if (onboardingSeen === 'true') {
          // Send to Welcome screen to select role
          navigate('/welcome');
        } else {
          // First time user
          navigate('/onboarding');
        }
      }
    }, 2500); // 2.5 seconds splash duration

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-primary-600 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl"></div>

      <div className="relative z-10 flex flex-col items-center animate-fade-in-up">
        <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center shadow-2xl mb-6 transform transition-transform hover:scale-105 duration-500">
          <span className="text-primary-600 font-bold text-5xl">M</span>
        </div>
        <h1 className="text-4xl font-bold text-white tracking-tight mb-2">MessMate</h1>
        <p className="text-primary-100 text-sm font-medium tracking-wider uppercase opacity-80">Mess Management Simplified</p>
      </div>

      <div className="absolute bottom-10">
        <div className="w-8 h-8 border-4 border-primary-400 border-t-white rounded-full animate-spin"></div>
      </div>
    </div>
  );
};

export default Splash;