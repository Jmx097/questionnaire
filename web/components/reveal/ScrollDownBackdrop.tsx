import React from 'react';
export function ScrollDownBackdrop(){
  return (<div aria-hidden className="pointer-events-none fixed inset-0 -z-10 grid place-items-center">
    <div className="select-none text-5xl md:text-8xl font-black tracking-tighter text-white/5">scroll down</div>
  </div>);
}
