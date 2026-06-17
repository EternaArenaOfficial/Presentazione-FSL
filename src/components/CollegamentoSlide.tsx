/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Network, BookOpen, Layers, Landmark, Code, Terminal, HelpCircle, HardDrive, Cpu } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SubjectDetails {
  id: string;
  name: string;
  color: string;
  topics: { school: string; university: string }[];
  extendedTitle: string;
  explanation: string;
}

export const CollegamentoSlide: React.FC = () => {
  const [selectedSubject, setSelectedSubject] = useState<string>('informatica');

  const subjects: SubjectDetails[] = [
    {
      id: 'informatica',
      name: 'Informatica',
      color: 'from-amber-400 to-[#C5A059]',
      extendedTitle: 'Programmazione',
      explanation: 'Il percorso ha evidenziato una sinergia diretta con il programma svolto nel corso degli anni: le competenze teoriche sulla programmazione a oggetti (OOP) sono state applicate alla programmazione dei sensori e delle interfacce in Unity.',
      topics: [
        { school: 'OOP (Classi, Ereditarietà)', university: 'Scripting di componenti Unity e interfacce MRTK' },
        { school: 'Algoritmi di ricerca e array multidimensionali', university: 'Confronto spaziale mesh voxel (isCompleto / isVuoto)' },
      ]
    },
    {
      id: 'tpsit',
      name: 'TPSIT',
      color: 'from-blue-400 to-[#3B82F6]',
      extendedTitle: 'Dispositivi e Protocolli',
      explanation: 'Le nozioni di architettura hardware e sistemi operativi affrontate in TPSIT hanno trovato riscontro concreto nell\'analisi strutturale del visore HoloLens 2.',
      topics: [
        { school: 'Architetture client-server e protocolli API', university: 'Esportazione log-file strutturati in formato CSV integrati' },
        { school: 'Sistemi operativi e device speciali', university: 'Piattaforme di installazione Microsoft UWP su visore' },
        { school: 'Infrastruttura IoT e sensoristica', university: 'Spatial mapping e fotogrammetria con sensori IMU' }
      ]
    }
  ];

  const currentSub = subjects.find(s => s.id === selectedSubject) || subjects[0];

  return (
    <div className="relative w-full flex-1 flex flex-col justify-between overflow-hidden p-5 md:p-8 pt-4 md:pt-6 font-sans bg-transparent text-zinc-100 select-none">
      
      {/* Editorial Decorative Grid Details */}
      <div className="flex justify-between items-center text-sm tracking-[0.2em] uppercase text-zinc-500 border-b border-white/5 pb-2 mb-4 md:mb-6">
        <div className="text-[#C5A059] font-bold tracking-widest flex items-center gap-1.5 bg-[#C5A059]/10 px-3 py-1.5 rounded border border-[#C5A059]/20 text-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]" />
          <span>// Integrazione Didattica</span>
        </div>
      </div>

      <div className="flex-1 my-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch relative z-10 py-4">
        
        {/* Left column (4 cols): Large subject list selectors */}
        <div className="lg:col-span-4 min-h-[360px] lg:min-h-[430px] flex flex-col justify-between">
          <div className="space-y-4">
            <span className="text-xs text-[#C5A059] uppercase tracking-wider font-semibold">// SCUOLA E LAVORO</span>
            <h2 className="font-serif text-3xl sm:text-4xl text-white font-medium tracking-tight mb-2 leading-none">
              Integrazione con la Didattica
            </h2>
            <p className="text-sm text-zinc-400 font-light leading-relaxed">
              Competenze imparate a scuola e applicate durante l'esperienza all'UNIBZ.
            </p>
          </div>

          {/* Large custom buttons layout */}
          <div className="space-y-2 mt-4">
            {subjects.map((sub) => {
              const isActive = selectedSubject === sub.id;
              return (
                <button
                  key={sub.id}
                  onClick={() => setSelectedSubject(sub.id)}
                  className={`w-full p-3.5 rounded-xl border flex items-center justify-between text-left transition-all duration-300 relative font-sans ${
                    isActive
                      ? 'bg-white/5 border-[#C5A059] shadow-inner'
                      : 'bg-zinc-900/20 border-white/5 hover:border-white/10 hover:bg-zinc-900/40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-2.5 h-2.5 rounded-full bg-gradient-to-r ${sub.color}`} />
                    <span className={`text-sm uppercase ${isActive ? 'text-[#C5A059] font-bold' : 'text-zinc-400'}`}>
                      {sub.name}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right column (8 cols): Subject synergy content pane details */}
        <div className="lg:col-span-8 bg-white/[0.01] border border-white/5 rounded-2xl p-6 flex flex-col justify-start gap-4 min-h-[360px] lg:min-h-[430px] shadow-2xl relative">
          
          <div className="space-y-1 pb-1">
            <h3 className="text-lg font-medium text-white leading-tight font-sans">{currentSub.extendedTitle}</h3>
            <p className="text-sm text-zinc-400 font-light leading-relaxed">{currentSub.explanation}</p>
          </div>

          {/* Comparison syllabus grid */}
          <div className="flex-grow flex flex-col justify-stretch gap-3 w-full">
            {currentSub.topics.map((t, idx) => (
              <div 
                key={idx} 
                className="grid grid-cols-1 sm:grid-cols-2 rounded-xl bg-zinc-950 border border-white/5 text-xs hover:border-[#C5A059]/25 transition-colors flex-1 overflow-hidden"
              >
                {/* Left Column: In Classe (Padding added internally) */}
                <div className="p-4 flex flex-col h-full min-h-[90px]">
                  <span className="text-zinc-500 block text-xs uppercase tracking-wider font-bold mb-1">In Classe</span>
                  <div className="flex-1 flex items-center">
                    <span className="text-zinc-300 font-sans tracking-wide leading-normal text-sm">{t.school}</span>
                  </div>
                </div>
                
                {/* Right Column: Esperienza UNIBZ (Full-bleed border layout) */}
                <div className="p-4 border-t sm:border-t-0 sm:border-l border-white/5 flex flex-col h-full min-h-[90px]">
                  <span className="text-[#C5A059] block text-xs uppercase tracking-wider font-bold mb-1">Esperienza UNIBZ</span>
                  <div className="flex-1 flex items-center">
                    <span className="text-white font-sans tracking-wide leading-normal text-sm font-medium">{t.university}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};