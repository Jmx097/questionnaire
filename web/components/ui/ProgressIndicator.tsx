'use client';
import React from 'react';
import { cn } from '@/lib/utils';

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  className?: string;
}

export function ProgressIndicator({ currentStep, totalSteps, className }: ProgressIndicatorProps) {
  const percentage = Math.round((currentStep / totalSteps) * 100);
  
  return (
    <div className={cn("fixed top-6 left-1/2 -translate-x-1/2 z-50", className)}>
      <div className="bg-black/60 backdrop-blur-sm border border-white/10 rounded-full px-6 py-2 shadow-xl">
        <div className="flex items-center gap-3">
          <span className="text-sm text-white/70 font-medium">
            Question {currentStep} of {totalSteps}
          </span>
          <div className="w-32 h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white rounded-full transition-all duration-500 ease-out"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <span className="text-sm text-white/70 font-medium">
            {percentage}%
          </span>
        </div>
      </div>
    </div>
  );
}
