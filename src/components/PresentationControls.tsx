/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PresentationControlsProps {
  activeSlide: number;
  setActiveSlide: (id: number) => void;
  totalSlides: number;
  progress: number; // percentage (0 - 100)
}

export const PresentationControls: React.FC<PresentationControlsProps> = ({
  activeSlide,
  setActiveSlide,
  totalSlides,
  progress,
}) => {
  const slideTabs = [
    { short: 'Copertina', label: 'COPERTINA', slideNum: 1 },
    { short: 'UNIBZ', label: 'L\'ENTE OSPITANTE', slideNum: 2 },
    { short: 'Meta Aria', label: 'FASE 1: MAPPATURA', slideNum: 3 },
    { short: 'HoloLens 2', label: 'FASE 2: AR CANTIERE', slideNum: 4 },
    { short: 'Tech Stack', label: 'STACK TECNOLOGICO', slideNum: 5 },
    { short: 'Competenze', label: 'COMPETENZE', slideNum: 6 },
    { short: 'Riflessione', label: 'RIFLESSIONE', slideNum: 7 },
    { short: 'Scuola', label: 'COLLEGAMENTI', slideNum: 8 },
    { short: 'Conclusione', label: 'CONCLUSIONE', slideNum: 9 },
  ];

  const handlePrev = () => {
    setActiveSlide(activeSlide === 1 ? totalSlides : activeSlide - 1);
  };

  const handleNext = () => {
    setActiveSlide(activeSlide === totalSlides ? 1 : activeSlide + 1);
  };

  return (
    <div className="w-full bg-[#0F0F11]/60 backdrop-blur-xl border border-white/5 py-3 px-4 md:px-6 rounded-xl shadow-2xl select-none relative z-50 flex flex-col sm:flex-row gap-3 items-center justify-between">
      
      {/* Progress Track integrated into the top frame edge of the panel */}
      <div 
        id="progress-track"
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const clickX = e.clientX - rect.left;
          const ratio = Math.max(0, Math.min(1, clickX / rect.width));
          const targetSlide = Math.min(totalSlides, Math.max(1, Math.ceil(ratio * totalSlides)));
          setActiveSlide(targetSlide);
        }}
        className="absolute top-0 inset-x-0 h-[2px] bg-white/5 cursor-pointer group"
      >
        <div
          className="h-full bg-[#C5A059] transition-all duration-300 relative"
          style={{ width: `${progress}%` }}
        />
        <div className="absolute top-0 left-0 w-full h-full flex justify-between pointer-events-none opacity-20">
          {Array.from({ length: totalSlides }).map((_, i) => (
            <div key={i} className="w-[1px] h-full bg-black" />
          ))}
        </div>
      </div>

      {/* Left: Standard Playback State & Manual Navigation triggers */}
      <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
        <div className="flex items-center gap-1 bg-white/5 border border-white/5 p-1 rounded-lg">
          <button
            id="prev-slide-btn"
            onClick={handlePrev}
            className="w-8 h-8 hover:bg-white/5 text-zinc-400 hover:text-white rounded-md flex items-center justify-center transition-all active:scale-95"
            title="Slide Precedente"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            id="next-slide-btn"
            onClick={handleNext}
            className="w-8 h-8 hover:bg-white/5 text-zinc-400 hover:text-white rounded-md flex items-center justify-center transition-all active:scale-95"
            title="Prossima Slide"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Center: Sleek typographic menu index lists */}
      <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 md:gap-x-5 text-xs tracking-wider leading-none">
        {slideTabs.map((tab) => {
          const isActive = activeSlide === tab.slideNum;
          return (
            <button
              key={tab.slideNum}
              id={`nav-tab-${tab.slideNum}`}
              onClick={() => setActiveSlide(tab.slideNum)}
              className={`transition-all duration-300 relative py-1.5 px-0.5 whitespace-nowrap ${
                isActive
                  ? 'text-[#C5A059] font-bold opacity-100'
                  : 'text-zinc-500 hover:text-zinc-300 opacity-70 hover:opacity-100'
              }`}
            >
              <span>0{tab.slideNum}</span>
              <span className="hidden md:inline-block ml-1 text-[10px] uppercase tracking-normal opacity-80">{tab.short}</span>
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#C5A059]" />
              )}
            </button>
          );
        })}
      </div>

      {/* Right side spacer to balance the flexbox center alignment on desktop */}
      <div className="hidden lg:block w-20" />

    </div>
  );
};
