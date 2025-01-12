import React, { useState, useEffect, useRef } from 'react';
import { Lock, Unlock, CheckCircle, Timer } from 'lucide-react';
import { AdCardProps } from '../types';

export function AdCard({ id, name, isUnlocked, title, adScript, onUnlock }: AdCardProps) {
  const [isViewing, setIsViewing] = useState(false);
  const [timeLeft, setTimeLeft] = useState(3);
  const adContainerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<number | null>(null);

  // Listen for messages from the ad window
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Verify the message is from our ad
      if (event.data === `ad_clicked_${name}`) {
        setIsViewing(true);
        startTimer();
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [name]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

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
      
      // Create a modified ad script that includes our message sender
      const modifiedScript = `
        ${adScript}
        // Add click event listener to the document
        document.addEventListener('click', function() {
          // Send message to parent window
          window.opener.postMessage('ad_clicked_${name}', '*');
        });
      `;
      
      // Open new window with the modified script
      const newWindow = window.open('about:blank', '_blank');
      if (newWindow) {
        newWindow.document.write(`
          <html>
            <head>
              <title>${title}</title>
            </head>
            <body>
              <script>${modifiedScript}</script>
            </body>
          </html>
        `);
        newWindow.document.close();
      }
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
