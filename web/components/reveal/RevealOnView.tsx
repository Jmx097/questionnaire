'use client';
import React,{useEffect,useRef,useState} from 'react';
export function RevealOnView({children,once=true,threshold=0.15,className='',from='translate-y-4 opacity-0',to='translate-y-0 opacity-100',duration='duration-700'}:React.PropsWithChildren<{once?:boolean;threshold?:number;className?:string;from?:string;to?:string;duration?:string}>){
  const ref=useRef<HTMLDivElement>(null); const [visible,setVisible]=useState(false);
  useEffect(()=>{ const el=ref.current; if(!el) return; const io=new IntersectionObserver((entries)=>{entries.forEach(e=>{ if(e.isIntersecting){ setVisible(true); if(once) io.disconnect(); } else if(!once){ setVisible(false);} });},{threshold}); io.observe(el); return ()=>io.disconnect(); },[once,threshold]);
  return (<div ref={ref} className={['transition-all ease-out will-change-transform',duration,visible?to:from,className].join(' ')}>{children}</div>);
}
