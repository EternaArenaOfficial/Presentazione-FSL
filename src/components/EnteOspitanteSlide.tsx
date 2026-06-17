/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { School, Users, Calendar, Award, BookOpen, Languages } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const EnteOspitanteSlide: React.FC = () => {
  const [lang, setLang] = useState<'it' | 'de' | 'en'>('it');

  const content = {
    it: {
      desc: 'La Libera Università di Bolzano (unibz) è un\'università trilingue che offre corsi di laurea, ricerca e attività accademiche.',
      roleTitle: 'La mia esperienza nel team di ricerca',
      roleDesc: 'Ho collaborato attivamente con un team di ricercatori internazionali, supportando la validazione sperimentale per un progetto di dottorato in Ingegneria Edile ed Informatica.',
      timelineTitle: 'La mia timeline del PCTO',
      fsl: 'Fase FSL',
      fslDetails: 'Le prime due settimane dedicate al setup hardware e all\'acquisizione delle prime point cloud.',
      summer: 'Tirocinio Estivo',
      summerDetails: 'Proseguimento estivo focalizzato sui test pratici in cantiere e sull\'elaborazione dei dati spaziali.',
    },
    de: {
      desc: 'Dreisprachige Universität mit starkem Fokus auf angewandte Forschung. Sie verbindet deutsche wissenschaftliche Präzision mit italienischer Kreativität und globaler Ausrichtung.',
      roleTitle: 'Meine Rolle im Forschungsteam',
      roleDesc: 'Ich durfte direkt mit einem tollen internationalen Forschungsteam zusammenarbeiten und einen Doktoranden bei den Tests für seine Doktorarbeit unterstützen.',
      timelineTitle: 'Chronologischer Ablauf des PCTO',
      fsl: 'FSL-Phase (Februar)',
      fslDetails: '2 intensive Wochen für Setup und erste Raumkartierungen.',
      summer: 'Sommerpraktikum (Juli/August)',
      summerDetails: 'Ausweitung des Praktikums zur realen Baustellenprüfung.',
    },
    en: {
      desc: 'Trilingual university with a strong focus on applied research. It bridges German-style scientific rigor, Italian creativity, and global English academic reach.',
      roleTitle: 'My role in the Research Team',
      roleDesc: 'I collaborated directly within an elite international academic research team, supporting the PhD dissertation of a researcher in Construction Engineering & Computer Science.',
      timelineTitle: 'Chronological PCTO Timeline',
      fsl: 'FSL Phase (February)',
      fslDetails: '2 intensive weeks of setup and initial spatial mapping.',
      summer: 'Summer Internship (July/August)',
      summerDetails: 'Summer extension for live winery deployments and voxel comparison.',
    }
  };

  const teamMembers = [
    { name: 'Dr. Prof. Lanz Oswald', role: 'Visual Computing Lab e AI', tag: 'Prof' },
    /*{ name: 'Dr. Prof. Patrik Dallasega', role: 'Project Management e Impianti Industriali', tag: 'Prof' },*/
    { name: 'Ing. Alessandro Sottovia', role: 'Mentore', tag: 'Studente PhD' },
    { name: 'Davide Ghezzi (Io)', role: 'Sviluppo C# Unity, Mappatura PointCloud', tag: 'Studente' },
    { name: 'Fabio Montagner', role: 'Mappatura arredamento, Mappatura PointCloud', tag: 'Studente' },
    { name: 'Gulfraz Hassan', role: 'Mappatura PointCloud', tag: 'Studente' }
  ];

  return (
    <div className="relative w-full flex-1 flex flex-col justify-between overflow-hidden p-5 md:p-8 pt-4 md:pt-6 font-sans bg-transparent text-zinc-100 select-none">
      
      {/* Editorial Decorative Grid Details */}
      <div className="flex justify-between items-center text-sm tracking-[0.2em] uppercase text-zinc-500 border-b border-white/5 pb-2 mb-4 md:mb-6">
        <div className="text-[#C5A059] font-bold tracking-widest flex items-center gap-1.5 bg-[#C5A059]/10 px-3 py-1.5 rounded border border-[#C5A059]/20 text-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]" />
          <span>// Ente Ospitante</span>
        </div>
      </div>

      <div className="flex-1 my-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch relative z-10 py-6">
        
        {/* Left column (6 cols): UNIBZ trilingual info card */}
        <div className="lg:col-span-6 space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="space-y-1">
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-white font-medium leading-tight">
                UNIBZ: Libera Università <br />
                di Bolzano
              </h2>
              <p className="text-zinc-400 text-sm">Facoltà di Ingegneria / Science and Technology</p>
            </div>

            <AnimatePresence mode="wait">
              <motion.p
                key={lang}
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 5 }}
                transition={{ duration: 0.2 }}
                className="font-sans text-base text-zinc-300 font-light leading-relaxed bg-white/[0.01] border-l-2 border-[#C5A059] pl-4 py-1"
              >
                {content[lang].desc}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* Interactive duration visual bar */}
          <div className="bg-white/[0.02] border border-white/5 p-5 rounded-xl flex-grow flex flex-col justify-between">
            <span className="text-xs text-[#C5A059] block uppercase tracking-wider font-semibold">
              {content[lang].timelineTitle}
            </span>
            
            <div 
              className="relative pl-5 border-l border-zinc-805 flex-grow flex flex-col justify-around py-3 font-sans"
            >
              <div className="relative">
                <span 
                  className="absolute -left-[24.5px] top-1.5 w-2.5 h-2.5 rounded-full bg-[#C5A059] ring-4 ring-[#C5A059]/15" 
                />
                <div className="font-medium text-white text-base">{content[lang].fsl}</div>
                <div className="text-xs sm:text-sm text-zinc-400 mt-1 leading-relaxed">{content[lang].fslDetails}</div>
              </div>
              
              <div className="relative border-t border-white/5 pt-3 mt-3">
                <span className="absolute -left-[24.5px] top-4.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-500/15" />
                <div className="font-medium text-white text-base">{content[lang].summer}</div>
                <div className="text-xs sm:text-sm text-zinc-400 mt-1 leading-relaxed">{content[lang].summerDetails}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right column (6 cols): Research Team collaborative organogram */}
        <div className="lg:col-span-6 bg-white/[0.01] border border-white/5 rounded-2xl p-6 flex flex-col justify-between shadow-2xl">
          <div className="space-y-4">
            <span className="text-xs text-[#C5A059] uppercase tracking-wider font-semibold">// Il Team</span>
            <h3 className="text-base font-sans tracking-tight text-white font-medium">
              {content[lang].roleTitle}
            </h3>
            <p className="text-sm text-zinc-400 font-light leading-normal">
              {content[lang].roleDesc}
            </p>
          </div>

          <div className="flex-grow flex flex-col justify-between gap-3.5 my-2">
            {teamMembers.map((member, idx) => (
              <div 
                key={idx}
                className="flex items-center justify-between bg-white/[0.02] border border-white/5 hover:border-[#C5A059]/30 hover:bg-[#C5A059]/5 rounded-xl transition-all duration-300 p-4 flex-1"
              >
                <div className="grid grid-cols-[auto_1fr] items-center gap-x-4 gap-y-1">
                  <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-xs font-bold text-[#C5A059] row-span-2">
                    {idx === 2 ? 'Me' : member.tag === 'Prof' ? 'Pr' : member.tag === 'Studente' ? 'St' : 'PhD'}
                  </div>
                  <span 
                    className="text-white text-base font-semibold block leading-tight"
                  >
                    {member.name}
                  </span>
                  <span 
                    className="text-zinc-400 text-xs sm:text-sm block leading-tight font-light"
                  >
                    {member.role}
                  </span>
                </div>
                <span 
                  className={`rounded border text-xs px-2.5 py-1 ${
                    idx === 2 
                      ? 'bg-[#C5A059]/20 border-[#C5A059]/30 text-[#C5A059] font-bold' 
                      : 'bg-zinc-900 border-zinc-800 text-zinc-400'
                  }`}
                >
                  {member.tag}
                </span>
              </div>
            ))}
          </div>
      </div>
      </div>
    </div>
  );
};
