import React, { useState, useEffect, useRef } from 'react';
import { Lock, Unlock, CheckCircle, Timer } from 'lucide-react';
import { AdCardProps } from '../types';

export function AdCard({ id, name, isUnlocked, title, adScript, onUnlock }: AdCardProps) {
  const [isViewing, setIsViewing] = useState(false);
  const [timeLeft, setTimeLeft] = useState(3);
  const adContainerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<number | null>(null);

  // Inject ad script when component mounts
  useEffect(() => {
    if (adContainerRef.current && !isUnlocked) {
      // Create a new script element
      const scriptElement = document.createElement('script');
      scriptElement.innerHTML = adScript;
      
      // Clear any existing content
      adContainerRef.current.innerHTML = '';
      
      // Append the script
      adContainerRef.current.appendChild(scriptElement);
    }
  }, [adScript, isUnlocked]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Handle visibility change
  useEffect(() => {
    const handleVisibilityChange = () => {
      const storedAdName = sessionStorage.getItem('currentAd');
      
      if (!document.hidden && storedAdName === name && !isUnlocked) {
        setIsViewing(true);
        startTimer();
      } else if (document.hidden && storedAdName === name) {
        // Clear timer when tab is hidden
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
        setIsViewing(false);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [name, isUnlocked]);

  const startTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    setTimeLeft(3);
    timerRef.current = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) {
            clearInterval(timerRef.current);
          }
          onUnlock(id);
          setIsViewing(false);
          sessionStorage.removeItem('currentAd');
          return 3;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleClick = () => {
    if (!isUnlocked && !isViewing) {
      sessionStorage.setItem('currentAd', name);
      // Start the timer immediately when clicked
      setIsViewing(true);
      startTimer();
      // Open in new tab
      window.open('https://example.com', '_blank')?.focus();
    }
  };

  return (
    <div 
      className="relative overflow-hidden rounded-xl backdrop-blur-md bg-white/10 p-6 shadow-xl border border-white/20 transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] cursor-pointer"
      onClick={handleClick}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-white">{title}</h3>
        <div className="text-white">
          {isUnlocked ? (
            <CheckCircle className="w-6 h-6 text-green-400" />
          ) : (
            <Lock className="w-6 h-6" />
          )}
        </div>
      </div>

      <div className="aspect-video bg-white/5 rounded-lg flex items-center justify-center">
        <div className="relative w-full h-full">
          <div ref={adContainerRef} className="absolute inset-0" />
          {!isUnlocked && isViewing && (
            <div className="absolute inset-0 flex flex-col items-center justify-center space-y-2 bg-black/50">
              <Timer className="w-8 h-8 text-white animate-pulse" />
              <p className="text-white">Wait {timeLeft}s...</p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 text-sm text-white/80">
        {isUnlocked ? (
          "Ad completed"
        ) : isViewing ? (
          "Watching ad..."
        ) : (
          "Click to visit ad"
        )}
      </div>
    </div>
  );
}
