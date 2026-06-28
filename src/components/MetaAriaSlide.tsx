/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Compass, LayoutGrid, Sliders, Info, Eye } from 'lucide-react';
import { motion } from 'motion/react';
import pointcloudImg from '../assets/images/real_pointcloud_scan_1781608070339.jpg';
import ariaVideo from '../assets/videos/Aria.mp4';

interface Point3D {
  x: number;
  y: number;
  z: number;
  color: string;
  label?: string;
}

interface LoopingVideoPlayerProps {
  src: string;
  startTime: number;
  endTime: number;
}

const LoopingVideoPlayer: React.FC<LoopingVideoPlayerProps> = ({ src, startTime, endTime }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      try {
        video.currentTime = startTime;
      } catch (e) {
        console.error(e);
      }
      video.play().catch(() => {
        // Autoplay can be blocked in some contexts; ignore silently.
      });
    };

    const handleTimeUpdate = () => {
      if (video.currentTime >= endTime || video.currentTime < startTime - 0.5) {
        try {
          video.currentTime = startTime;
        } catch (e) {
          console.error(e);
        }
      }
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('timeupdate', handleTimeUpdate);

    // If metadata is already loaded (e.g. fast cache hit), kick things off immediately.
    if (video.readyState >= 1) {
      handleLoadedMetadata();
    }

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, [src, startTime, endTime]);

  const togglePlayPause = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const video = videoRef.current;
    if (!video) return;

    const nextPaused = !isPaused;
    setIsPaused(nextPaused);

    if (nextPaused) {
      video.pause();
    } else {
      video.play().catch(() => {});
    }
  };

  return (
    <div
      onClick={togglePlayPause}
      className="w-full h-full absolute inset-0 bg-black overflow-hidden rounded-2xl select-none cursor-pointer"
    >
      <video
        ref={videoRef}
        src={src}
        autoPlay
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/35 pointer-events-none z-10" />
    </div>
  );
};

