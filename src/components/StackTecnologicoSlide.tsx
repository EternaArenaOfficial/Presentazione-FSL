/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { LayoutGrid, Cpu, Codepen, Code, Terminal, HelpCircle, HardDrive, Cuboid as Cube, LineChart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface TechItem {
  name: string;
  use: string;
  category: 'engine' | 'framework' | 'hw' | 'sw' | 'model';
  detailedRole: string;
  whyChosen: string;
}

export const StackTecnologicoSlide: React.FC = () => {
  const [selectedTech, setSelectedTech] = useState<number>(0);

  const techStack: TechItem[] = [
    {
      name: 'Unity + C#',
      use: "Sviluppo dell'applicazione",
      category: 'engine',
      detailedRole: 'L\'ambiente di sviluppo 3D deputato alla creazione dell\'applicazione interattiva finale compilata per HoloLens 2.',
      whyChosen: 'Garantisce una gestione precisa delle coordinate spaziali e shader ad alte prestazioni indispensabili per l\'occlusione volumetrica.'
    },
    {
      name: 'MRTK 2.8',
      use: 'Funzioni Mixed Reality',
      category: 'framework',
      detailedRole: 'Il toolkit ufficiale fornito da Microsoft per gestire il tracciamento oculare, le gestures delle mani e l\'interfaccia olografica.',
      whyChosen: 'Offre stabilità e compatibilità ottimali per HoloLens 2, garantendo l\'efficacia delle interazioni spaziali.'
    },
    {
      name: 'HoloLens 2',
      use: 'Visualizzazione olografica',
      category: 'hw',
      detailedRole: 'Il visore di realtà mista standalone trasparente indossato direttamente sul cantiere di prova.',
      whyChosen: 'Le lenti wave-guide lasciano libero il campo visivo dell\'operatore, fattore essenziale per la sicurezza fisica sul cantiere.'
    },
    {
      name: 'Meta Aria Glasses',
      use: 'Acquisizione Point Cloud',
      category: 'hw',
      detailedRole: 'Dispositivo indossabile di ricerca sviluppato da Meta, equipaggiato con sensori multipli (SLAM, IMU, camere strutturate).',
      whyChosen: 'Il design ultraleggero e l\'alta frequenza di campionamento dei sensori sono ideali per la mappatura speditiva di ampie superfici.'
    },
    {
      name: 'RealityCapture',
      use: 'Creazione nuvola di punti',
      category: 'sw',
      detailedRole: 'Software di fotogrammetria computazionale utilizzato per l\'allineamento ed elaborazione delle point cloud dense.',
      whyChosen: 'Assicura un allineamento rapido e accurato di migliaia di fotogrammi catturati per ricostruire una mesh tridimensionale coerente.'
    },
    {
      name: 'NerfStudio + NeRF',
      use: 'Ricostruzione neurale',
      category: 'model',
      detailedRole: 'Framework deputato all\'addestramento di campi di radiatività neurale (NeRF) partendo dai dataset registrati.',
      whyChosen: 'Consente di completare e interpolare superfici continue o in ombra non catturate in modo esaustivo dalla point cloud grezza.'
    },
    {
      name: 'Blender',
      use: 'Ottimizzazione Mesh',
      category: 'sw',
      detailedRole: 'Software di computer grafica 3D utilizzato per la pulizia delle geometrie e l\'ottimizzazione delle mesh esportate.',
      whyChosen: 'Ottimale per applicare modificatori di decimazione e alleggerire point cloud composte da milioni di nodi non uniformi.'
    },
    {
      name: 'Python',
      use: 'Elaborazione Dati',
      category: 'engine',
      detailedRole: 'Linguaggio utilizzato per automatizzare l\'elaborazione locale, la normalizzazione e la formattazione dei dati spaziali.',
      whyChosen: 'Consente di impostare script agili di pulizia e validazione delle coordinate esportate in formato CSV.'
    }
  ];

  const getCategoryIcon = (cat: TechItem['category']) => {
    switch (cat) {
      case 'engine':
        return <Code className="w-5 h-5 text-[#C5A059]" />;
      case 'framework':
        return <Codepen className="w-5 h-5 text-[#C5A059]" />;
      case 'hw':
        return <Cpu className="w-5 h-5 text-[#C5A059]" />;
      case 'sw':
        return <Cube className="w-5 h-5 text-[#C5A059]" />;
      default:
        return <Terminal className="w-5 h-5 text-[#C5A059]" />;
    }
  };

  const currentTech = techStack[selectedTech];

  return (
    <div className="relative w-full flex-1 flex flex-col justify-between overflow-hidden p-5 md:p-8 pt-4 md:pt-6 font-sans bg-transparent text-zinc-100 select-none">
      
      {/* Editorial Decorative Grid Details */}
      <div className="flex justify-between items-center text-sm tracking-[0.2em] uppercase text-zinc-500 border-b border-white/5 pb-2 mb-4 md:mb-6">
        <div className="text-[#C5A059] font-bold tracking-widest flex items-center gap-1.5 bg-[#C5A059]/10 px-3 py-1.5 rounded border border-[#C5A059]/20 text-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]" />
          <span>// Stack Tecnologico</span>
        </div>
      </div>

      <div className="flex-1 my-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch relative z-10 py-4">
        
        {/* Left column (5 cols): Selected detail view card */}
        <div className="lg:col-span-5 min-h-[360px] lg:min-h-[430px] flex flex-col justify-start gap-4">
          <div className="space-y-2">
            <span className="text-sm uppercase px-3 py-1 bg-white/5 border border-white/5 rounded-md inline-block text-zinc-300">
              {currentTech.category.toUpperCase()}
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-white font-medium tracking-tight">
              {currentTech.name}
            </h2>
          </div>
          
          {/* Main Integrated Information Card */}
          <div className="bg-[#0F0F11]/60 border border-white/5 p-5 rounded-xl flex-1 flex flex-col justify-between gap-4">
            
            {/* Section 1: Impiego PCTO */}
            <div className="space-y-1">
              <span className="text-[#C5A059] font-bold text-xs tracking-wider block">// IMPIEGO PCTO</span>
              <p className="text-sm text-zinc-200 font-medium leading-relaxed">
                {currentTech.use}
              </p>
            </div>

            {/* Sub-details container inside the card */}
            <div className="border-t border-white/5 pt-4 space-y-4">
              {/* Section 2: Cos'è */}
              <div className="space-y-1">
                <span className="text-[#C5A059] text-xs block font-bold tracking-wider">// COS'È?</span>
                <p className="text-sm text-zinc-400 font-light leading-relaxed">
                  {currentTech.detailedRole}
                </p>
              </div>
              
              {/* Section 3: Perché scelto */}
              <div className="space-y-1">
                <span className="text-[#C5A059] text-xs block font-bold tracking-wider">// PERCHÈ SCELTO?</span>
                <p className="text-sm text-zinc-400 font-light leading-relaxed">
                  {currentTech.whyChosen}
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Right column (7 cols): Immersive interactive grid card dashboard */}
        <div className="lg:col-span-7 flex flex-col justify-between min-h-[360px] lg:min-h-[430px]">
          <div className="space-y-3">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {techStack.map((tech, idx) => {
                const isSelected = selectedTech === idx;
                return (
                  <button
                    key={tech.name}
                    onClick={() => setSelectedTech(idx)}
                    className="h-[125px] p-3 rounded-xl border flex flex-col justify-between text-left transition-all duration-300 relative group font-sans bg-zinc-900/40 border-white/5 hover:border-white/15 hover:bg-zinc-900 data-[selected=true]:bg-[#C5A059]/10 data-[selected=true]:border-[#C5A059] data-[selected=true]:shadow-[0_0_15px_rgba(197,160,89,0.15)] data-[selected=true]:ring-1 data-[selected=true]:ring-[#C5A059]"
                    data-selected={isSelected}
                  >
                    <div className="flex justify-between items-start w-full">
                      <div className="p-1.5 rounded-lg bg-zinc-950 border border-white/10 group-hover:scale-105 transition-transform">
                        {getCategoryIcon(tech.category)}
                      </div>
                      <span className="text-xs text-zinc-400 group-hover:text-[#C5A059] transition-colors font-bold">
                        [0{idx + 1}]
                      </span>
                    </div>

                    <div>
                      <div className="text-sm font-bold text-white leading-tight truncate">{tech.name}</div>
                      <div className="text-xs text-zinc-400 leading-none mt-1.5 truncate">{tech.use}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};