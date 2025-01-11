import React, { useState, useEffect, useRef } from 'react';
import { Lock, Unlock, CheckCircle, Timer } from 'lucide-react';
import { AdCardProps } from '../types';

export function AdCard({ id, isUnlocked, title, adScript, onUnlock }: AdCardProps) {
  const [isViewing, setIsViewing] = useState(false);
  const [timeLeft, setTimeLeft] = useState(3);
  const [hasVisitedAd, setHasVisitedAd] = useState(false);
  const adContainerRef = useRef<HTMLDivElement>(null);

  // Handle visibility change
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // User left the page
        setHasVisitedAd(true);
      } else if (hasVisitedAd && !isUnlocked) {
        // User returned and ad isn't unlocked yet
        setIsViewing(true);
        setTimeLeft(3);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [hasVisitedAd, isUnlocked]);

  // Timer effect
  useEffect(() => {
    let timer: number;
    if (isViewing && !isUnlocked && timeLeft > 0) {
      timer = window.setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }

    if (timeLeft === 0 && !isUnlocked) {
      onUnlock(id);
      setIsViewing(false);
      setTimeLeft(3);
      setHasVisitedAd(false);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isViewing, timeLeft, isUnlocked, id, onUnlock]);

  // Ad injection effect
  useEffect(() => {
    if (adContainerRef.current) {
      adContainerRef.current.innerHTML = '';
      const script = document.createElement('script');
      script.textContent = adScript;
      adContainerRef.current.appendChild(script);
    }
  }, [adScript]);

  const handleClick = () => {
    if (!isUnlocked && !hasVisitedAd) {
      // Reset states when clicking a new ad
      setIsViewing(false);
      setTimeLeft(3);
      setHasVisitedAd(false);
      
      // Create a clickable area that opens in a new tab
      const a = document.createElement('a');
      a.href = 'https://example.com'; // Replace with actual ad URL
      a.target = '_blank';
      a.click();
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
        ) : hasVisitedAd ? (
          "Welcome back! Wait for timer..."
        ) : (
          "Click to visit ad"
        )}
      </div>
    </div>
  );
}
