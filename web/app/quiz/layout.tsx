'use client';
import { ProgressIndicator } from '@/components/ui/ProgressIndicator';
import { usePathname } from 'next/navigation';

export default function QuizLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Extract step number from pathname
  const stepMatch = pathname?.match(/\/quiz\/(\d+(?:\.\d+)?)/);
  const currentStep = stepMatch ? parseFloat(stepMatch[1]) : 0;
  
  // Don't show progress on start or result pages
  const shouldShowProgress = currentStep > 0 && pathname !== '/quiz/result';
  const displayStep = Math.ceil(currentStep); // Convert 3.5 to 4 for display
  
  return (
    <>
      {shouldShowProgress && <ProgressIndicator currentStep={displayStep} totalSteps={7} />}
      {children}
    </>
  );
}
