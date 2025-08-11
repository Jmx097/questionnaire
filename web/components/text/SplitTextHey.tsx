'use client';
import React,{forwardRef,useEffect,useImperativeHandle,useMemo,useRef} from 'react';
import { gsap } from 'gsap';
export type SplitTextControls={playIn:()=>void; reverseOut:(onComplete?:()=>void)=>void;};
export const SplitTextHey=forwardRef<SplitTextControls,{text?:string;fontClassName?:string;stagger?:number;yFrom?:number;duration?:number}>(
({text='Hey!',fontClassName='text-5xl md:text-7xl font-semibold',stagger=0.035,yFrom=24,duration=0.6},ref)=>{
  const containerRef=useRef<HTMLDivElement>(null);
  const charsRef=useRef<HTMLSpanElement[]>([]);
  const tlRef=useRef<gsap.core.Timeline|null>(null);
  const chars=useMemo(()=>Array.from(text),[text]);
  useImperativeHandle(ref,()=>({playIn:()=>{ if(!containerRef.current)return; if(tlRef.current)tlRef.current.kill(); const tl=gsap.timeline({paused:true}); tl.set(containerRef.current,{opacity:1}); tl.from(charsRef.current,{opacity:0,y:yFrom,ease:'power3.out',duration,stagger}); tlRef.current=tl; tl.play(0); }, reverseOut:(onComplete)=>{ if(tlRef.current){ tlRef.current.eventCallback('onReverseComplete', onComplete || null); tlRef.current.reverse(); } else { if(onComplete) onComplete(); } }}));
  useEffect(()=>{ if(containerRef.current) (gsap as any).set(containerRef.current,{opacity:0}); },[]);
  return (<div className="pointer-events-none select-none" aria-hidden><div ref={containerRef} className={`${fontClassName} tracking-tight text-center`} style={{willChange:'opacity, transform'}}>{chars.map((c,i)=>(<span key={i} ref={(el)=>{ if(el) charsRef.current[i]=el; }} className="inline-block" style={{whiteSpace:'pre'}}>{c}</span>))}</div></div>);
});
SplitTextHey.displayName='SplitTextHey';