export const MetaAriaSlide: React.FC = () => {
  const [pointSize, setPointSize] = useState<number>(3);
  const [density, setDensity] = useState<number>(300);
  const [modelType, setModelType] = useState<'slam' | 'nerf' | 'spatial'>('spatial');
  const [hoveredPoint, setHoveredPoint] = useState<Point3D | null>(null);
  const [rotationAngle, setRotationAngle] = useState<number>(0);
  const [isRotating, setIsRotating] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<'interactive' | 'real_scan'>('interactive');
  const [activeStep, setActiveStep] = useState<number>(0);

  const handleStepClick = (idx: number) => {
    setActiveStep(idx);
    if (idx === 0) {
      setViewMode('interactive');
    } else if (idx === 1) {
      setViewMode('interactive');
      setModelType('slam');
    } else if (idx === 2) {
      setViewMode('interactive');
      setModelType('spatial');
    } else if (idx === 3) {
      setViewMode('interactive');
      setModelType('nerf');
    } else if (idx === 4) {
      setViewMode('real_scan');
    }
  };

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Generate deterministic points in an office floor plan layout (sofa, desk, window, wall, chandelier)
  const generatePoints = (): Point3D[] => {
    const list: Point3D[] = [];

    // Walls (boundaries)
    for (let i = 0; i < 150; i++) {
      const isSide = Math.random() > 0.5;
      list.push({
        x: isSide ? (Math.random() * 2 - 1) * 3 : (Math.random() > 0.5 ? -3 : 3),
        y: isSide ? (Math.random() > 0.5 ? -3 : 3) : (Math.random() * 2 - 1) * 3,
        z: Math.random() * 2.5 - 1.25,
        color: '#71717A', // Zinc grey
        label: 'Parete strutturale (Wall)'
      });
    }

    // Centered Sofa (red/orange themed pop design)
    for (let i = 0; i < 100; i++) {
      list.push({
        x: Math.random() * 2.2 - 1.1,
        y: Math.random() * 0.8 - 1.4,
        z: Math.random() * 0.5 - 0.7,
        color: '#EF4444', // Red
        label: 'Sofà (Sofa)'
      });
    }

    // Chandelier (suspended ceiling structure)
    for (let i = 0; i < 40; i++) {
      list.push({
        x: Math.random() * 0.6 - 0.3,
        y: Math.random() * 0.6 - 0.3,
        z: Math.random() * 0.3 + 0.9,
        color: '#FBBF24', // Yellow Gold
        label: 'Lampadario (Chandelier)'
      });
    }

    // Coffee table (glass center pile)
    for (let i = 0; i < 50; i++) {
      list.push({
        x: Math.random() * 1.0 - 0.5,
        y: Math.random() * 0.6 - 0.3,
        z: Math.random() * 0.2 - 0.6,
        color: '#60A5FA', // Blue
        label: 'Tavolino centrale (Coffee Table)'
      });
    }

    // Windows (dense light elements on background)
    for (let i = 0; i < 60; i++) {
      list.push({
        x: Math.random() * 1.2 - 0.6,
        y: 2.9,
        z: Math.random() * 1.2 - 0.2,
        color: '#34D399', // Emerald Green
        label: 'Finestra orientata (Window)'
      });
    }

    return list;
  };

  const allPointsRef = useRef<Point3D[]>(generatePoints());

  // Handle automatic point rotation
  useEffect(() => {
    let animationId: number;
    const updateRotation = () => {
      if (isRotating) {
        setRotationAngle((prev) => (prev + 0.005) % (Math.PI * 2));
      }
      animationId = requestAnimationFrame(updateRotation);
    };
    animationId = requestAnimationFrame(updateRotation);
    return () => cancelAnimationFrame(animationId);
  }, [isRotating]);

  // Redraw canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Fluid responsive sizing
    const width = canvas.parentElement?.clientWidth || 500;
    const height = canvas.parentElement?.clientHeight || 400;
    canvas.width = width;
    canvas.height = height;

    ctx.clearRect(0, 0, width, height);

    // Camera projection center
    const cx = width / 2;
    const cy = height / 2;
    const scale = Math.min(width, height) * 0.12;

    if (activeStep === 0) {
      return;
    }

    const activePointsCount = Math.min(density, allPointsRef.current.length);
    const visiblePoints = allPointsRef.current.slice(0, activePointsCount);

    const cosR = Math.cos(rotationAngle);
    const sinR = Math.sin(rotationAngle);

    visiblePoints.forEach((p, index) => {
      // 3D rotation around Z axis
      const rx = p.x * cosR - p.y * sinR;
      const ry = p.x * sinR + p.y * cosR;
      const rz = p.z;

      // Simple perspective projection
      const distance = 5;
      const projScale = distance / (distance - rz * 0.15);
      const px = cx + rx * scale * projScale;
      const py = cy - ry * scale * projScale;

      // Draw bounding outlines if spatial active
      if (modelType === 'spatial' && p.label) {
        // Draw very light auxiliary indicators for labels
        if (index % 15 === 0) {
          ctx.strokeStyle = '#C5A05940';
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.arc(px, py, pointSize * 3, 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      // Apply models coloring
      ctx.beginPath();
      if (modelType === 'slam') {
        // Raw LiDAR mono tint
        ctx.fillStyle = `rgba(244, 244, 245, ${0.4 + (rz + 1.25) / 5})`; // white greyscale density
        ctx.arc(px, py, pointSize * 0.8, 0, Math.PI * 2);
      } else if (modelType === 'nerf') {
        // Dense glowing colors
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 4;
        ctx.shadowColor = p.color;
        ctx.arc(px, py, pointSize * 1.3, 0, Math.PI * 2);
      } else {
        // Spatial Latent Mapping: outline nodes with clean boxes
        ctx.fillStyle = '#C5A059';
        ctx.shadowBlur = 0;
        ctx.arc(px, py, pointSize, 0, Math.PI * 2);
      }
      ctx.fill();
      ctx.shadowBlur = 0; // Restore
    });

    // Outer framing box (3D structure projection helper)
    if (modelType === 'spatial') {
      ctx.strokeStyle = 'rgba(197, 160, 89, 0.15)';
      ctx.lineWidth = 1;
      ctx.strokeRect(cx - scale * 3, cy - scale * 3, scale * 6, scale * 6);
    }

  }, [pointSize, density, modelType, rotationAngle, canvasRef, activeStep]);

  // Render text steps
  const steps = [
    { title: 'Cattura degli spazi', desc: 'Raccolta dei dati spaziali tramite gli occhiali intelligenti Meta Aria' },
    { title: 'Generazione Point Cloud', desc: 'Rilevamento di milioni di coordinate tridimensionali nello spazio 3D' },
    { title: 'Pulizia in Blender', desc: 'Esportazione delle mesh e filtraggio dei rumori di fondo geometrici' },
    { title: 'Addestramento NeRF', desc: 'Utilizzo di NerfStudio per calcolare illuminazione e colori continui' },
    { title: 'Ricostruzione Finale', desc: 'Visualizzazione della scena ricostruita ad alta fedeltà geometrica' }
  ];

  // Mouse move over canvas simulates hovering over 3D coordinates
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Pick a pseudo-random point corresponding to coordinates to show live coordinate labels
    const pctX = x / rect.width;
    const pctY = y / rect.height;

    // Pick a point from the list matching coordinates
    const idx = Math.floor((pctX + pctY) * 150) % allPointsRef.current.length;
    const pt = allPointsRef.current[idx];

    if (pt) {
      setHoveredPoint({
        x: parseFloat((pt.x + (pctX - 0.5)).toFixed(5)),
        y: parseFloat((pt.y + (pctY - 0.5)).toFixed(5)),
        z: parseFloat((pt.z + (Math.sin(rotationAngle) * 0.2)).toFixed(5)),
        color: pt.color,
        label: pt.label
      });
    }
  };

  return (
    <div className="relative w-full flex-1 flex flex-col justify-between overflow-hidden p-5 md:p-8 pt-4 md:pt-6 font-sans bg-transparent text-zinc-100 select-none">
      
      {/* Top Slider Frame Info */}
      <div className="flex justify-between items-center text-sm tracking-[0.2em] uppercase text-zinc-500 border-b border-white/5 pb-2 mb-4 md:mb-6">
        <div className="text-[#C5A059] font-bold tracking-widest flex items-center gap-1.5 bg-[#C5A059]/10 px-3 py-1.5 rounded border border-[#C5A059]/20 text-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]" />
          <span>// Mappatura 3D</span>
        </div>
      </div>

      <div className="flex-1 my-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch relative z-10 py-4">
        
        {/* Left column (4 cols): Method details and educational notes */}
        <div className="lg:col-span-4 flex flex-col justify-between gap-4">
          <div>
            <span className="text-xs text-[#C5A059] uppercase tracking-wider font-semibold">FASE 1: MAPPATURA NEURALE</span>
            <h2 className="font-serif text-3xl sm:text-4xl text-white font-medium tracking-tight mb-2">
              Meta Aria Glasses
            </h2>
            <p className="text-sm text-zinc-300 font-light leading-relaxed">
              Il percorso è iniziato con la digitalizzazione tridimensionale di un intero settore dei laboratori di ricerca UNIBZ tramite sensori avanzati.
            </p>
          </div>

          {/* Chronological checklist steps */}
          <div className="space-y-2 bg-white/[0.01] border border-white/5 p-4 rounded-xl">
            <div className="space-y-1.5 text-sm font-sans">
              {steps.map((s, idx) => {
                const isActive = activeStep === idx;
                return (
                  <button 
                    key={idx}
                    onClick={() => handleStepClick(idx)}
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
              Ho capito che esistono modi diversi di catturare uno spazio in 3D. Un metodo tradizionale registra solo punti e coordinate; un metodo neurale come NeRF, invece, impara anche come la luce e i colori si comportano nello spazio, ottenendo una ricostruzione molto più realistica.
            </div>
          </div>
        </div>

        {/* Right column (8 cols): Immersive interactive 3D Point Cloud workspace */}
        <div className="lg:col-span-8 flex flex-col justify-between gap-4 h-full">
          <div className="w-full relative min-h-[380px] lg:min-h-[470px] flex-grow flex-1 bg-zinc-950/80 border border-white/5 rounded-2xl overflow-hidden shadow-2xl flex items-center justify-center">
            
            {viewMode === 'interactive' ? (
              <>
                {activeStep === 0 ? (
                  <div className="absolute inset-0 bg-zinc-950 rounded-2xl overflow-hidden animate-fade-in z-25">
                    <LoopingVideoPlayer src={ariaVideo} startTime={32} endTime={37} />
                  </div>
                ) : (
                  <>
                    <canvas 
                      ref={canvasRef}
                      onMouseMove={handleMouseMove}
                      className="absolute inset-0 cursor-crosshair animate-fade-in"
                    />

                    {/* Rotated lateral context helper ticks */}
                    <div className="absolute top-3 left-4 text-xs text-zinc-400 tracking-wider">
                      ROTATING_ENGINE_3D: {(rotationAngle * (180/Math.PI)).toFixed(1)}&deg;
                    </div>

                    {/* Simulated Live Float Tooltip */}
                    {hoveredPoint && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        key={hoveredPoint.z}
                        className="absolute right-4 bottom-4 bg-[#0F0F11]/90 border border-[#C5A059]/20 p-3.5 rounded-lg text-xs text-zinc-300 pointer-events-none max-w-[210px] z-20 shadow-2xl"
                      >
                        <div className="text-[#C5A059] font-bold uppercase tracking-wider mb-1">
                          // POINT INFO
                        </div>
                        <div>ID: @world/pts[{Math.floor(Math.random() * 900000) + 100000}]</div>
                        <div>COORD: [{hoveredPoint.x}, {hoveredPoint.y}, {hoveredPoint.z}]</div>
                        <div className="flex items-center gap-1.5 mt-1 pt-1 border-t border-white/5">
                          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: hoveredPoint.color }} />
                          <span className="text-white truncate font-sans text-xs">{hoveredPoint.label}</span>
                        </div>
                      </motion.div>
                    )}
                  </>
                )}
              </>
            ) : (
              <div className="absolute inset-0 bg-zinc-950 flex items-center justify-center overflow-hidden">
                <img 
                  src={pointcloudImg} 
                  alt="Real Point Cloud Scan" 
                  className="w-full h-full object-cover opacity-90 transition-all duration-700 hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                
                {/* Dark Vignette overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent pointer-events-none" />
              </div>
            )}
          </div>

          {/* Immersive point controls bar (Visible only from Slide 2 to 4) */}
          {activeStep >= 1 && activeStep <= 3 && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="w-full bg-[#0E0E12]/80 backdrop-blur-xl border border-[#C5A059]/20 p-4 rounded-xl shadow-2xl relative overflow-hidden"
            >
              {/* Background ambient glow behind controls */}
              <div className="absolute -right-20 -top-20 w-48 h-48 bg-[#C5A059]/5 rounded-full blur-3xl pointer-events-none" />

              <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-stretch md:items-center justify-between">
                {/* Right Panel: Sliders controls */}
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
                  
                  {/* Slider 1: Point Size */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-zinc-400 font-mono tracking-wider uppercase flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] opacity-75" />
                        Dimensione Punti
                      </span>
                      <span className="text-[#C5A059] font-mono font-bold bg-[#C5A059]/15 px-2 py-0.5 rounded border border-[#C5A059]/20">
                        {pointSize}px
                      </span>
                    </div>
                    <div className="relative flex items-center h-5">
                      <input
                        type="range"
                        min="1"
                        max="5"
                        value={pointSize}
                        onChange={(e) => setPointSize(parseInt(e.target.value))}
                        className="w-full appearance-none h-1.5 bg-zinc-900 rounded-lg cursor-pointer focus:outline-none accent-transparent
                          [&::-webkit-slider-runnable-track]:h-1.5 [&::-webkit-slider-runnable-track]:bg-zinc-900 [&::-webkit-slider-runnable-track]:rounded-lg
                          [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#C5A059] [&::-webkit-slider-thumb]:-mt-[5px] [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(197,160,89,0.6)] [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-125
                          [&::-moz-range-track]:h-1.5 [&::-moz-range-track]:bg-zinc-900 [&::-moz-range-track]:rounded-lg
                          [&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[#C5A059] [&::-moz-range-thumb]:shadow-[0_0_10px_rgba(197,160,89,0.6)] [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:transition-transform [&::-moz-range-thumb]:hover:scale-125
                        "
                      />
                    </div>
                  </div>

                  {/* Slider 2: Density */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-zinc-400 font-mono tracking-wider uppercase flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] opacity-75" />
                        Densità Nuvola
                      </span>
                      <span className="text-[#C5A059] font-mono font-bold bg-[#C5A059]/15 px-2 py-0.5 rounded border border-[#C5A059]/20">
                        {density} pts
                      </span>
                    </div>
                    <div className="relative flex items-center h-5">
                      <input
                        type="range"
                        min="50"
                        max="500"
                        value={density}
                        onChange={(e) => setDensity(parseInt(e.target.value))}
                        className="w-full appearance-none h-1.5 bg-zinc-900 rounded-lg cursor-pointer focus:outline-none accent-transparent
                          [&::-webkit-slider-runnable-track]:h-1.5 [&::-webkit-slider-runnable-track]:bg-zinc-900 [&::-webkit-slider-runnable-track]:rounded-lg
                          [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#C5A059] [&::-webkit-slider-thumb]:-mt-[5px] [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(197,160,89,0.6)] [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-125
                          [&::-moz-range-track]:h-1.5 [&::-moz-range-track]:bg-zinc-900 [&::-moz-range-track]:rounded-lg
                          [&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[#C5A059] [&::-moz-range-thumb]:shadow-[0_0_10px_rgba(197,160,89,0.6)] [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:transition-transform [&::-moz-range-thumb]:hover:scale-125
                        "
                      />
                    </div>
                  </div>

                </div>
              </div>
            </motion.div>
          )}
        </div>

      </div>
    </div>
  );
};