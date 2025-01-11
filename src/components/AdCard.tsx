import React, { useState, useEffect, useRef } from 'react';
import { Lock, Unlock, CheckCircle, Timer } from 'lucide-react';
import { AdCardProps } from '../types';

export function AdCard({ id, isUnlocked, title, adScript, onUnlock }: AdCardProps) {
  const [isViewing, setIsViewing] = useState(false); // Changed to false by default
  const [timeLeft, setTimeLeft] = useState(3);
  const adContainerRef = useRef<HTMLDivElement>(null);

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
      setTimeLeft(3); // Reset timer for next attempt
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isViewing, timeLeft, isUnlocked, id, onUnlock]);

  // Ad injection effect
  useEffect(() => {
    if (adContainerRef.current) {
      // Clear any existing content
      adContainerRef.current.innerHTML = '';
      
      // Create and inject the ad script
      const script = document.createElement('script');
      script.textContent = adScript;
      adContainerRef.current.appendChild(script);
    }
  }, [adScript]);

  const handleClick = () => {
    if (!isUnlocked) {
      setIsViewing(true);
      setTimeLeft(3);
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
          "Click to watch ad"
        )}
      </div>
    </div>
  );
}
