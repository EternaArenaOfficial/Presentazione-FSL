/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Shield, User, GraduationCap, Calendar, Check } from 'lucide-react';
import { motion } from 'motion/react';

export const CopertinaSlide: React.FC = () => {
  const [nome, setNome] = useState('Davide Ghezzi');
  const [classe, setClasse] = useState('Classe 5E');
  const [scuola, setScuola] = useState('I.I.S. Galileo Galilei');
  const [as, setAs] = useState('A.S. 2024/2025, 2 settimane');
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="relative w-full flex-1 flex flex-col justify-between overflow-hidden p-5 md:p-8 pt-4 md:pt-6 font-sans bg-transparent text-zinc-100 select-none">
      
      {/* Editorial Decorative Grid Details */}
      <div className="flex justify-between items-center text-sm tracking-[0.2em] uppercase text-zinc-500 border-b border-white/5 pb-2 mb-4 md:mb-6">
        <div className="text-[#C5A059] font-bold tracking-widest flex items-center gap-1.5 bg-[#C5A059]/10 px-3 py-1.5 rounded border border-[#C5A059]/20 text-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]" />
          <span>// Percorso FSL</span>
        </div>
      </div>

      <div className="flex-1 my-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch relative z-10 py-6">
        
        {/* Left Side (8 columns): Title and Academic Header */}
        <div className="lg:col-span-8 flex flex-col justify-center space-y-6">
          <div className="space-y-4">
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-white font-medium tracking-tight leading-none">
              Percorso per le <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C5A059] via-yellow-200 to-white">
                Competenze Trasversali
              </span> <br />
              e l'Orientamento
            </h1>

            <p className="font-sans text-base sm:text-xl text-zinc-300 max-w-2xl font-light leading-relaxed">
              La mia esperienza nello sviluppo di software XR e nella ricerca applicata presso la{' '}
              <strong className="text-white font-normal hover:text-[#C5A059] transition-colors">
                Libera Università di Bolzano (UNIBZ)
              </strong>.
            </p>
          </div>
        </div>

        {/* Right Side (4 columns): Beautiful interactive Student Identity badge - Centered content */}
        <div className="lg:col-span-4 bg-white/[0.02] border border-white/5 rounded-2xl p-6 md:p-8 relative overflow-hidden shadow-2xl backdrop-blur-sm group flex flex-col justify-center min-h-[280px]">
          <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-[#C5A059]/5 blur-xl pointer-events-none group-hover:scale-125 transition-transform duration-700" />
          
          {isEditing ? (
            <div className="space-y-4 text-xs w-full">
              <div>
                <label className="text-zinc-400 block text-xs mb-1">CANDIDATO</label>
                <input
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="w-full bg-white/5 border border-zinc-700 rounded p-1.5 text-white outline-none focus:border-[#C5A059]"
                />
              </div>
              <div>
                <label className="text-zinc-400 block text-xs mb-1">CLASSE</label>
                <input
                  type="text"
                  value={classe}
                  onChange={(e) => setClasse(e.target.value)}
                  className="w-full bg-white/5 border border-zinc-700 rounded p-1.5 text-white outline-none focus:border-[#C5A059]"
                />
              </div>
              <div>
                <label className="text-zinc-400 block text-xs mb-1">ISTITUTO</label>
                <input
                  type="text"
                  value={scuola}
                  onChange={(e) => setScuola(e.target.value)}
                  className="w-full bg-white/5 border border-zinc-700 rounded p-1.5 text-white outline-none focus:border-[#C5A059]"
                />
              </div>
              <div>
                <label className="text-zinc-400 block text-xs mb-1">ANNO SCOLASTICO</label>
                <input
                  type="text"
                  value={as}
                  onChange={(e) => setAs(e.target.value)}
                  className="w-full bg-white/5 border border-zinc-700 rounded p-1.5 text-white outline-none focus:border-[#C5A059]"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-5 w-full">
              <div className="flex items-start gap-3">
                <User className="w-5 h-5 text-[#C5A059] mt-1 shrink-0" />
                <div>
                  <div className="text-xs text-[#C5A059] tracking-wider uppercase font-semibold">Studente</div>
                  <div className="text-xl text-white font-medium">{nome}</div>
                  <div className="text-sm text-zinc-400 mt-0.5">{classe}</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <GraduationCap className="w-5 h-5 text-[#C5A059] mt-1 shrink-0" />
                <div>
                  <div className="text-xs text-[#C5A059] tracking-wider uppercase font-semibold">Scuola</div>
                  <div className="text-base text-zinc-300 font-sans">{scuola}</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-[#C5A059] mt-1 shrink-0" />
                <div>
                  <div className="text-xs text-[#C5A059] tracking-wider uppercase font-semibold">Periodo</div>
                  <div className="text-sm text-zinc-300">{as}</div>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};