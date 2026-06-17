/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { CopertinaSlide } from './components/CopertinaSlide';
import { EnteOspitanteSlide } from './components/EnteOspitanteSlide';
import { MetaAriaSlide } from './components/MetaAriaSlide';
import { HoloLensSlide } from './components/HoloLensSlide';
import { StackTecnologicoSlide } from './components/StackTecnologicoSlide';
import { CompetenzeSlide } from './components/CompetenzeSlide';
import { RiflessioneSlide } from './components/RiflessioneSlide';
import { CollegamentoSlide } from './components/CollegamentoSlide';
import { ConclusioneSlide } from './components/ConclusioneSlide';
import { PresentationControls } from './components/PresentationControls';
import { Shield, Maximize2, Minimize2, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [activeSlide, setActiveSlide] = useState<number>(1);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const totalSlides = 9;

  // React to browser keydown actions for virtual fullscreen toggle & Escape exits
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const toggleFullscreen = () => {
    setIsFullscreen((prev) => !prev);
  };

  // Calculates current progress percentage from active slide
  const progressPercentage = (activeSlide / totalSlides) * 100;

  // Set up Arrow Keys keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        setActiveSlide((prev) => (prev === totalSlides ? 1 : prev + 1));
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setActiveSlide((prev) => (prev === 1 ? totalSlides : prev - 1));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [totalSlides]);

  // Subtle dark obsidian canvas colors shifting slightly per slide
  const getAppBgClass = (slideId: number) => {
    switch (slideId) {
      case 1:
        return 'bg-[#09090B]';
      case 2:
        return 'bg-[#0B0B0D]';
      case 3:
        return 'bg-[#08080A]';
      case 4:
        return 'bg-[#0A0A0C]';
      case 5:
        return 'bg-[#0D0D10]';
      case 6:
        return 'bg-[#070709]';
      case 7:
        return 'bg-[#0A0A0F]';
      case 8:
        return 'bg-[#0C0C11]';
      case 9:
        return 'bg-[#08080B]';
      default:
        return 'bg-[#09090B]';
    }
  };

  // Dynamic metadata mapping for the top bar
  const SLIDE_INFO: Record<number, { category: string; details: string; tag: string }> = {
    1: { category: 'Archivio Presentazione', details: 'INTRO // CALDARO COOP', tag: 'INIZIO' },
    2: { category: "L'Ente Ospitante", details: 'UNIBZ // FACOLTÀ DI INGEGNERIA', tag: 'INFO' },
    3: { category: 'Mappatura 3D', details: 'META ARIA GLASSES // NEURAL POINT CLOUD', tag: 'FASE 1' },
    4: { category: 'Realtà Mista', details: 'HOLOLENS 2 // UNITY // VOXEL COMPASS', tag: 'FASE 2' },
    5: { category: 'Stack Tecnologico', details: 'UNITY // NEURAL NETWORKS // MRTK', tag: 'TECH' },
    6: { category: 'Competenze Sviluppate', details: 'TRANSVERSAL MASTERY ASSESSMENT', tag: 'SKILLS' },
    7: { category: 'Riflessione Personale', details: 'LETTERS OF RECOMMENDATION', tag: 'DIARIO' },
    8: { category: 'Integrazione Didattica', details: 'MATURITÀ EXAM SYLLABUS MAPPED', tag: 'SCHOOL' },
    9: { category: 'Considerazioni Finali', details: 'FUTURE PATHWAYS // GRAD 2025', tag: 'OUTLOOK' }
  };

  return (
    <div
      className={`min-h-screen w-full transition-colors duration-1000 flex flex-col ${
        isFullscreen ? 'p-0 justify-center' : 'justify-between p-3 md:p-6'
      } ${getAppBgClass(activeSlide)} relative overflow-x-hidden`}
    >
      {/* Background ambient light shapes with soft gold pulse and glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none opacity-20">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#C5A059]/5 blur-3xl animate-pulse" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-[#C5A059]/3 blur-3xl" />
      </div>

      {/* Top Header: Minimalist, clean and responsive */}
      {!isFullscreen && (
        <header className="relative z-40 w-full flex justify-between items-center border-b border-white/5 pt-2 pb-3 px-2 mb-2 select-none">
          <div className="flex items-center gap-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
              <p className="text-[10px] sm:text-xs tracking-[0.2em] uppercase text-zinc-300 font-medium">
                FSL
              </p>
              <div className="hidden sm:flex items-center gap-2">
                <span className="text-white/10 text-xs">/</span>
                <p className="text-xs text-zinc-500 font-sans tracking-wide">
                  UNIBZ &bull; I.I.S. Galileo Galilei
                </p>
              </div>
            </div>
          </div>

          {/* Presentation controls & browser presentation tools */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleFullscreen}
              className="flex items-center gap-2 px-3 py-1.5 h-8 rounded-lg bg-zinc-900/60 hover:bg-zinc-800/80 border border-white/5 hover:border-[#C5A059]/30 transition-all duration-300 group text-zinc-400 hover:text-white"
            >
              <Maximize2 className="w-3.5 h-3.5 text-[#C5A059] group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </header>
      )}

      {/* CORE PRESENTATION SHOWCASE: Obsidian Stage with elegant Golden frame edges */}
      <main 
        className={`relative flex-1 w-full flex flex-col items-stretch overflow-hidden transition-all duration-300 ${
          isFullscreen 
            ? 'fixed inset-0 z-[100] w-screen h-screen m-0 p-4 md:p-8 bg-[#0F0F11] rounded-none border-none' 
            : 'max-w-7xl mx-auto my-3 md:my-5 bg-[#0F0F11]/90 border border-white/5 rounded-2xl min-h-[600px] lg:min-h-[660px] shadow-2xl'
        }`}
        style={isFullscreen ? { backgroundColor: '#0F0F11' } : undefined}
      >
        
        {/* Subtle decorative Gold highlights on the extreme corners */}
        <div className="absolute top-0 left-0 w-32 h-[1.5px] bg-gradient-to-r from-[#C5A059] to-transparent z-30 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-32 h-[1.5px] bg-gradient-to-l from-[#C5A059] to-transparent z-30 pointer-events-none" />

        <AnimatePresence mode="wait">
          <motion.div
            key={activeSlide}
            initial={{ opacity: 0, scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.99 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="w-full flex-1 rounded-2xl overflow-hidden bg-transparent flex flex-col justify-between"
          >
            {activeSlide === 1 && <CopertinaSlide />}
            {activeSlide === 2 && <EnteOspitanteSlide />}
            {activeSlide === 3 && <MetaAriaSlide />}
            {activeSlide === 4 && <HoloLensSlide />}
            {activeSlide === 5 && <StackTecnologicoSlide />}
            {activeSlide === 6 && <CompetenzeSlide />}
            {activeSlide === 7 && <RiflessioneSlide />}
            {activeSlide === 8 && <CollegamentoSlide />}
            {activeSlide === 9 && <ConclusioneSlide />}
          </motion.div>
        </AnimatePresence>

        {/* Floating Presentation HUD Controls - Only visible when in slide-fullscreen mode */}
        {isFullscreen && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-zinc-950/95 border border-[#C5A059]/30 px-5 py-2.5 rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.8)] backdrop-blur-md z-50 animate-fade-in text-xs select-none">
            <button
              onClick={() => setActiveSlide((prev) => (prev === 1 ? totalSlides : prev - 1))}
              className="text-zinc-400 hover:text-white p-1 hover:bg-white/5 rounded-full transition-colors"
              title="Precedente"
            >
              <ChevronLeft className="w-4 h-4 text-[#C5A059]" />
            </button>
            <span className="text-zinc-200 font-medium whitespace-nowrap tracking-wider">
              {activeSlide} / {totalSlides}
            </span>
            <button
              onClick={() => setActiveSlide((prev) => (prev === totalSlides ? 1 : prev + 1))}
              className="text-zinc-400 hover:text-white p-1 hover:bg-white/5 rounded-full transition-colors"
              title="Successiva"
            >
              <ChevronRight className="w-4 h-4 text-[#C5A059]" />
            </button>
            <div className="w-px h-5 bg-white/10 mx-1" />
            <button
              onClick={toggleFullscreen}
              className="text-zinc-400 hover:text-[#C5A059] hover:bg-[#C5A059]/10 p-1 px-3 rounded-full transition-all flex items-center gap-1.5"
            >
              <Minimize2 className="w-3.5 h-3.5 text-[#C5A059]" />
            </button>
          </div>
        )}
      </main>

      {/* BOTTOM NAVIGATION DEC PANEL */}
      {!isFullscreen && (
        <footer className="w-full max-w-7xl mx-auto">
          <PresentationControls
            activeSlide={activeSlide}
            setActiveSlide={setActiveSlide}
            totalSlides={totalSlides}
            progress={progressPercentage}
          />
        </footer>
      )}
    </div>
  );
}
