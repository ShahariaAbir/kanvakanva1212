import React, { useState, useEffect, useRef } from 'react';
import { Lock, Unlock, CheckCircle, Timer, XCircle } from 'lucide-react';
import { AdCardProps } from '../types';

// Add cache expiration check
const checkAndClearExpiredCache = () => {
  const lastRefreshTime = sessionStorage.getItem('lastRefreshTime');
  const currentTime = Date.now();

  if (lastRefreshTime) {
    const timeDiff = currentTime - parseInt(lastRefreshTime);
    if (timeDiff > 20000) { // 20 seconds
      sessionStorage.clear(); // Clear all session storage data
    }
  }
  
  sessionStorage.setItem('lastRefreshTime', currentTime.toString());
};

export function AdCard({ id, name, isUnlocked, title, adScript, onUnlock }: AdCardProps) {
  const [isViewing, setIsViewing] = useState(false);
  const [timeLeft, setTimeLeft] = useState(3);
  const [error, setError] = useState<string | null>(null);
  const adContainerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<number | null>(null);

  // Check cache expiration on component mount
  useEffect(() => {
    checkAndClearExpiredCache();
  }, []);

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
      const adStartTime = sessionStorage.getItem('adStartTime');
      
      if (!document.hidden && storedAdName === name && !isUnlocked) {
        // Check if enough time has passed (5-6 seconds)
        if (adStartTime) {
          const timeSpent = Date.now() - parseInt(adStartTime);
          if (timeSpent >= 5000) { // 5 seconds minimum
            setIsViewing(true);
            startTimer();
          } else {
            setError('Please view the ad for at least 5 seconds');
            sessionStorage.removeItem('currentAd');
            sessionStorage.removeItem('adStartTime');
          }
        }
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
          setError(null);
          sessionStorage.removeItem('currentAd');
          sessionStorage.removeItem('adStartTime');
          return 3;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleClick = () => {
    if (!isUnlocked && !isViewing) {
      setError(null);
      sessionStorage.setItem('currentAd', name);
      sessionStorage.setItem('adStartTime', Date.now().toString());
      window.open('https://sentimental-glad.com/b/3AV.0YPN3upUvHbJmoVUJ/Z/DQ0J2DMZDXA/5/OdDGEl2xLUT/YXwkMGDTks4tMQT/cD', '_blank')?.focus();
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

      <div className="mt-4 text-sm">
        {error ? (
          <div className="flex items-center space-x-2 text-red-400">
            <XCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        ) : (
          <span className="text-white/80">
            {isUnlocked ? (
              "Ad completed"
            ) : isViewing ? (
              "Completing ad..."
            ) : (
              "Click to visit ad"
            )}
          </span>
        )}
      </div>
    </div>
  );
}
