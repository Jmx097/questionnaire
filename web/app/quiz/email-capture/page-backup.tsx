'use client';
import React from 'react';

export default function EmailCapture() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="max-w-2xl w-full text-center">
        <h1 className="text-3xl font-semibold mb-8">Test Email Capture</h1>
        <p className="text-white/70 mb-8">
          This is a simplified test to verify navigation is working.
        </p>
        <div className="bg-white/10 rounded-xl p-6">
          <p>If you can see this, the routing is working! 🎉</p>
          <p className="text-white/60 text-sm mt-2">
            Next step: Test going back to quiz and forward to results
          </p>
        </div>
      </div>
    </div>
  );
}