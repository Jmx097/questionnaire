'use client';

import React, { useEffect, useRef } from 'react';

export default function GlobalLightRays({
  speedMs = 32000,               // slower than before
  intensity = 0.065,             // softer default
  color = '255,255,255',         // white rays; tweak for hue
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
      style={{
        // Fade the effect toward the lower half; show strongest light up top.
        WebkitMaskImage:
          'radial-gradient(120% 120% at 50% -20%, rgba(255,255,255,1) 35%, rgba(255,255,255,0) 70%)',
        maskImage:
          'radial-gradient(120% 120% at 50% -20%, rgba(255,255,255,1) 35%, rgba(255,255,255,0) 70%)',
      }}
    >
      {/* soft overhead glow */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(80% 55% at 50% -20%, rgba(255,255,255,0.08), rgba(255,255,255,0) 60%)',
          filter: 'blur(8px)',
        }}
      />

      {/* primary rays (thin spokes, big gaps) */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'repeating-conic-gradient(from -15deg, rgba(var(--ray-color), var(--ray-alpha)) 0deg 2deg, rgba(0,0,0,0) 2deg 18deg)',
          filter: 'blur(8px)',
          animation: 'rb-rays-rotate var(--ray-rot-speed) linear infinite',
          // anchor above the viewport so rays feel top-down
          transformOrigin: '50% -20%',
          opacity: 0.45,
        }}
      />

      {/* counter-rotating faint rays */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'repeating-conic-gradient(from -8deg, rgba(var(--ray-color), calc(var(--ray-alpha)*0.5)) 0deg 1.25deg, rgba(0,0,0,0) 1.25deg 20deg)',
          filter: 'blur(10px)',
          animation: 'rb-rays-rotate-rev calc(var(--ray-rot-speed)*1.8) linear infinite',
          transformOrigin: '50% -20%',
          opacity: 0.30,
        }}
      />

      {/* ultra-subtle noise to kill banding */}
      <div
        className="absolute inset-0"
        style={{
          opacity: 0.03,
          mixBlendMode: 'soft-light',
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,\
<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'>\
<filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.65' numOctaves='3' stitchTiles='stitch'/></filter>\
<rect width='100%' height='100%' filter='url(%23n)' opacity='.5'/></svg>\")",
        }}
      />

      <style jsx global>{`
        @keyframes rb-rays-rotate { to { transform: rotate(360deg); } }
        @keyframes rb-rays-rotate-rev { to { transform: rotate(-360deg); } }
      `}</style>
    </div>
  );
}
