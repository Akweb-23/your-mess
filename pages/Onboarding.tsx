import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { ClipboardCheck, IndianRupee, Users, ArrowRight, Smartphone } from 'lucide-react';

const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      id: 1,
      icon: ClipboardCheck,
      title: "Smart Attendance",
      description: "Owners mark meals in seconds. Students see their daily status instantly. Complete transparency for everyone.",
      color: "text-blue-600",
      bg: "bg-blue-50"
    },
    {
      id: 2,
      icon: IndianRupee,
      title: "Transparent Billing",
      description: "No more calculation disputes. Automated monthly bills that both owners and students can trust.",
      color: "text-emerald-600",
      bg: "bg-emerald-50"
    },
    {
      id: 3,
      icon: Smartphone,
      title: "Mess in Your Pocket",
      description: "Whether you run a mess or eat in one, manage everything from your phone. Simple, fast, and organized.",
      color: "text-purple-600",
      bg: "bg-purple-50"
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(curr => curr + 1);
    } else {
      finishOnboarding();
    }
  };

  const finishOnboarding = () => {
    localStorage.setItem('messmate_onboarding_seen', 'true');
    // Navigate to Role Selection (Welcome) instead of Login directly
    navigate('/welcome');
  };

  const CurrentIcon = steps[currentStep].icon;

  return (
    <div className="min-h-screen bg-white flex flex-col max-w-md mx-auto relative">
      {/* Skip Button */}
      <div className="absolute top-4 right-4 z-10">
        <button 
          onClick={finishOnboarding}
          className="text-gray-400 text-sm font-medium px-4 py-2 hover:text-primary-600 transition-colors"
        >
          Skip
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center pt-20">
        
        {/* Animated Image/Icon Area */}
        <div className={`w-48 h-48 ${steps[currentStep].bg} rounded-full flex items-center justify-center mb-10 transition-colors duration-500 ease-in-out shadow-inner`}>
          <CurrentIcon size={80} className={`${steps[currentStep].color} transition-colors duration-500`} strokeWidth={1.5} />
        </div>

        {/* Text Content */}
        <div className="space-y-4 max-w-xs mx-auto animate-in slide-in-from-bottom-4 fade-in duration-500" key={currentStep}>
          <h2 className="text-3xl font-bold text-slate-850 leading-tight">
            {steps[currentStep].title}
          </h2>
          <p className="text-gray-500 leading-relaxed text-lg">
            {steps[currentStep].description}
          </p>
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="p-8 pb-12">
        {/* Dots Indicator */}
        <div className="flex justify-center space-x-2 mb-8">
          {steps.map((_, index) => (
            <div 
              key={index}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentStep ? 'w-8 bg-primary-600' : 'w-2 bg-gray-200'
              }`}
            />
          ))}
        </div>

        {/* Action Button */}
        <Button 
          onClick={handleNext} 
          fullWidth 
          className="flex items-center justify-center space-x-2 py-4 text-lg shadow-xl shadow-primary-500/20"
        >
          <span>{currentStep === steps.length - 1 ? "Get Started" : "Next"}</span>
          <ArrowRight size={20} />
        </Button>
      </div>
    </div>
  );
};

export default Onboarding;