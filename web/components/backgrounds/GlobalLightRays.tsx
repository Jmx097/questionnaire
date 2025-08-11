'use client';
import React, { useEffect, useRef } from 'react';

/**
 * Lightweight ReactBits-style Light Rays background.
 * Fixed, pointer-events-none, sits behind all content.
 */
export default function GlobalLightRays({
  speedMs = 16000,
  intensity = 0.10,
  color = '255,255,255',
}: { speedMs?: number; intensity?: number; color?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    ref.current.style.setProperty('--ray-rot-speed', `${speedMs}ms`);
    ref.current.style.setProperty('--ray-alpha', `${intensity}`);
    ref.current.style.setProperty('--ray-color', color);
  }, [speedMs, intensity, color]);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {/* soft radial glow */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(1200px 1200px at 50% 60%, rgba(255,255,255,0.08), rgba(0,0,0,0) 70%)',
          filter: 'blur(2px)',
        }}
      />
      {/* primary rays */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'repeating-conic-gradient(from 0deg, rgba(var(--ray-color), var(--ray-alpha)) 0deg 8deg, rgba(0,0,0,0) 8deg 22deg)',
          filter: 'blur(6px)',
          animation: 'rb-rays-rotate var(--ray-rot-speed) linear infinite',
          transformOrigin: '50% 60%',
          opacity: 0.85,
        }}
      />
      {/* counter-rotating faint rays */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'repeating-conic-gradient(from 12deg, rgba(var(--ray-color), calc(var(--ray-alpha)*0.7)) 0deg 6deg, rgba(0,0,0,0) 6deg 20deg)',
          filter: 'blur(10px)',
          animation: 'rb-rays-rotate-rev calc(var(--ray-rot-speed)*1.6) linear infinite',
          transformOrigin: '50% 50%',
          opacity: 0.6,
        }}
      />
      <style jsx global>{`
        @keyframes rb-rays-rotate { to { transform: rotate(360deg); } }
        @keyframes rb-rays-rotate-rev { to { transform: rotate(-360deg); } }
      `}</style>
    </div>
  );
}
