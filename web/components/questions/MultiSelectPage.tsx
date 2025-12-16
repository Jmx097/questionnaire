'use client';
import React, { useState } from 'react';
import { ScrollDownBackdrop } from '@/components/reveal/ScrollDownBackdrop';
import { RevealOnView } from '@/components/reveal/RevealOnView';
import { cn } from '@/lib/utils';

export type MultiSelectOption = { key: string; label: string };

interface MultiSelectPageProps {
  title: string;
  note?: string;
  options: MultiSelectOption[];
  onContinue: (selected: string[]) => void;
  minSelections?: number;
  maxSelections?: number;
}

export function MultiSelectPage({
  title,
  note,
  options,
  onContinue,
  minSelections = 1,
  maxSelections = 999,
}: MultiSelectPageProps) {
  const [selected, setSelected] = useState<string[]>([]);

  const toggleSelection = (key: string) => {
    if (selected.includes(key)) {
      setSelected(selected.filter((k) => k !== key));
    } else if (selected.length < maxSelections) {
      setSelected([...selected, key]);
    }
  };

  const canContinue = selected.length >= minSelections;

  return (
    <main className="relative min-h-screen w-full bg-black text-white flex flex-col items-center justify-center">
      <ScrollDownBackdrop />
      <section className="w-full max-w-4xl px-6 py-8">
        <RevealOnView>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight text-center mb-4">{title}</h1>
          {note && <p className="text-white/70 text-center text-lg md:text-xl max-w-2xl mx-auto">{note}</p>}
        </RevealOnView>
      </section>
      <section className="w-full max-w-6xl px-6 pb-12">
        <RevealOnView
          from="translate-y-4 opacity-0"
          to="translate-y-0 opacity-100"
          duration="duration-300"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {options.map((option) => {
              const isSelected = selected.includes(option.key);
              return (
                <button
                  key={option.key}
                  onClick={() => toggleSelection(option.key)}
                  className={cn(
                    'relative px-6 py-4 rounded-2xl border-2 transition-all duration-200',
                    'hover:scale-105 hover:shadow-xl',
                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50',
                    isSelected
                      ? 'bg-white/10 border-white text-white shadow-lg shadow-white/20'
                      : 'bg-white/5 border-white/20 text-white/80 hover:border-white/40'
                  )}
                >
                  <span className="font-medium">{option.label}</span>
                  {isSelected && (
                    <span className="absolute top-2 right-2 text-lg">✓</span>
                  )}
                </button>
              );
            })}
          </div>
          <div className="mt-8 flex justify-center">
            <button
              onClick={() => canContinue && onContinue(selected)}
              disabled={!canContinue}
              className={cn(
                'px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200',
                canContinue
                  ? 'bg-white text-black hover:scale-105 hover:shadow-xl shadow-white/20'
                  : 'bg-white/20 text-white/40 cursor-not-allowed'
              )}
            >
              {selected.length > 0
                ? `Continue (${selected.length} selected)`
                : 'Continue'}
            </button>
          </div>
        </RevealOnView>
      </section>
    </main>
  );
}
