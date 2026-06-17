/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Network, BookOpen, Landmark, ChevronRight, CheckSquare, Zap, Users2, Languages, TerminalSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CompetenceItem {
  id: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  icon: React.ReactNode;
  milestones: string[];
  mastery: number; // percentage
  challenge: string;
}

export const CompetenzeSlide: React.FC = () => {
  const [activeItem, setActiveItem] = useState<string>('problem-solving');

  const competences: CompetenceItem[] = [
    {
      id: 'problem-solving',
      title: 'Problem solving autonomo',
      shortDesc: 'Risoluzione autonoma di problemi complessi senza soluzioni pronte.',
      fullDesc: 'Mi sono trovato ad affrontare problemi nuovi, senza una soluzione già pronta da seguire: per esempio, ho dovuto capire come regolare i voxel con precisione millimetrica e come far funzionare bene gli ancoraggi spaziali anche in assenza di luce.',
      icon: <Zap className="w-5 h-5 text-amber-400" />,
      milestones: [
        'Overcoming voxel mesh offsets manually',
        'Offline spatial calibration testing',
        'Custom C# threshold handlers'
      ],
      mastery: 92,
      challenge: 'Far coincidere ologrammi e oggetti reali con un margine d\'errore di pochi pixel.'
    },
    {
      id: 'work-team',
      title: 'Lavoro in team professionale',
      shortDesc: 'Collaborazione con un team internazionale di ricercatori e professori.',
      fullDesc: 'Ho lavorato a stretto contatto con dottorandi e professori di Ingegneria, partecipando ai meeting e presentando regolarmente i risultati del mio lavoro.',
      icon: <Users2 className="w-5 h-5 text-blue-400" />,
      milestones: [
        'Meeting bisettimanali in accademia',
        'Presentazione progressi ai mentor',
        'Co-authoring di report analitici'
      ],
      mastery: 88,
      challenge: 'Adattarmi ai ritmi e alle aspettative di un team di ricerca già strutturato.'
    },
    {
      id: 'languages',
      title: 'Competenze linguistiche',
      shortDesc: 'Uso quotidiano dell\'inglese in un contesto accademico internazionale.',
      fullDesc: 'Ho letto regolarmente paper scientifici e documentazione tecnica in inglese, e ho partecipato a meeting e presentazioni tenuti esclusivamente in questa lingua.',
      icon: <Languages className="w-5 h-5 text-emerald-400" />,
      milestones: [
        'Lettura paper scientifici (NeRF & SLAM)',
        'Presentazioni formali in lingua inglese',
        'Scrittura log di sviluppo tecnici'
      ],
      mastery: 95,
      challenge: 'Discutere argomenti tecnici complessi usando il lessico specifico del settore.'
    },
    {
      id: 'dev-cycle',
      title: 'Gestione sviluppo software',
      shortDesc: 'Gestione del progetto software dall\'inizio alla prima versione funzionante.',
      fullDesc: 'Ho seguito un metodo di lavoro organizzato per fasi e ho usato Git per tenere traccia delle modifiche al codice. Ho anche testato il software sul campo, documentando tutto in modo chiaro.',
      icon: <TerminalSquare className="w-5 h-5 text-purple-400" />,
      milestones: [
        'VCS standard via Git su GitHub',
        'Beta testing su visori fisici reali',
        'Deployment in condizioni ostili'
      ],
      mastery: 90,
      challenge: 'Garantire che il programma funzionasse in modo stabile su dispositivi senza un collegamento diretto per il debug.'
    }
  ];

  const currentComp = competences.find(c => c.id === activeItem) || competences[0];

  return (
    <div className="relative w-full flex-1 flex flex-col justify-between overflow-hidden p-5 md:p-8 pt-4 md:pt-6 font-sans bg-transparent text-zinc-100 select-none">
      
      {/* Editorial Decorative Grid Details */}
      <div className="flex justify-between items-center text-sm tracking-[0.2em] uppercase text-zinc-500 border-b border-white/5 pb-2 mb-4 md:mb-6">
        <div className="text-[#C5A059] font-bold tracking-widest flex items-center gap-1.5 bg-[#C5A059]/10 px-3 py-1.5 rounded border border-[#C5A059]/20 text-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]" />
          <span>// Competenze Sviluppate</span>
        </div>
      </div>

      <div className="flex-1 my-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch relative z-10 py-4">
        
        {/* Left Side (6 columns): Grid Selection bento */}
        <div className="lg:col-span-6 flex flex-col justify-stretch h-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 flex-grow flex-1 h-full">
            {competences.map((comp) => {
              const isSelected = activeItem === comp.id;
              return (
                <button
                  key={comp.id}
                  onClick={() => setActiveItem(comp.id)}
                  className={`p-5 rounded-md border text-left transition-all duration-300 flex flex-col justify-between h-full relative overflow-hidden group min-h-[145px] ${
                    isSelected
                      ? 'bg-[#C5A059]/10 border-[#C5A059]'
                      : 'bg-zinc-900/40 border-white/5 hover:border-white/15'
                  }`}
                >
                  <div className="flex justify-between items-start w-full">
                    <div className="p-2.5 bg-zinc-950 border border-white/10 rounded-lg">
                      {comp.icon}
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="text-sm sm:text-base font-bold text-white group-hover:text-[#C5A059] transition-colors leading-tight">
                      {comp.title}
                    </div>
                    <div className="text-xs sm:text-sm text-zinc-400 line-clamp-2 leading-relaxed mt-2 font-normal">
                      {comp.shortDesc}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side (6 columns): Expanded interactive evaluation layout */}
        <div className="lg:col-span-6 bg-white/[0.01] border border-white/5 rounded-2xl p-6 flex flex-col justify-between shadow-2xl relative">
          
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#C5A059] uppercase tracking-wider font-semibold">// DETTAGLIO SPECIFICO</span>
              <span className="text-zinc-700">|</span>
              <span className="text-xs text-zinc-400 font-semibold">ANALISI MATURITÀ</span>
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-medium text-white font-sans">{currentComp.title}</h3>
              <p className="text-sm text-zinc-300 font-light leading-relaxed">{currentComp.fullDesc}</p>
            </div>

            {/* Simulated Live Mastery Level Tracker 
            <div className="space-y-1.5 bg-zinc-950 border border-white/5 p-4 rounded-xl">
              <div className="flex justify-between items-center text-xs text-zinc-300">
                <span>AUTOVALUTAZIONE:</span>
                <span className="text-[#C5A059] font-bold text-sm">{currentComp.mastery}%</span>
              </div>
              <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
                <motion.div 
                   initial={{ width: 0 }}
                   animate={{ width: `${currentComp.mastery}%` }}
                   transition={{ duration: 0.5 }}
                   className="h-full bg-gradient-to-r from-[#C5A059] to-amber-300"
                />
              </div>
            </div>
            */}
          </div>


          {/* Challenge box */}
          <div className="text-xs font-sans text-zinc-400 bg-white/[0.02] border border-white/5 px-3.5 py-2.5 rounded-lg">
            <span className="text-[#C5A059] text-xs block font-bold mb-1">// LA SFIDA PIÙ GRANDE</span>
            <span className="leading-relaxed text-xs sm:text-sm text-zinc-300 font-light">{currentComp.challenge}</span>
          </div>

        </div>

      </div>
    </div>
  );
};
