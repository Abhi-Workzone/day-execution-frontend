import React, { useEffect, useState } from 'react';

const SplashScreen = ({ onComplete }) => {
  const [fade, setFade] = useState('opacity-100');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Progress animation from 0 to 100 over ~2.5 seconds
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, 40);

    const timer = setTimeout(() => {
      setFade('opacity-0');
      setTimeout(onComplete, 500); // Wait for fade animation
    }, 2500);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [onComplete]);

  return (
    <div className={`fixed inset-0 bg-slate-900 z-[1000] flex flex-col items-center justify-center transition-opacity duration-500 ${fade}`}>
      <div className="relative">
        <div className="w-24 h-24 bg-primary-500 rounded-3xl rotate-12 animate-pulse flex items-center justify-center shadow-2xl shadow-primary-500/20">
          <div className="w-12 h-12 bg-white rounded-xl -rotate-12 flex items-center justify-center text-primary-600 font-black text-2xl">
            DE
          </div>
        </div>
        <div className="absolute -inset-4 bg-primary-500/20 blur-2xl rounded-full animate-pulse"></div>
      </div>
      
      <div className="mt-8 text-center space-y-2">
        <h1 className="text-3xl font-black text-white tracking-tighter">
          DAY <span className="text-primary-400">EXECUTION</span>
        </h1>
        <p className="text-slate-400 text-sm font-medium tracking-widest uppercase">Planning First System</p>
      </div>

      {/* Progress Section */}
      <div className="absolute bottom-20 w-64 space-y-3 text-center">
        <div className="flex justify-between text-xs font-bold text-primary-400 uppercase tracking-widest">
          <span>Initializing</span>
          <span>{progress}%</span>
        </div>
        <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary-500 transition-all duration-75 ease-out shadow-[0_0_10px_rgba(var(--color-primary-500),0.5)]"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
