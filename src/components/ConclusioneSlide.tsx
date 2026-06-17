/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Target, Sparkles, Award, ArrowUpRight, Plane, Building, Code } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface FuturePath {
  id: string;
  title: string;
  icon: React.ReactNode;
  timeline: string;
  desc: string;
  vision: string;
}

export const ConclusioneSlide: React.FC = () => {
  const [selectedPath, setSelectedPath] = useState<string>('viaggio');

  const futurePaths: FuturePath[] = [
    {
      id: 'viaggio',
      title: 'Viaggio e lavoro all\'estero',
      icon: <Plane className="w-4 h-4" />,
      timeline: 'Ottobre 2026/2027',
      desc: 'Partire per un anno in Australia con un Working Holiday Visa, lavorando nel settore informatico, seguito da altre destinazioni. Continuerò a portare avanti i miei progetti personali anche durante il viaggio.',
      vision: 'Unire esperienza lavorativa internazionale e crescita personale, senza interrompere lo sviluppo dei miei progetti.'
    },
    {
      id: 'imprenditoria',
      title: 'Imprenditoria',
      icon: <Building className="w-4 h-4" />,
      timeline: 'Sguardo al Futuro',
      desc: 'Ho già iniziato a sviluppare videogiochi in autonomia da tempo: l\'obiettivo ora è dedicarmi a questo progetto con più costanza, fino a trasformarlo in una vera attività imprenditoriale.',
      vision: 'Far crescere un progetto personale già avviato in uno studio indipendente stabile.'
    }
  ];

  const activePath = futurePaths.find(p => p.id === selectedPath) || futurePaths[1];

  return (
    <div className="relative w-full flex-1 flex flex-col justify-between overflow-hidden p-5 md:p-8 pt-4 md:pt-6 font-sans bg-transparent text-zinc-100 select-none">
      
      {/* Editorial Decorative Grid Details */}
      <div className="flex justify-between items-center text-sm tracking-[0.2em] uppercase text-zinc-500 border-b border-white/5 pb-2 mb-4 md:mb-6">
        <div className="text-[#C5A059] font-bold tracking-widest flex items-center gap-1.5 bg-[#C5A059]/10 px-3 py-1.5 rounded border border-[#C5A059]/20 text-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]" />
          <span>// Sguardo al Futuro</span>
        </div>
      </div>
      
      <div className="flex-1 my-auto lg:grid lg:grid-cols-12 gap-8 items-stretch relative z-10 w-full py-4">
        
        {/* Left column (7 cols): The Quote */}
        <div className="lg:col-span-7 flex flex-col justify-center items-start space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#C5A059]/10 border border-[#C5A059]/20 rounded-full text-xs uppercase tracking-widest text-[#C5A059] font-bold">
            <span>La Visione di Impatto</span>
          </div>

          <div className="relative pr-6">
            {/* Massive gold stylized quote mark */}
            <span className="absolute -top-12 -left-6 font-serif text-[110px] text-[#C5A059]/10 leading-none select-none">“</span>
            
            <h2 className="font-serif text-[22px] sm:text-[26px] lg:text-[30px] leading-[1.3] text-stone-100 font-normal tracking-tight antialiased">
              "Lavorare con tecnologie così avanzate mi ha fatto capire quanto siano vicine al mondo dei videogiochi. Questo mi ha dato ancora più voglia di <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C5A059] to-amber-200 font-bold">costruire qualcosa di mio</span> in questo campo."
            </h2>
          </div>

          <div className="text-sm text-zinc-400 uppercase tracking-widest pl-3 border-l-2 border-[#C5A059] relative z-10 font-bold">
            Davide Ghezzi
          </div>
        </div>

        {/* Right column (5 cols): Sguardo al Futuro picker */}
        <div className="lg:col-span-5 bg-white/[0.01] border border-white/5 p-6 rounded-2xl shadow-2xl relative mt-6 lg:mt-0 flex flex-col justify-start h-full">
          <span className="text-xs text-[#C5A059] block uppercase tracking-wider mb-4 font-semibold">
            // Sguardo al Futuro
          </span>

          {/* Selector pills list */}
          <div className="flex justify-between gap-1.5 p-1 bg-zinc-950/80 rounded-xl border border-white/5 mb-5 shrink-0">
            {futurePaths.map((path) => {
              const isActive = selectedPath === path.id;
              return (
                <button
                  key={path.id}
                  onClick={() => setSelectedPath(path.id)}
                  className={`flex-1 text-center py-2 text-xs font-bold uppercase rounded-lg transition-all flex flex-col sm:flex-row items-center justify-center gap-2 px-2 ${
                    isActive
                      ? 'bg-[#C5A059] text-zinc-950 font-extrabold shadow-lg animate-fade-in'
                      : 'text-zinc-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span className="shrink-0">{path.icon}</span>
                  <span className="truncate">{path.title.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={selectedPath}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.2 }}
              className="space-y-4 text-sm font-sans flex-grow flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-center gap-2">
                  <h3 className="text-base font-bold text-white font-serif">{activePath.title}</h3>
                  <span className="text-xs text-[#C5A059] border border-[#C5A059]/20 bg-[#C5A059]/5 px-2.5 py-1 rounded shrink-0 font-bold">
                    {activePath.timeline}
                  </span>
                </div>

                <p className="text-zinc-300 font-light leading-relaxed text-sm">{activePath.desc}</p>
              </div>
              
              <div className="border-t border-white/5 pt-3.5 mt-auto">
                <span className="text-[#C5A059] text-xs block font-bold uppercase tracking-wider">// OBIETTIVO CHIAVE:</span>
                <p className="text-sm text-zinc-350 font-light leading-relaxed mt-1 flex gap-2 items-start">
                  <span className="text-[#C5A059] text-sm leading-none">•</span>
                  <span>{activePath.vision}</span>
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
