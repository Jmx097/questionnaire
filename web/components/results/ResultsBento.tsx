'use client';
import React from 'react';
import { cn } from '@/lib/utils';
export function ResultsBento({items}:{items:{label:string;value:string}[]}){
  return (<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
    {items.map((it,i)=>(<div key={i} className={cn('rounded-2xl border border-white/10 bg-white/5 p-4')}>
      <div className="text-white/60 text-sm">{it.label}</div>
      <div className="text-white text-lg font-semibold mt-1">{it.value}</div>
    </div>))}
  </div>);
}
