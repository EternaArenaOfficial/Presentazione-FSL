/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Network, LayoutList, FileSpreadsheet, Eye, RefreshCw, Layers, CheckSquare, AlertTriangle, Download, ArrowUpRight, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import hololensImg from '../assets/images/real_hololens_overlay_1781608991166.jpg';

interface YouTubeLoopPlayerProps {
  videoId: string;
  startTime: number;
  endTime: number;
}

const YouTubeLoopPlayer: React.FC<YouTubeLoopPlayerProps> = ({ videoId, startTime, endTime }) => {
  const containerRefA = useRef<HTMLDivElement | null>(null);
  const containerRefB = useRef<HTMLDivElement | null>(null);
  const playerRefA = useRef<any>(null);
  const playerRefB = useRef<any>(null);
  const intervalRef = useRef<number | null>(null);
  const [activePlayer, setActivePlayer] = useState<'A' | 'B'>('A');
  const [isPaused, setIsPaused] = useState<boolean>(false);

  const activePlayerRef = useRef<'A' | 'B'>('A');
  const isPausedRef = useRef<boolean>(false);

  useEffect(() => {
    if (!(window as any).YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    }

    let isDestroyed = false;

    const createPlayer = (elementId: string, onPlayerReady: (p: any) => void) => {
      return new (window as any).YT.Player(elementId, {
        videoId: videoId,
        width: '100%',
        height: '100%',
        playerVars: {
          autoplay: elementId.includes('a') ? 1 : 0,
          mute: 1,
          controls: 0,
          modestbranding: 1,
          rel: 0,
          start: startTime,
          end: endTime,
          showinfo: 0,
          iv_load_policy: 3,
          disablekb: 1,
          fs: 0,
        },
        events: {
          onReady: (event: any) => {
            if (isDestroyed) return;
            event.target.mute();
            onPlayerReady(event.target);
          }
        }
      });
    };

    const initPlayers = () => {
      if (isDestroyed) return;

      if (containerRefA.current) {
        containerRefA.current.innerHTML = '<div id="yt-player-a" class="w-full h-full"></div>';
      }
      if (containerRefB.current) {
        containerRefB.current.innerHTML = '<div id="yt-player-b" class="w-full h-full"></div>';
      }

      playerRefA.current = createPlayer('yt-player-a', (p) => {
        if (!isPausedRef.current) {
          p.playVideo();
        } else {
          p.pauseVideo();
        }
        startLoopMonitor();
      });

      playerRefB.current = createPlayer('yt-player-b', (p) => {
        p.pauseVideo();
        p.seekTo(startTime, true);
      });
    };

    let lastSwitchTime = 0;

    const startLoopMonitor = () => {
      if (isDestroyed) return;
      if (intervalRef.current) return;

      intervalRef.current = window.setInterval(() => {
        if (isPausedRef.current) return;

        const now = Date.now();
        if (now - lastSwitchTime < 2500) return;

        const currentActive = activePlayerRef.current;
        const curPlayerValue = currentActive === 'A' ? playerRefA.current : playerRefB.current;
        const nextPlayerValue = currentActive === 'A' ? playerRefB.current : playerRefA.current;

        if (curPlayerValue && typeof curPlayerValue.getCurrentTime === 'function') {
          const currentTime = curPlayerValue.getCurrentTime();

          if (currentTime >= endTime - 0.85 || currentTime < startTime - 1) {
            if (nextPlayerValue && typeof nextPlayerValue.playVideo === 'function') {
              lastSwitchTime = now; // lock immediately so the interval doesn't re-fire

              // start it while still hidden (opacity 0) — icon flashes off-screen
              nextPlayerValue.playVideo();

              setTimeout(() => {
                if (isDestroyed) return;

                // now reveal it — by this point YouTube's feedback icon has faded out
                const nextActive = currentActive === 'A' ? 'B' : 'A';
                activePlayerRef.current = nextActive;
                setActivePlayer(nextActive);

                setTimeout(() => {
                  if (isDestroyed) return;
                  try {
                    if (curPlayerValue && typeof curPlayerValue.seekTo === 'function') {
                      curPlayerValue.pauseVideo();
                      curPlayerValue.seekTo(startTime, true);
                    }
                  } catch (e) {
                    console.error(e);
                  }
                }, 400);
              }, 400);
            }
          }
        }
      }, 50);
    };

    if ((window as any).YT && (window as any).YT.Player) {
      initPlayers();
    } else {
      const existingCallback = (window as any).onYouTubeIframeAPIReady;
      (window as any).onYouTubeIframeAPIReady = () => {
        if (existingCallback) existingCallback();
        initPlayers();
      };
    }

    return () => {
      isDestroyed = true;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      try {
        if (playerRefA.current && typeof playerRefA.current.destroy === 'function') {
          playerRefA.current.destroy();
        }
        if (playerRefB.current && typeof playerRefB.current.destroy === 'function') {
          playerRefB.current.destroy();
        }
      } catch (err) {
        console.error(err);
      }
    };
  }, [videoId, startTime, endTime]);

  const togglePlayPause = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const nextPaused = !isPaused;
    setIsPaused(nextPaused);
    isPausedRef.current = nextPaused;

    const currentActive = activePlayerRef.current;
    const activePlayerInstance = currentActive === 'A' ? playerRefA.current : playerRefB.current;

    if (activePlayerInstance && typeof activePlayerInstance.playVideo === 'function') {
      if (nextPaused) {
        try {
          activePlayerInstance.pauseVideo();
        } catch (e) {
          console.error(e);
        }
      } else {
        try {
          activePlayerInstance.playVideo();
        } catch (e) {
          console.error(e);
        }
      }
    }
  };

  return (
    <div 
      onClick={togglePlayPause}
      className="w-full h-full absolute inset-0 bg-black overflow-hidden rounded-2xl select-none cursor-pointer"
    >
      <div 
        className={`absolute w-[124%] h-[140%] -left-[12%] -top-[20%] pointer-events-none scale-[1.01] transition-opacity duration-300 ${
          activePlayer === 'A' ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div ref={containerRefA} className="w-full h-full pointer-events-none" />
      </div>

      <div 
        className={`absolute w-[124%] h-[140%] -left-[12%] -top-[20%] pointer-events-none scale-[1.01] transition-opacity duration-300 ${
          activePlayer === 'B' ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div ref={containerRefB} className="w-full h-full pointer-events-none" />
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/35 pointer-events-none z-10" />
    </div>
  );
};

interface PipeElement {
  id: string;
  name: string;
  week: number;
  percentage: number;
  type: 'HVAC' | 'Electrical' | 'Structural' | 'Piping';
  color: string;
  isCompleted: boolean;
}

export const HoloLensSlide: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [selectedWeek, setSelectedWeek] = useState<number>(1);
  const [qrAnchored, setQrAnchored] = useState<boolean>(true);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [hasScanned, setHasScanned] = useState<boolean>(false);
  const [showCsvModal, setShowCsvModal] = useState<boolean>(false);
  const [hoveredPipeId, setHoveredPipeId] = useState<string | null>(null);

  const steps = [
    { title: 'Showcase HoloLens 2', desc: 'Sperimentazione dell\'interfaccia olografica in tempo reale' },
    { title: 'Pianificazione & Progressi', desc: 'Mappatura voxel degli elementi BIM per settimana' },
    { title: 'Scansione Reale 3D', desc: 'Dense Spatial Mesh sul campo con allineamento olografico' }
  ];

  // Reference database replicating columns of Screenshot 2
  const [pipesData, setPipesData] = useState<PipeElement[]>([
    { id: '0001-HVAC_A', name: '0001-HVAC_System', week: 1, percentage: 81.8, type: 'HVAC', color: '#FBBF24', isCompleted: false },
    { id: '0001-HVAC_B', name: '0001-HVAC_Return', week: 1, percentage: 90.6, type: 'HVAC', color: '#FBBF24', isCompleted: false },
    { id: 'Strutturale_S1', name: 'Strutturale_Pilastro_S1', week: 1, percentage: 100.0, type: 'Structural', color: '#E4E4E7', isCompleted: true },
    { id: 'Strutturale_S2', name: 'Strutturale_Muro_Cemento', week: 1, percentage: 81.8, type: 'Structural', color: '#E4E4E7', isCompleted: false },
    { id: 'Strutturale_S3', name: 'Strutturale_Plinto_Ovest', week: 2, percentage: 54.1, type: 'Structural', color: '#E4E4E7', isCompleted: false },
    { id: 'Strutturale_S4', name: 'Strutturale_Solaio_L2', week: 2, percentage: 82.8, type: 'Structural', color: '#E4E4E7', isCompleted: false },
    { id: '0002-EL_A', name: '0002-EL_Power_Bus', week: 2, percentage: 100.0, type: 'Electrical', color: '#A855F7', isCompleted: true },
    { id: '0002-EL_I1', name: '0002-EL_Illum_N', week: 3, percentage: 53.3, type: 'Electrical', color: '#A855F7', isCompleted: false },
    { id: '0002-EL_I2', name: '0002-EL_Power_P', week: 3, percentage: 0.0, type: 'Electrical', color: '#A855F7', isCompleted: false },
    { id: '0002-EL_V1', name: '0002-EL_Vent_C1', week: 4, percentage: 14.3, type: 'Electrical', color: '#A855F7', isCompleted: false },
    { id: '0002-EL_V2', name: '0002-EL_Vent_C2', week: 4, percentage: 100.0, type: 'Electrical', color: '#A855F7', isCompleted: true }
  ]);

  const triggerVoxelScan = () => {
    setIsScanning(true);
    setHasScanned(false);
    setTimeout(() => {
      setIsScanning(false);
      setHasScanned(true);
      // Set values matching voxel scans
      const processed = pipesData.map(p => {
        if (p.percentage >= 80) {
          return { ...p, isCompleted: true };
        }
        return p;
      });
      setPipesData(processed);
    }, 2000);
  };

  const handleDownloadCsv = () => {
    // Generate simple text schema representation
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'Name,Percentage,Status\n';
    pipesData.forEach(p => {
      csvContent += `${p.id},${p.percentage}%,${p.isCompleted ? 'Completed' : 'Not Completed'}\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'UNIBZ_Caldaro_AR_Report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="relative w-full flex-1 flex flex-col justify-between overflow-hidden p-5 md:p-8 pt-4 md:pt-6 font-sans bg-transparent text-zinc-100 select-none">
      
      {/* Top Header Labels */}
      <div className="flex justify-between items-center text-sm tracking-[0.2em] uppercase text-zinc-500 border-b border-white/5 pb-2 mb-4 md:mb-6">
        <div className="text-[#C5A059] font-bold tracking-widest flex items-center gap-1.5 bg-[#C5A059]/10 px-3 py-1.5 rounded border border-[#C5A059]/20 text-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]" />
          <span>// Realtà Mista</span>
        </div>
      </div>

      <div className="flex-1 my-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch relative z-10 py-4">
                {/* Left Side (4 columns): System workflow & Field test context */}
        <div className="lg:col-span-4 flex flex-col justify-between gap-4">
          <div>
            <span className="text-xs text-[#C5A059] uppercase tracking-wider font-semibold">FASE 2: REALTÀ MISTA SUL CAMPO</span>
            <h2 className="font-serif text-3xl sm:text-4xl text-white font-medium tracking-tight mb-2">
              HoloLens 2 in Cantiere
            </h2>
            <p className="text-sm text-zinc-300 font-light leading-relaxed min-h-[64px]">
              {activeStep === 0 && "Visualizzazione in soggettiva: il tracciamento spaziale di HoloLens 2 rileva l'ambiente in tempo reale ricostruendone la geometria."}
              {activeStep === 1 && "Verifica in realtà mista: sovrapposizione del modello BIM olografico sulla struttura fisica per monitorare lo stato di avanzamento settimanale."}
              {activeStep === 2 && "Mesh olografica e rilevazione collisioni: allineamento con i sensori di bordo per identificare discrepanze geometriche o interferenze direttamente sul campo."}
            </p>
          </div>

          {/* Interactive Steps Chronological Checklist */}
          <div className="space-y-2 bg-white/[0.01] border border-white/5 p-4 rounded-xl">
            <div className="space-y-1.5 text-sm font-sans">
              {steps.map((s, idx) => {
                const isActive = activeStep === idx;
                return (
                  <button 
                    key={idx}
                    onClick={() => setActiveStep(idx)}
                    className={`w-full text-left flex gap-3 p-1.5 rounded-lg transition-all duration-300 border ${
                      isActive 
                        ? 'bg-[#C5A059]/10 border-[#C5A059]/40 shadow-inner' 
                        : 'border-transparent hover:bg-white/[0.03] hover:border-white/5'
                    }`}
                  >
                    <span className={`w-5 h-5 border text-xs flex items-center justify-center rounded-sm shrink-0 font-bold mt-0.5 transition-all ${
                      isActive 
                        ? 'bg-[#C5A059] border-[#C5A059] text-black scale-105' 
                        : 'bg-zinc-900 border-zinc-800 text-[#C5A059]'
                    }`}>
                      {idx + 1}
                    </span>
                    <div className="flex-1">
                      <span className={`font-semibold block leading-tight transition-colors ${isActive ? 'text-white font-bold' : 'text-zinc-300'}`}>{s.title}</span>
                      <span className="text-xs text-zinc-400 block leading-tight mt-0.5">{s.desc}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Visual tech insight block */}
          <div className="bg-[#C5A059]/5 border border-[#C5A059]/10 p-3.5 rounded-lg flex gap-3">
            <Info className="w-5 h-5 text-[#C5A059] shrink-0 mt-0.5" />
            <div className="text-xs text-zinc-200">
              <span className="text-[#C5A059] block font-bold mb-0.5">COSA HO IMPARATO:</span>
              Ho capito che, quando ci si muove in un grande spazio con dispositivi come HoloLens, anche un piccolo errore di tracciamento può accumularsi e far perdere l'allineamento tra ologrammi e realtà. Usare dei punti di riferimento fissi è stato il modo per correggere questa deriva e mantenere tutto preciso.
            </div>
          </div>
        </div>

        {/* Right Side (8 columns): Isometric interactive pipeline map & control dashboard */}
        <div className="lg:col-span-8 flex flex-col justify-between gap-4 h-full">
          <div className="relative w-full min-h-[380px] lg:min-h-[470px] flex-grow flex-1 bg-zinc-950/70 border border-[#C5A059]/10 rounded-2xl overflow-hidden shadow-2xl">
            
            {activeStep === 0 && (
              <div className="absolute inset-0 bg-zinc-950 rounded-2xl overflow-hidden animate-fade-in z-25">
                <YouTubeLoopPlayer videoId="HoeKtkAVzyM" startTime={3} endTime={50} />
              </div>
            )}

            {activeStep === 1 && (
              <div className="absolute inset-0 flex flex-col md:flex-row bg-[#020204] animate-fade-in divide-y md:divide-y-0 md:divide-x divide-white/5 overflow-hidden">
                {/* HUD Panel: Construction Element Tracker */}
                <div className="w-full md:w-[42%] flex flex-col h-full bg-black/40 backdrop-blur-sm z-10 relative overflow-y-auto">
                  
                  {/* HUD Header */}
                  <div className="border-b border-white/5 p-3.5 bg-white/[0.02] flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-[#C5A059] animate-pulse" />
                      <span className="text-[10px] tracking-widest uppercase text-zinc-400 font-mono font-bold">
                        BIM_WORK_TRACKER
                      </span>
                    </div>
                    <span className="text-[9px] font-mono text-[#C5A059] bg-[#C5A059]/15 border border-[#C5A059]/20 px-1.5 py-0.5 rounded leading-none">
                      W0{selectedWeek}
                    </span>
                  </div>

                  {/* Element Inventory List */}
                  <div className="flex-1 p-3.5 space-y-3 min-h-0 overflow-y-auto">
                    {pipesData
                      .filter(p => p.week === selectedWeek)
                      .map((p) => {
                        const isHovered = hoveredPipeId === p.id;
                        const finalColor = hasScanned && p.isCompleted ? '#10B981' : p.color;
                        return (
                          <motion.div
                            key={p.id}
                            onMouseEnter={() => setHoveredPipeId(p.id)}
                            onMouseLeave={() => setHoveredPipeId(null)}
                            className={`p-3 rounded-xl border transition-all duration-200 cursor-pointer ${
                              isHovered 
                                ? 'bg-white/[0.04] border-[#C5A059]/40 shadow-md transform scale-[1.01]' 
                                : 'bg-white/[0.01] border-white/5 hover:border-white/10'
                            }`}
                          >
                            <div className="flex justify-between items-start gap-2 mb-1.5">
                              <div>
                                <span className="text-[10px] font-mono text-zinc-400 block tracking-wider leading-none mb-1">
                                  {p.id}
                                </span>
                                <span className="text-[11px] text-zinc-200 font-medium block leading-tight">
                                  {p.name}
                                </span>
                              </div>
                              <div className="text-right">
                                <span 
                                  className="text-[11px] font-mono font-bold"
                                  style={{ color: finalColor }}
                                >
                                  {hasScanned && p.isCompleted ? '100%' : `${p.percentage}%`}
                                </span>
                                <span className="text-[9px] block text-zinc-500 uppercase leading-none mt-1">
                                  {p.type}
                                </span>
                              </div>
                            </div>

                            {/* Animated progress bar indicator */}
                            <div className="w-full h-1.5 bg-zinc-950 rounded-full overflow-hidden relative mt-2">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: hasScanned && p.isCompleted ? '100%' : `${p.percentage}%` }}
                                transition={{ duration: 0.6, ease: 'easeOut' }}
                                className="h-full rounded-full relative"
                                style={{
                                  backgroundColor: finalColor,
                                  boxShadow: `0 0 8px ${finalColor}`,
                                }}
                              />
                            </div>

                            {/* Verification Badge footer */}
                            {hasScanned && (
                              <motion.div 
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-center gap-1 mt-2 text-[9px] font-semibold"
                                style={{ color: p.isCompleted ? '#34D399' : '#9CA3AF' }}
                              >
                                <span className={`w-1 h-1 rounded-full ${p.isCompleted ? 'bg-emerald-400' : 'bg-zinc-500'}`} />
                                <span>{p.isCompleted ? 'VERIFIED // IN PLACE' : 'INCOMPLETE // ALIGN_FAIL'}</span>
                              </motion.div>
                            )}
                          </motion.div>
                        );
                      })}
                  </div>

                  {/* Quick summary status of overall completion for this week 
                  <div className="p-3.5 bg-black/60 border-t border-white/5 shrink-0 text-[10px] font-mono">
                    <div className="flex justify-between items-center text-zinc-400 mb-1">
                      <span>VOXEL_COMPLIANCE:</span>
                      <span className="text-emerald-400 font-bold">
                        {hasScanned 
                          ? `${(pipesData.filter(p => p.week === selectedWeek && p.isCompleted).length / pipesData.filter(p => p.week === selectedWeek).length * 100).toFixed(0)}%`
                          : 'STANDBY_PENDING'}
                      </span>
                    </div>
                    <div className="w-full h-1 bg-zinc-900 rounded-full overflow-hidden">
                      {hasScanned ? (
                        <div 
                          className="h-full bg-emerald-500 transition-all duration-500" 
                          style={{
                            width: `${(pipesData.filter(p => p.week === selectedWeek && p.isCompleted).length / pipesData.filter(p => p.week === selectedWeek).length * 100)}%`
                          }}
                        />
                      ) : (
                        <div className="h-full bg-amber-500/30 w-1/3 animate-pulse" />
                      )}
                    </div>
                  </div>*/}
                </div>

                {/* Holographic 3D SVG Stage */}
                <div className="flex-1 h-full min-h-[220px] relative flex flex-col justify-between overflow-hidden">
                  
                  {/* Backdrop Subtle Ambient Grid & Scanner sweeps */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(197,160,89,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(197,160,89,0.015)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

                  {/* Live scanner laser bar overlay during dynamic scans */}
                  <AnimatePresence>
                    {isScanning && (
                      <motion.div
                        initial={{ top: '0%' }}
                        animate={{ top: '100%' }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 2, ease: 'easeInOut' }}
                        className="absolute inset-x-0 h-0.5 bg-[#C5A059] shadow-[0_0_15px_#C5A059] z-20 pointer-events-none"
                      />
                    )}
                  </AnimatePresence>

                  {/* Isometric SVG Drawing Area */}
                  <div className="flex-1 w-full flex items-center justify-center p-4 relative">
                    {qrAnchored ? (
                      <svg 
                        viewBox="0 0 420 320" 
                        className="w-full max-w-[420px] h-auto overflow-visible select-none"
                      >
                        {/* Definitions for gradients and glowing filters */}
                        <defs>
                          <filter id="svg-hologram-glow" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="3" result="blur" />
                            <feMerge>
                              <feMergeNode in="blur" />
                              <feMergeNode in="SourceGraphic" />
                            </feMerge>
                          </filter>
                        </defs>

                        {/* --- LAYER 1: FLOOR GRID MESH (Isometric Room boundaries) --- */}
                        <g stroke="#374151" strokeWidth="1" strokeDasharray="3,3" fill="none" opacity="0.35">
                          {/* Floor wireframe */}
                          <polygon points="60,240 210,310 360,240 210,170" />
                          {/* Ceilings wireframe */}
                          <polygon points="60,110 210,180 360,110 210,40" />
                          {/* Vertical binding corner joists */}
                          <line x1="60" y1="240" x2="60" y2="110" />
                          {/* Front corner pillar (most visible) */}
                          <line x1="210" y1="310" x2="210" y2="180" stroke="#C5A059" opacity="0.4" strokeWidth="1.5" />
                          <line x1="360" y1="240" x2="360" y2="110" />
                          <line x1="210" y1="170" x2="210" y2="40" />
                        </g>

                        {/* Isometric helper guide grids on the back walls */}
                        <g stroke="rgba(255,255,255,0.02)" strokeWidth="0.75" fill="none">
                          {/* Wall Left grid */}
                          <line x1="60" y1="175" x2="210" y2="245" />
                          <line x1="60" y1="142" x2="210" y2="212" />
                          <line x1="110" y1="135" x2="110" y2="265" />
                          <line x1="160" y1="158" x2="160" y2="288" />

                          {/* Wall Right grid */}
                          <line x1="210" y1="245" x2="360" y2="175" />
                          <line x1="210" y1="212" x2="360" y2="142" />
                          <line x1="260" y1="193" x2="260" y2="63" />
                          <line x1="310" y1="170" x2="310" y2="40" />
                        </g>

                        {/* --- LAYER 2: BACKWARD/DEEMED INACTIVE BIM ELEMENTS --- */}
                        <g stroke="rgba(255, 255, 255, 0.04)" strokeWidth="1" fill="none">
                          <line x1="110" y1="262" x2="110" y2="140" stroke="rgba(255,255,255,0.06)" strokeWidth="1.2" />
                          <line x1="310" y1="193" x2="310" y2="70" stroke="rgba(255,255,255,0.06)" strokeWidth="1.2" />
                          <polygon points="170,110 210,95 285,125 245,140" fill="rgba(255, 255, 255, 0.01)" />
                        </g>

                        {/* --- LAYER 3: CUSTOM BIM PIPING PATHS & GEOMETRY --- */}
                        <g fill="none">
                          
                          {/* ELEMENT ID: Strutturale_S1 (Week 1 structural Column) */}
                          {(() => {
                            const p = pipesData.find(el => el.id === 'Strutturale_S1');
                            if (!p) return null;
                            const isActive = selectedWeek === p.week;
                            const isHovered = hoveredPipeId === p.id;
                            const strokeColor = hasScanned && p.isCompleted ? '#10B981' : p.color;
                            return (
                              <g 
                                className="cursor-pointer transition-all duration-300"
                                onMouseEnter={() => setHoveredPipeId(p.id)}
                                onMouseLeave={() => setHoveredPipeId(null)}
                              >
                                {(isActive || isHovered) && (
                                  <line 
                                    x1="160" y1="288" x2="160" y2="158" 
                                    stroke={strokeColor} 
                                    strokeWidth="12" 
                                    strokeLinecap="round"
                                    opacity={isHovered ? 0.25 : 0.1}
                                    filter="url(#svg-hologram-glow)"
                                  />
                                )}
                                <line 
                                  x1="160" y1="288" x2="160" y2="158" 
                                  stroke={isActive ? strokeColor : 'rgba(255,255,255,0.07)'} 
                                  strokeWidth={isActive ? (isHovered ? 6 : 4) : 1.5}
                                  strokeLinecap="round"
                                  className={isActive && !isScanning ? "animate-pulse" : ""}
                                />
                              </g>
                            );
                          })()}

                          {/* ELEMENT ID: Strutturale_S2 (Week 1 Structural wall) */}
                          {(() => {
                            const p = pipesData.find(el => el.id === 'Strutturale_S2');
                            if (!p) return null;
                            const isActive = selectedWeek === p.week;
                            const isHovered = hoveredPipeId === p.id;
                            const strokeColor = hasScanned && p.isCompleted ? '#10B981' : p.color;
                            return (
                              <g 
                                className="cursor-pointer transition-all duration-300"
                                onMouseEnter={() => setHoveredPipeId(p.id)}
                                onMouseLeave={() => setHoveredPipeId(null)}
                              >
                                <polygon 
                                  points="60,240 60,110 120,138 120,268" 
                                  fill={isActive ? `${strokeColor}10` : 'transparent'} 
                                  stroke={isActive ? strokeColor : 'rgba(255,255,255,0.07)'}
                                  strokeWidth={isActive ? (isHovered ? 2.5 : 1.5) : 1}
                                  strokeDasharray={isActive ? "none" : "3,3"}
                                />
                              </g>
                            );
                          })()}

                          {/* ELEMENT ID: 0001-HVAC_A (Week 1 Yellow air duct) */}
                          {(() => {
                            const p = pipesData.find(el => el.id === '0001-HVAC_A');
                            if (!p) return null;
                            const isActive = selectedWeek === p.week;
                            const isHovered = hoveredPipeId === p.id;
                            const strokeColor = hasScanned && p.isCompleted ? '#10B981' : p.color;
                            return (
                              <g 
                                className="cursor-pointer transition-all duration-300"
                                onMouseEnter={() => setHoveredPipeId(p.id)}
                                onMouseLeave={() => setHoveredPipeId(null)}
                              >
                                {(isActive || isHovered) && (
                                  <path 
                                    d="M100,120 L220,175 L310,133" 
                                    stroke={strokeColor} 
                                    strokeWidth="10" 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round"
                                    opacity="0.12"
                                    filter="url(#svg-hologram-glow)"
                                  />
                                )}
                                <path 
                                  d="M100,120 L220,175 L310,133" 
                                  stroke={isActive ? strokeColor : 'rgba(255,255,255,0.07)'} 
                                  strokeWidth={isActive ? (isHovered ? 5.5 : 4) : 1.5}
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </g>
                            );
                          })()}

                          {/* ELEMENT ID: 0001-HVAC_B (Week 1 air duct system sidebranch) */}
                          {(() => {
                            const p = pipesData.find(el => el.id === '0001-HVAC_B');
                            if (!p) return null;
                            const isActive = selectedWeek === p.week;
                            const isHovered = hoveredPipeId === p.id;
                            const strokeColor = hasScanned && p.isCompleted ? '#10B981' : p.color;
                            return (
                              <g 
                                className="cursor-pointer transition-all duration-300"
                                onMouseEnter={() => setHoveredPipeId(p.id)}
                                onMouseLeave={() => setHoveredPipeId(null)}
                              >
                                {(isActive || isHovered) && (
                                  <path 
                                    d="M130,105 L220,147 L230,180" 
                                    stroke={strokeColor} 
                                    strokeWidth="8" 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round"
                                    opacity="0.12"
                                    filter="url(#svg-hologram-glow)"
                                  />
                                )}
                                <path 
                                  d="M130,105 L220,147 L230,180" 
                                  stroke={isActive ? strokeColor : 'rgba(255,255,255,0.07)'} 
                                  strokeWidth={isActive ? (isHovered ? 4.5 : 3) : 1}
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </g>
                            );
                          })()}

                          {/* WEEK 2: ELEMENT ID: Strutturale_S3 (structural foundations) */}
                          {(() => {
                            const p = pipesData.find(el => el.id === 'Strutturale_S3');
                            if (!p) return null;
                            const isActive = selectedWeek === p.week;
                            const isHovered = hoveredPipeId === p.id;
                            const strokeColor = hasScanned && p.isCompleted ? '#10B981' : p.color;
                            return (
                              <g 
                                className="cursor-pointer transition-all duration-300"
                                onMouseEnter={() => setHoveredPipeId(p.id)}
                                onMouseLeave={() => setHoveredPipeId(null)}
                              >
                                <polygon 
                                  points="250,260 290,240 330,260 290,280" 
                                  fill={isActive ? `${strokeColor}20` : 'transparent'} 
                                  stroke={isActive ? strokeColor : 'rgba(255,255,255,0.07)'}
                                  strokeWidth={isActive ? (isHovered ? 3 : 1.5) : 1}
                                />
                              </g>
                            );
                          })()}

                          {/* WEEK 2: ELEMENT ID: Strutturale_S4 (Shoring upper ceilings) */}
                          {(() => {
                            const p = pipesData.find(el => el.id === 'Strutturale_S4');
                            if (!p) return null;
                            const isActive = selectedWeek === p.week;
                            const isHovered = hoveredPipeId === p.id;
                            const strokeColor = hasScanned && p.isCompleted ? '#10B981' : p.color;
                            return (
                              <g 
                                className="cursor-pointer transition-all duration-300"
                                onMouseEnter={() => setHoveredPipeId(p.id)}
                                onMouseLeave={() => setHoveredPipeId(null)}
                              >
                                <polygon 
                                  points="160,80 260,126 310,103 210,57" 
                                  fill={isActive ? `${strokeColor}10` : 'transparent'} 
                                  stroke={isActive ? strokeColor : 'rgba(255,255,255,0.07)'}
                                  strokeWidth={isActive ? (isHovered ? 2.5 : 1.5) : 0.75}
                                />
                              </g>
                            );
                          })()}

                          {/* WEEK 2: ELEMENT ID: 0002-EL_A (Purple power line feed) */}
                          {(() => {
                            const p = pipesData.find(el => el.id === '0002-EL_A');
                            if (!p) return null;
                            const isActive = selectedWeek === p.week;
                            const isHovered = hoveredPipeId === p.id;
                            const strokeColor = hasScanned && p.isCompleted ? '#10B981' : p.color;
                            return (
                              <g 
                                className="cursor-pointer transition-all duration-300"
                                onMouseEnter={() => setHoveredPipeId(p.id)}
                                onMouseLeave={() => setHoveredPipeId(null)}
                              >
                                {(isActive || isHovered) && (
                                  <path 
                                    d="M60,180 L180,235 L180,300" 
                                    stroke={strokeColor} 
                                    strokeWidth="6" 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round"
                                    opacity="0.15"
                                    filter="url(#svg-hologram-glow)"
                                  />
                                )}
                                <path 
                                  d="M60,180 L180,235 L180,300" 
                                  stroke={isActive ? strokeColor : 'rgba(255,255,255,0.05)'} 
                                  strokeWidth={isActive ? (isHovered ? 3.5 : 2.2) : 1}
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeDasharray={isActive ? "none" : "2,4"}
                                />
                              </g>
                            );
                          })()}

                          {/* WEEK 3: ELEMENT ID: 0002-EL_I1 (Illumination tracks) */}
                          {(() => {
                            const p = pipesData.find(el => el.id === '0002-EL_I1');
                            if (!p) return null;
                            const isActive = selectedWeek === p.week;
                            const isHovered = hoveredPipeId === p.id;
                            const strokeColor = hasScanned && p.isCompleted ? '#10B981' : p.color;
                            return (
                              <g 
                                className="cursor-pointer transition-all duration-300"
                                onMouseEnter={() => setHoveredPipeId(p.id)}
                                onMouseLeave={() => setHoveredPipeId(null)}
                              >
                                <path 
                                  d="M120,140 L240,195 M180,167 L180,185 M210,181 L210,198" 
                                  stroke={isActive ? strokeColor : 'rgba(255,255,255,0.04)'} 
                                  strokeWidth={isActive ? (isHovered ? 3 : 1.8) : 0.75}
                                  strokeLinecap="round"
                                />
                              </g>
                            );
                          })()}

                          {/* WEEK 3: ELEMENT ID: 0002-EL_I2 (General sockets loop) */}
                          {(() => {
                            const p = pipesData.find(el => el.id === '0002-EL_I2');
                            if (!p) return null;
                            const isActive = selectedWeek === p.week;
                            const isHovered = hoveredPipeId === p.id;
                            const strokeColor = hasScanned && p.isCompleted ? '#10B981' : p.color;
                            return (
                              <g 
                                className="cursor-pointer transition-all duration-300"
                                onMouseEnter={() => setHoveredPipeId(p.id)}
                                onMouseLeave={() => setHoveredPipeId(null)}
                              >
                                <path 
                                  d="M260,193 L310,170 M310,170 L310,230" 
                                  stroke={isActive ? strokeColor : 'rgba(255,255,255,0.04)'} 
                                  strokeWidth={isActive ? (isHovered ? 3 : 1.8) : 0.75}
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </g>
                            );
                          })()}

                          {/* WEEK 4: ELEMENT ID: 0002-EL_V1 (Ceiling ventilation engine) */}
                          {(() => {
                            const p = pipesData.find(el => el.id === '0002-EL_V1');
                            if (!p) return null;
                            const isActive = selectedWeek === p.week;
                            const isHovered = hoveredPipeId === p.id;
                            const strokeColor = hasScanned && p.isCompleted ? '#10B981' : p.color;
                            return (
                              <g 
                                className="cursor-pointer transition-all duration-300"
                                onMouseEnter={() => setHoveredPipeId(p.id)}
                                onMouseLeave={() => setHoveredPipeId(null)}
                              >
                                <polygon 
                                  points="230,130 260,116 280,126 250,140" 
                                  fill={isActive ? `${strokeColor}25` : 'transparent'} 
                                  stroke={isActive ? strokeColor : 'rgba(255,255,255,0.04)'}
                                  strokeWidth={isActive ? (isHovered ? 2.5 : 1.5) : 0.75}
                                />
                              </g>
                            );
                          })()}

                          {/* WEEK 4: ELEMENT ID: 0002-EL_V2 (Bottom valve feed route) */}
                          {(() => {
                            const p = pipesData.find(el => el.id === '0002-EL_V2');
                            if (!p) return null;
                            const isActive = selectedWeek === p.week;
                            const isHovered = hoveredPipeId === p.id;
                            const strokeColor = hasScanned && p.isCompleted ? '#10B981' : p.color;
                            return (
                              <g 
                                className="cursor-pointer transition-all duration-300"
                                onMouseEnter={() => setHoveredPipeId(p.id)}
                                onMouseLeave={() => setHoveredPipeId(null)}
                              >
                                <path 
                                  d="M220,290 L300,253 L320,270" 
                                  stroke={isActive ? strokeColor : 'rgba(255,255,255,0.04)'} 
                                  strokeWidth={isActive ? (isHovered ? 3 : 1.8) : 0.75}
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </g>
                            );
                          })()}

                        </g>
                      </svg>
                    ) : (
                      // Showing warning if unanchored QR code
                      <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-20 backdrop-blur-sm rounded-lg">
                        <span className="text-[10px] text-amber-500 font-bold">&#9888; QR ANCHOR LOST - RE-ALIGN REQUIRED</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeStep === 2 && (
              <div className="absolute inset-0 bg-zinc-950 flex items-center justify-center overflow-hidden animate-fade-in">
                <img 
                  src={hololensImg} 
                  alt="Real HoloLens 2 Scan at Caldaro" 
                  className="w-full h-full object-cover opacity-90 transition-all duration-700 hover:scale-105"
                  style={{ filter: 'url(#holographic-filter)' }}
                  referrerPolicy="no-referrer"
                />
                
                {/* Embedded custom holographic filter defining matrix mapping to eliminate pure red and boost yellow/cyan */}
                <svg className="absolute w-0 h-0" style={{ visibility: 'hidden', position: 'absolute' }}>
                  <defs>
                    <filter id="holographic-filter">
                      <feColorMatrix type="matrix" values="
                        0.0  1.0  0.0  0.0  0.0
                        0.0  1.3  0.2  0.0  0.0
                        0.0  0.2  1.8  0.0  0.0
                        0.0  0.0  0.0  1.0  0.0
                      " />
                      <feGaussianBlur stdDeviation="1.2" result="coloredBlur"/>
                      <feMerge>
                        <feMergeNode in="SourceGraphic" />
                        <feMergeNode in="coloredBlur" />
                      </feMerge>
                    </filter>
                  </defs>
                </svg>

                {/* Sub-geometric scanning lines to reinforce the scan look */}
                <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(197,160,89,0.08)_50%,transparent_50%)] bg-[size:100%_4px] pointer-events-none opacity-50" />

                {/* Holographic scanner target tracking indicators */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-24 h-24 border border-cyan-500/20 rounded-full animate-ping opacity-30" />
                  <div className="w-16 h-16 border border-dashed border-[#C5A059]/40 rounded-full animate-[spin_12s_linear_infinite] flex items-center justify-center">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_8px_#22d3ee]" />
                  </div>
                  <div className="absolute w-44 h-px bg-[#C5A059]/10" />
                  <div className="absolute h-44 w-px bg-[#C5A059]/10" />
                </div>

                {/* Dark Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/15 to-transparent pointer-events-none" />

                <div className="absolute bottom-4 left-4 right-4 bg-zinc-950/85 border border-[#C5A059]/30 p-3.5 rounded-xl text-xs text-zinc-300 max-w-sm backdrop-blur-md z-10 shadow-2xl">
                  <div className="text-emerald-400 font-bold uppercase tracking-wider mb-1 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>// RICOSTRUZIONE REALE SUL CAMPO</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Command controls under viewport - only visible when step is 1 */}
          {activeStep === 1 && (
            <div className="flex flex-wrap gap-2.5 items-center justify-between animate-fade-in">
              <div className="flex gap-2">
                {[1, 2, 3, 4].map((wk) => (
                  <button
                    key={wk}
                    onClick={() => {
                      setSelectedWeek(wk);
                      setHasScanned(false); // Reset scans to allow fresh scan testing
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs md:text-sm transition-all ${
                      selectedWeek === wk
                        ? 'bg-[#C5A059] text-black font-bold border border-[#C5A059]'
                        : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    Settimana 0{wk}
                  </button>
                ))}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={triggerVoxelScan}
                  disabled={isScanning}
                  className="px-4 py-1.5 rounded-lg text-xs md:text-sm bg-white text-black hover:bg-zinc-200 transition-all font-bold flex items-center gap-1.5 shadow-lg"
                >
                  <RefreshCw className={`w-3 h-3 ${isScanning ? 'animate-spin' : ''}`} />
                  <span>Rileva Voxel Viste</span>
                </button>

                <button
                  onClick={() => setShowCsvModal(true)}
                  className="px-3 py-1.5 rounded-lg text-xs md:text-sm bg-[#C5A059]/10 border border-[#C5A059]/20 hover:bg-[#C5A059]/20 text-[#C5A059] transition-all flex items-center gap-1"
                  title="Vedi log file"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>Log CSV</span>
                </button>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Embedded CSV Report Modal replicating exactly the user's spreadsheet */}
      <AnimatePresence>
        {showCsvModal && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#0F0F11] border border-[#C5A059]/30 rounded-2xl p-6 w-full max-w-xl max-h-[85%] overflow-y-auto shadow-2xl flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-center pb-3 border-b border-white/5 mb-4">
                  <div className="flex items-center gap-2">
                    <FileSpreadsheet className="w-5 h-5 text-[#C5A059]" />
                    <span className="text-sm text-white font-medium">UNIBZ_Construction_Progress.csv</span>
                  </div>
                  <button 
                    onClick={() => setShowCsvModal(false)}
                    className="text-zinc-500 hover:text-white text-xs focus:outline-none"
                  >
                    [ X ]
                  </button>
                </div>

                <div className="overflow-x-auto rounded-lg border border-white/5 bg-zinc-950">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-white/5 text-zinc-400 border-b border-white/5">
                        <th className="p-2 border-r border-white/5 font-bold">Name (Element ID)</th>
                        <th className="p-2 border-r border-white/5 font-bold">Percentage</th>
                        <th className="p-2 font-bold">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-zinc-300">
                      {pipesData.map((p, index) => (
                        <tr key={index} className="hover:bg-white/[0.02]">
                          <td className="p-2 border-r border-white/5 text-white">{p.id}</td>
                          <td className="p-2 border-r border-white/5">{p.percentage.toFixed(1)}%</td>
                          <td className="p-2">
                            <span className={`px-2 py-0.5 rounded text-xs ${
                              p.isCompleted 
                               ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                                : 'bg-zinc-900 text-zinc-500 border border-zinc-800'
                            }`}>
                              {p.isCompleted ? 'Completed' : 'Not Completed'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
