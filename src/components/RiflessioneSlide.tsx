/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { MailOpen, Compass, Award, Shield, CheckCircle, ChevronDown, Sparkles, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const RiflessioneSlide: React.FC = () => {
  const [showLetter, setShowLetter] = useState<boolean>(false);

  return (
    <div className="relative w-full flex-1 flex flex-col justify-between overflow-hidden p-5 md:p-8 pt-4 md:pt-6 font-sans bg-transparent text-zinc-100 select-none">
      
      {/* Editorial Decorative Grid Details */}
      <div className="flex justify-between items-center text-sm tracking-[0.2em] uppercase text-zinc-500 border-b border-white/5 pb-2 mb-4 md:mb-6">
        <div className="text-[#C5A059] font-bold tracking-widest flex items-center gap-1.5 bg-[#C5A059]/10 px-3 py-1.5 rounded border border-[#C5A059]/20 text-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]" />
          <span>// Riflessione Personale</span>
        </div>
      </div>

      <div className="flex-1 my-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch relative z-10 py-4">
        
        {/* Left column (7 cols): The structured reflection cards */}
        <div className="lg:col-span-7 flex flex-col gap-5">
          <div>
            <span className="text-xs text-[#C5A059] uppercase tracking-wider font-semibold">VALUTAZIONE GLOBALE</span>
            <h2 className="font-serif text-3xl sm:text-4xl text-white font-medium tracking-tight mb-2">
              Riflessione Personale
            </h2>
            <p className="text-sm text-zinc-300 font-light leading-relaxed">
              Questa esperienza è stata importante per capire quanto mi interessi l'intersezione tra ingegneria del software e applicazioni concrete sul campo.
            </p>
          </div>

          {/* Cards container expands to fill remaining vertical space */}
          <div className="flex-1 flex flex-col gap-3">
            
            {/* Box 1: La scoperta più grande - justify-start aligns content to top */}
            <div className="flex-1 flex flex-col justify-start bg-white/[0.01] border border-white/5 p-4 rounded-xl relative group hover:border-[#C5A059]/30 transition-all">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]" />
                <h3 className="text-sm font-bold text-[#C5A059] uppercase tracking-wider">
                  Sviluppo Prototipale
                </h3>
              </div>
              <p className="text-sm text-zinc-400 font-light leading-relaxed">
                Ho capito quanto lavoro ci sia dietro al passaggio da un'idea teorica a un prototipo che funziona davvero, dove ogni scelta nel software ha un effetto diretto sull'affidabilità dell'hardware.
              </p>
            </div>

            {/* Box 2: La sfida principale - justify-start aligns content to top */}
            <div className="flex-1 flex flex-col justify-start bg-white/[0.01] border border-white/5 p-4 rounded-xl relative group hover:border-[#C5A059]/30 transition-all">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]" />
                <h3 className="text-sm font-bold text-[#C5A059] uppercase tracking-wider">
                  Integrazione Sistemi
                </h3>
              </div>
              <p className="text-sm text-zinc-400 font-light leading-relaxed">
                Ho imparato a far funzionare insieme più tecnologie nello stesso momento, come il tracciamento dello spazio, i codici QR usati come riferimento e i calcoli necessari, cercando di non sovraccaricare il sistema, soprattutto in situazioni senza connessione a internet.
              </p>
            </div>

            {/* Box 3: Prospettive future - justify-start aligns content to top */}
            <div className="flex-1 flex flex-col justify-start bg-white/[0.01] border border-white/5 p-4 rounded-xl relative group hover:border-[#C5A059]/30 transition-all">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]" />
                <h3 className="text-sm font-bold text-[#C5A059] uppercase tracking-wider">
                  Cultura della Ricerca
                </h3>
              </div>
              <p className="text-sm text-zinc-400 font-light leading-relaxed">
                Lavorare nella ricerca applicata mi ha fatto capire come nascono le innovazioni di domani. Questa esperienza mi ha spinto a voler continuare a lavorare su progetti tecnologici con un impatto concreto nella realtà.
              </p>
            </div>

          </div>
        </div>

        {/* Right column (5 cols): Dynamic letter of recommendation button made tall and centered internally */}
        <div className="lg:col-span-5 flex h-full">
          
          <div 
            onClick={() => setShowLetter(false)}
            className="w-full bg-[#C5A059]/5 hover:bg-[#C5A059]/10 border border-[#C5A059]/20 hover:border-[#C5A059]/40 p-6 rounded-2xl text-center cursor-pointer transition-all duration-300 group shadow-lg flex flex-col items-center gap-4 py-8 flex-1 h-full justify-center"
          >
            <div className="w-12 h-12 rounded-full bg-[#C5A059]/10 border border-[#C5A059]/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <MailOpen className="w-6 h-6 text-[#C5A059]" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-white leading-tight">Lettera di Referenza UNIBZ</h3>
              <p className="text-sm text-zinc-300 font-light max-w-xs mx-auto leading-relaxed">
                Rilasciata alla fine del tirocinio estivo dal Professore Responsabile del dipartimento.
              </p>
            </div>
          </div>

        </div>

      </div>

      {/* Recommended Academic Letter Modal Overlay */}
      <AnimatePresence>
        {showLetter && (
          <div className="absolute inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-zinc-100 border border-white/10 text-zinc-900 rounded-2xl p-6 md:p-8 w-full max-w-lg max-h-[90%] overflow-y-auto shadow-2xl flex flex-col justify-between"
            >
              <div>
                {/* Academic Header Mock */}
                <div className="flex justify-between items-start border-b border-zinc-200 pb-4 mb-4">
                  <div className="font-serif">
                    <div className="text-sm font-bold text-zinc-800 tracking-wider">Libera Università di Bolzano</div>
                    <div className="text-xs text-zinc-500">Freie Universität Bozen • Free University of Bozen</div>
                  </div>
                  <button 
                    onClick={() => setShowLetter(false)}
                    className="text-zinc-500 hover:text-zinc-700 text-xs focus:outline-none bg-zinc-200/50 p-1.5 rounded font-bold"
                  >
                    [ CHIUDI ]
                  </button>
                </div>

                {/* Letter Content body */}
                <span className="text-xs text-[#C5A059] uppercase font-bold tracking-widest block mb-2">// LETTER OF RECOMMENDATION</span>
                
                <div className="font-serif text-sm leading-relaxed text-zinc-800 space-y-3 pr-2 select-text antialiased">
                  <p className="font-sans text-xs text-zinc-500 text-right mb-4">Bolzano, 28 Agosto 2024</p>
                  
                  <p>A chi di dovere,</p>
                  
                  <p>
                    Con la presente si certifica che lo studente ha completato con eccellenti risultati il proprio tirocinio di PCTO estivo presso la nostra <strong>Facoltà di Scienze e Tecnologie (UNIBZ)</strong>.
                  </p>
                  
                  <p>
                    Durante l'esperienza, ha supportato attivamente lo sviluppo e il testing del prototipo XR per la visualizzazione olografica dei sitemi impiantistici e strutturali in cantiere. Ha dimostrato eccellente autonomia nell'interfacciarsi con il toolkit <strong>MRTK 2.8</strong> e nell'adattare algoritmi voxel per elaborazioni in ambienti con scarsa luminosità.
                  </p>
 
                  <p>
                    Lo studente si è distinto per doti analitiche spiccate, precisione nello sviluppo del codice C# in Unity e una fortissima curiosità intellettuale per i modelli tridimensionali accademici. Si consiglia vivamente lo studente per contesti universitari scientifici e sfide professionali d'avanguardia.
                  </p>

                  {/* Formal Signature Area */}
                  <div className="pt-6 border-t border-zinc-200 flex justify-between items-end">
                    <div className="text-xs text-zinc-500">
                      <div>Dipartimento di Ingegneria UNIBZ</div>
                      <div>Ref: #UNIBZ_PCTO_2024</div>
                    </div>
                    <div className="text-right">
                      <div className="font-serif italic font-bold text-zinc-800 text-sm">Prof. Dr. Coordinator</div>
                      <div className="text-xs text-zinc-500">Senior Research Lead</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end font-sans">
                <button
                  onClick={() => setShowLetter(false)}
                  className="px-5 py-2 bg-zinc-950 text-white rounded-lg text-xs font-bold hover:bg-zinc-800 transition-colors"
                >
                  Conferma e torna alla presentazione
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};