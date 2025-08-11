'use client';
import React,{useEffect,useRef} from 'react';
export function TargetCursor({size=28,idleOpacity=0.35,hoverScale=1.6}:{size?:number;idleOpacity?:number;hoverScale?:number}){
  const dot=useRef<HTMLDivElement>(null); const pos=useRef({x:0,y:0}); const target=useRef({x:0,y:0}); const raf=useRef<number|null>(null); const hover=useRef(false);
  useEffect(()=>{
    const el=dot.current!;
    const onMove=(e:MouseEvent)=>{ target.current.x=e.clientX; target.current.y=e.clientY; if(!raf.current) loop(); };
    const onOver=(e:MouseEvent)=>{ const t=e.target as HTMLElement; hover.current=!!t.closest('a,button,[role="button"],.bento-tile'); };
    window.addEventListener('mousemove', onMove, {passive:true});
    window.addEventListener('mouseover', onOver, {passive:true});
    return ()=>{ window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseover', onOver); if(raf.current) cancelAnimationFrame(raf.current); };
    function loop(){ pos.current.x += (target.current.x - pos.current.x)*0.18; pos.current.y += (target.current.y - pos.current.y)*0.18; el.style.transform=`translate(${pos.current.x - size/2}px, ${pos.current.y - size/2}px) scale(${hover.current?hoverScale:1})`; el.style.opacity = hover.current ? '0.55' : String(idleOpacity); raf.current=requestAnimationFrame(loop); }
  },[size,idleOpacity,hoverScale]);
  return (<div aria-hidden className="fixed left-0 top-0 pointer-events-none z-50 hidden sm:block" style={{width:size,height:size,borderRadius:'9999px',border:'1.5px solid rgba(255,255,255,.65)',boxShadow:'0 0 20px rgba(255,255,255,.15)',transition:'opacity .15s ease',mixBlendMode:'difference'}} ref={dot} />);
}
