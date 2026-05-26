"use client";

import React, { useState, useEffect } from 'react';
import { 
  Wind, BarChart2, ShieldCheck, Cloudy, Cloud, 
  Target, Eye, Sliders, Columns, Gauge, Activity, 
  Tornado, Leaf, Shield, ChevronRight
} from 'lucide-react';
import { useRouter } from 'next/navigation';

// --- DATA STRUCTURE & COORDINATES (Mapped to 1600x900 SVG space) ---
const MINDMAP_DATA = {
  center: { x: 800, y: 450 },
  branches: [
    {
      id: 'cps',
      label: 'CPS | Combined Performance Superior',
      color: '#005eb8', // Filtrona Blue variant
      icon: Wind,
      x: 520, y: 225,
      delay: 0,
      subs: [
        { label: 'Technology: Cross-flow', icon: Wind, x: 200, y: 135 },
        { label: 'Benefit: Increased tar retention', icon: BarChart2, x: 200, y: 225 },
        { label: 'Regulation: Tar compliance', icon: ShieldCheck, x: 200, y: 315 },
      ]
    },
    {
      id: 'cor',
      label: 'COR | Carbon Monoxide Reducing',
      color: '#009639', // Green
      icon: Cloudy,
      x: 1080, y: 225,
      delay: 0.2,
      subs: [
        { label: 'Technology: Tip ventilation', icon: Wind, x: 1400, y: 135 },
        { label: 'Benefit: Reduced CO in smoke', icon: Cloud, x: 1400, y: 225 },
        { label: 'Regulation: CO compliance', icon: ShieldCheck, x: 1400, y: 315 },
      ]
    },
    {
      id: 'ccf',
      label: 'CCF | Coaxial Core Filter',
      color: '#702082', // Purple
      icon: Target,
      x: 480, y: 650,
      delay: 0.4,
      subs: [
        { label: 'Technology: Dual-layer coaxial core', icon: Target, x: 180, y: 560 },
        { label: 'Benefit: Extreme visual distinction', icon: Eye, x: 180, y: 650 },
        { label: 'Feature: Customisable tow', icon: Sliders, x: 180, y: 740 },
      ]
    },
    {
      id: 'corinthian',
      label: 'Corinthian™ | Precision-Formed',
      color: '#ea7600', // Orange
      icon: Columns,
      x: 1120, y: 650,
      delay: 0.6,
      subs: [
        { label: 'Tech: Patented flutes in acetate', icon: Columns, x: 1420, y: 560 },
        { label: 'Benefit: Consistent draw resistance', icon: Gauge, x: 1420, y: 650 },
        { label: 'Feature: High ventilation performance', icon: Activity, x: 1420, y: 740 },
      ]
    },
    {
      id: 'vortex',
      label: 'Vortex™ | Twist Inside',
      color: '#00a3e0', // Teal
      icon: Tornado,
      x: 800, y: 760,
      delay: 0.8,
      subs: [
        { label: 'Technology: Helical spiral structure', icon: Tornado, x: 500, y: 860 },
        { label: 'Benefit: Enhanced flavour delivery', icon: Leaf, x: 800, y: 860 },
        { label: 'Benefit: Reduced harshness', icon: Shield, x: 1100, y: 860 },
      ]
    }
  ]
};

