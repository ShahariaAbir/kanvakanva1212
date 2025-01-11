import React from 'react';
import { Lock, Unlock } from 'lucide-react';
import { FinalButtonProps } from '../types';

export function FinalButton({ isUnlocked, onClick }: FinalButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={!isUnlocked}
      className={`
        relative overflow-hidden group px-8 py-4 rounded-full 
        transition-all duration-300 transform
        ${isUnlocked 
          ? 'bg-gradient-to-r from-purple-500 to-blue-500 hover:scale-105 hover:shadow-xl' 
          : 'bg-gray-700 cursor-not-allowed'
        }
      `}
    >
      <div className="flex items-center space-x-2">
        {isUnlocked ? (
          <Unlock className="w-5 h-5 text-white" />
        ) : (
          <Lock className="w-5 h-5 text-white" />
        )}
        <span className="text-white font-medium">
          {isUnlocked ? "Continue to Site" : "Complete all ads to unlock"}
        </span>
      </div>
      
      {isUnlocked && (
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      )}
    </button>
  );
}