export default function FilterTypesMindMap() {
  const router = useRouter();
  const [stage, setStage] = useState(0); // 0: init, 1: center, 2: tag, 3: lines, 4: nodes, 5: interactive
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Responsive check
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Animation Sequence Choreography
  useEffect(() => {
    const timeouts = [
      setTimeout(() => setStage(1), 100),   // Center pulse
      setTimeout(() => setStage(2), 500),   // Tag drops in (+0.4s)
      setTimeout(() => setStage(3), 1000),  // Lines extend (+0.5s)
      setTimeout(() => setStage(4), 1600),  // Nodes appear (+0.6s)
      setTimeout(() => setStage(5), 2500)   // Fully Interactive
    ];
    return () => timeouts.forEach(clearTimeout);
  }, []);

  const generateMainPath = (branch: any) => {
    const cx = MINDMAP_DATA.center.x;
    const cy = MINDMAP_DATA.center.y;
    // Cubic bezier to make a nice flowing curve from center to node
    const offset = branch.y < cy ? -100 : 100;
    return `M ${cx} ${cy} C ${cx} ${cy + offset}, ${branch.x} ${cy - offset}, ${branch.x} ${branch.y}`;
  };

  const generateSubPath = (branch: any, sub: any) => {
    // Determine path based on which side of the screen it is
    if (branch.id === 'vortex') {
      return `M ${branch.x} ${branch.y} C ${branch.x} ${branch.y + 50}, ${sub.x} ${branch.y + 20}, ${sub.x} ${sub.y}`;
    }
    const isLeft = branch.x < 800;
    const controlX = isLeft ? branch.x - 100 : branch.x + 100;
    return `M ${branch.x} ${branch.y} C ${controlX} ${branch.y}, ${controlX} ${sub.y}, ${sub.x} ${sub.y}`;
  };

  return (
    <div className="relative w-full font-sans overflow-hidden text-slate-800 rounded-2xl border border-[var(--border-default)]">
      
      {/* Global Style overrides for specific animations */}
      <style dangerouslySetInnerHTML={{__html: `
        .line-draw {
          stroke-dasharray: 1200;
          stroke-dashoffset: 1200;
          animation: drawLine 1s ease-out forwards;
        }
        .sub-line-draw {
          stroke-dasharray: 600;
          stroke-dashoffset: 600;
          animation: drawLine 0.6s ease-out forwards;
        }
        @keyframes drawLine {
          to { stroke-dashoffset: 0; }
        }
        .animate-pop {
          animation: popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
        @keyframes popIn {
          0% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
          100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
        }
        /* Mobile Accordion Smoothness */
        .accordion-content {
          transition: max-height 0.4s ease-in-out, opacity 0.4s ease-in-out;
          max-height: 0;
          opacity: 0;
          overflow: hidden;
        }
        .accordion-content.open {
          max-height: 400px;
          opacity: 1;
        }
      `}} />

      {/* Desktop Canvas */}
      {!isMobile && (
        <div className="relative w-full aspect-[16/9] min-h-[500px] flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100">
          <div className="relative w-full h-full max-w-7xl">
            
            {/* SVG Layer for Lines */}
            <svg viewBox="0 0 1600 900" className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none">
              
              {/* Main Branch Lines */}
              {stage >= 3 && MINDMAP_DATA.branches.map((branch, i) => (
                <path 
                  key={`line-${branch.id}`}
                  d={generateMainPath(branch)}
                  fill="none"
                  stroke={branch.color}
                  strokeWidth="4"
                  strokeLinecap="round"
                  className="line-draw"
                  style={{ animationDelay: `${branch.delay}s` }}
                />
              ))}

              {/* Sub-node Connection Lines */}
              {MINDMAP_DATA.branches.map(branch => (
                activeNode === branch.id && branch.subs.map((sub, i) => (
                  <path 
                    key={`subline-${branch.id}-${i}`}
                    d={generateSubPath(branch, sub)}
                    fill="none"
                    stroke={branch.color}
                    strokeWidth="2"
                    strokeOpacity="0.4"
                    strokeDasharray="4 4"
                    strokeLinecap="round"
                    className="sub-line-draw"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  />
                ))
              ))}
            </svg>

            {/* Central Node */}
            <div 
              className={`absolute left-[50%] top-[50%] z-30 transition-all duration-1000 flex flex-col items-center justify-center
                ${stage >= 1 ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}
              `}
              style={{ transform: 'translate(-50%, -50%)' }}
            >
              {/* 'Performance Range' Tag */}
              <div className={`
                  bg-white text-[#0033a0] font-bold text-sm tracking-wider py-1.5 px-6 rounded-full shadow-md border border-[#0033a0]/20 mb-3
                  transition-all duration-700 ease-out transform
                  ${stage >= 2 ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'}
                `}>
                PERFORMANCE RANGE
              </div>
              
              <div className="w-56 h-56 bg-white rounded-full shadow-[0_0_40px_rgba(0,51,160,0.15)] border-4 border-slate-100 flex flex-col items-center justify-center relative group">
                <div className="absolute inset-0 rounded-full border border-[#0033a0]/10 animate-[ping_3s_ease-in-out_infinite]" />
                <p className="text-slate-500 text-xs font-semibold mb-2 text-center uppercase tracking-wide px-4">
                  Regulation-Compliant<br/>Filters
                </p>
                <div className="flex items-center gap-2">
                  {/* Fake Filtrona Logo Icon */}
                  <div className="flex flex-col gap-[3px]">
                     <div className="w-8 h-[5px] bg-[#0033a0] rounded-sm transform -skew-x-12" />
                     <div className="w-10 h-[5px] bg-[#0033a0] rounded-sm transform -skew-x-12" />
                     <div className="w-8 h-[5px] bg-[#0033a0] rounded-sm transform -skew-x-12" />
                  </div>
                  <h2 className="text-4xl font-extrabold text-[#0033a0] tracking-tight">Filtrona</h2>
                </div>
              </div>
            </div>

            {/* Branch Nodes */}
            {MINDMAP_DATA.branches.map((branch) => {
              const Icon = branch.icon;
              const isVisible = stage >= 4;
              const isActive = activeNode === branch.id;

              return (
                <div key={branch.id}>
                  {/* Main Pill */}
                  <button
                    onMouseEnter={() => stage >= 5 && setActiveNode(branch.id)}
                    onMouseLeave={() => stage >= 5 && setActiveNode(null)}
                    onClick={() => {
                      if (stage >= 5) {
                        router.push(`/topics/filter-types/slides`);
                      }
                    }}
                    className={`
                      absolute z-20 flex items-center gap-3 px-5 py-3 rounded-full shadow-lg border-2 cursor-pointer
                      hover:shadow-xl transition-all duration-300
                      ${isVisible ? 'animate-pop' : 'opacity-0 hidden'}
                      ${isActive ? 'scale-110 z-40' : 'hover:scale-105'}
                    `}
                    style={{
                      left: `${branch.x / 16}%`, 
                      top: `${branch.y / 9}%`,
                      animationDelay: `${branch.delay}s`,
                      backgroundColor: 'white',
                      borderColor: branch.color,
                      boxShadow: isActive ? `0 10px 30px -10px ${branch.color}80` : ''
                    }}
                  >
                    <div className="p-2 rounded-full text-white" style={{ backgroundColor: branch.color }}>
                      <Icon size={20} strokeWidth={2.5} />
                    </div>
                    <span className="font-bold text-slate-800 text-sm max-w-[140px] text-left leading-tight">
                      {branch.label.split(' | ')[0]} <span className="font-normal text-slate-500 block text-xs">{branch.label.split(' | ')[1]}</span>
                    </span>
                  </button>

                  {/* Sub Nodes */}
                  {branch.subs.map((sub, i) => {
                    const SubIcon = sub.icon;
                    return (
                      <div
                        key={`${branch.id}-sub-${i}`}
                        className={`
                          absolute z-10 flex items-center gap-3 px-4 py-2 bg-white rounded-full shadow-md border border-slate-200 pointer-events-none
                          transition-all duration-500
                        `}
                        style={{
                          left: `${sub.x / 16}%`, 
                          top: `${sub.y / 9}%`,
                          transform: `translate(-50%, -50%) scale(${isActive ? 1 : 0.8})`,
                          opacity: isActive ? 1 : 0,
                          transitionDelay: isActive ? `${i * 0.1}s` : '0s'
                        }}
                      >
                         <div className="w-6 h-6 rounded-full flex items-center justify-center border" style={{ color: branch.color, borderColor: `${branch.color}40`, backgroundColor: `${branch.color}10` }}>
                            <SubIcon size={12} />
                         </div>
                         <span className="text-xs font-medium text-slate-600 whitespace-nowrap">
                            {sub.label}
                         </span>
                      </div>
                    )
                  })}
                </div>
              );
            })}

          </div>
        </div>
      )}

      {/* Mobile Canvas (Vertical Accordion Tree) */}
      {isMobile && (
        <div className="p-4 pt-8 bg-slate-50 pb-8">
          
          {/* Central Header */}
          <div className={`flex flex-col items-center mb-10 transition-all duration-700 ${stage >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className={`bg-white text-[#0033a0] font-bold text-xs tracking-wider py-1 px-4 rounded-full shadow-sm border border-[#0033a0]/20 mb-3 transition-all duration-700 delay-300 ${stage >= 2 ? 'opacity-100' : 'opacity-0'}`}>
              PERFORMANCE RANGE
            </div>
            <div className="w-40 h-40 bg-white rounded-full shadow-lg border-2 border-slate-100 flex flex-col items-center justify-center relative">
               <p className="text-slate-500 text-[10px] font-semibold mb-1 text-center uppercase tracking-wide">
                  Regulation-Compliant
               </p>
               <div className="flex items-center gap-1.5">
                  <div className="flex flex-col gap-[2px]">
                     <div className="w-5 h-[3px] bg-[#0033a0] rounded-sm transform -skew-x-12" />
                     <div className="w-6 h-[3px] bg-[#0033a0] rounded-sm transform -skew-x-12" />
                     <div className="w-5 h-[3px] bg-[#0033a0] rounded-sm transform -skew-x-12" />
                  </div>
                  <h2 className="text-2xl font-extrabold text-[#0033a0] tracking-tight">Filtrona</h2>
                </div>
            </div>
            <div className={`w-0.5 h-12 bg-slate-300 mt-4 transition-all duration-1000 delay-500 ${stage >= 3 ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0 origin-top'}`}></div>
          </div>

          {/* Branch Accordions */}
          <div className="flex flex-col gap-4 relative z-10 px-2">
            {MINDMAP_DATA.branches.map((branch, idx) => {
              const Icon = branch.icon;
              const isActive = activeNode === branch.id;
              const isVisible = stage >= 4;
              
              return (
                <div 
                  key={branch.id} 
                  className={`transition-all duration-500 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                  style={{ transitionDelay: `${idx * 0.15}s` }}
                >
                  <button
                    onClick={() => setActiveNode(isActive ? null : branch.id)}
                    className="w-full bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex items-center justify-between relative overflow-hidden"
                  >
                    <div className="absolute left-0 top-0 bottom-0 w-2" style={{ backgroundColor: branch.color }}></div>
                    <div className="flex items-center gap-4 ml-2 text-left">
                      <div className="p-2.5 rounded-full text-white" style={{ backgroundColor: branch.color }}>
                        <Icon size={20} />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-800 leading-tight">{branch.label.split(' | ')[0]}</h3>
                        <p className="text-xs text-slate-500">{branch.label.split(' | ')[1]}</p>
                      </div>
                    </div>
                    <div className={`transition-transform duration-300 ${isActive ? 'rotate-90' : 'rotate-0'}`}>
                      <ChevronRight className="text-slate-400" />
                    </div>
                  </button>
                  
                  {/* Sub-node Content (Accordion) */}
                  <div className={`accordion-content ${isActive ? 'open mt-2' : ''}`}>
                    <div className="bg-slate-100 rounded-xl p-4 flex flex-col gap-3 border border-slate-200 ml-4 relative">
                       {/* Connector Line */}
                       <div className="absolute -left-4 top-0 bottom-6 w-px bg-slate-300"></div>
                      
                      {branch.subs.map((sub, i) => {
                        const SubIcon = sub.icon;
                        return (
                          <div key={i} className="flex items-center gap-3 relative">
                            <div className="absolute -left-4 top-1/2 w-4 h-px bg-slate-300"></div>
                            <div className="w-6 h-6 rounded-full flex items-center justify-center bg-white border shadow-sm" style={{ color: branch.color, borderColor: `${branch.color}30` }}>
                              <SubIcon size={12} />
                            </div>
                            <span className="text-xs font-medium text-slate-700">{sub.label}</span>
                          </div>
                        )
                      })}
                      
                      <button 
                        onClick={() => {
                          router.push(`/topics/filter-types/slides`);
                        }}
                        className="mt-3 w-full py-2.5 rounded-lg text-white font-semibold text-sm flex items-center justify-center gap-2 transition-transform active:scale-95 cursor-pointer"
                        style={{ backgroundColor: branch.color }}
                      >
                        Explore Module <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Guide Toast (Desktop only) */}
      {!isMobile && stage === 5 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 animate-[bounce_2s_infinite]">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
          <span className="text-sm font-medium">Hover to preview, Click to explore filter details</span>
        </div>
      )}

    </div>
  );
}
