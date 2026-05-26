"use client";

const ACCENT_COLORS: Record<string, string> = {
  mint: "#00B380",
  violet: "#6B47FF",
  orange: "#E89422",
  blue: "#2B92E8",
};

interface FilterVisualProps {
  visualType: "cps" | "cor" | "ccf" | "corinthian" | "vortex";
  accent: "mint" | "violet" | "orange" | "blue";
  isActive: boolean;
}

/* ── CPS: Cross-flow radial fibers with inward arrows ──────────── */
function CPSVisual({ color }: { color: string }) {
  const fibers = Array.from({ length: 36 }, (_, i) => i * 10);
  const arrows = [0, 60, 120, 180, 240, 300];
  return (
    <g>
      {/* Outer ring */}
      <circle cx="200" cy="200" r="170" fill="none" stroke={color} strokeWidth="6" opacity="0.3" />
      <circle cx="200" cy="200" r="160" fill="none" stroke={color} strokeWidth="2" opacity="0.15" />
      {/* Inner fiber texture — radial lines */}
      {fibers.map((deg) => {
        const rad = (deg * Math.PI) / 180;
        const x1 = 200 + Math.cos(rad) * 40;
        const y1 = 200 + Math.sin(rad) * 40;
        const x2 = 200 + Math.cos(rad) * 155;
        const y2 = 200 + Math.sin(rad) * 155;
        return (
          <line key={deg} x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="1" opacity="0.12" />
        );
      })}
      {/* Cross-flow arrows pointing inward */}
      {arrows.map((deg) => {
        const rad = (deg * Math.PI) / 180;
        const ox = 200 + Math.cos(rad) * 140;
        const oy = 200 + Math.sin(rad) * 140;
        const ix = 200 + Math.cos(rad) * 90;
        const iy = 200 + Math.sin(rad) * 90;
        const aRad1 = ((deg + 160) * Math.PI) / 180;
        const aRad2 = ((deg + 200) * Math.PI) / 180;
        const ax1 = ix + Math.cos(aRad1) * 14;
        const ay1 = iy + Math.sin(aRad1) * 14;
        const ax2 = ix + Math.cos(aRad2) * 14;
        const ay2 = iy + Math.sin(aRad2) * 14;
        return (
          <g key={deg}>
            <line x1={ox} y1={oy} x2={ix} y2={iy} stroke={color} strokeWidth="2.5" opacity="0.6" />
            <polygon points={`${ix},${iy} ${ax1},${ay1} ${ax2},${ay2}`} fill={color} opacity="0.6" />
          </g>
        );
      })}
      {/* Center accent circle */}
      <circle cx="200" cy="200" r="35" fill={color} opacity="0.08" />
      <circle cx="200" cy="200" r="35" fill="none" stroke={color} strokeWidth="2" opacity="0.4" />
      <text x="200" y="207" textAnchor="middle" fill={color} fontSize="14" fontWeight="700" opacity="0.7">CPS</text>
    </g>
  );
}

/* ── COR: Ventilation perforations around the perimeter ────────── */
function CORVisual({ color }: { color: string }) {
  const holes = Array.from({ length: 24 }, (_, i) => i * 15);
  const airArrows = [0, 90, 180, 270];
  return (
    <g>
      <circle cx="200" cy="200" r="170" fill="none" stroke={color} strokeWidth="6" opacity="0.3" />
      <circle cx="200" cy="200" r="140" fill={color} opacity="0.04" />
      <circle cx="200" cy="200" r="140" fill="none" stroke={color} strokeWidth="1.5" opacity="0.2" />
      {/* Ventilation holes */}
      {holes.map((deg) => {
        const rad = (deg * Math.PI) / 180;
        const x = 200 + Math.cos(rad) * 155;
        const y = 200 + Math.sin(rad) * 155;
        return <circle key={deg} cx={x} cy={y} r="5" fill={color} opacity="0.35" />;
      })}
      {/* Air entry arrows */}
      {airArrows.map((deg) => {
        const rad = (deg * Math.PI) / 180;
        const ox = 200 + Math.cos(rad) * 185;
        const oy = 200 + Math.sin(rad) * 185;
        const ix = 200 + Math.cos(rad) * 155;
        const iy = 200 + Math.sin(rad) * 155;
        return (
          <g key={deg}>
            <line x1={ox} y1={oy} x2={ix} y2={iy} stroke={color} strokeWidth="2" opacity="0.5" strokeDasharray="4 3" />
            <circle cx={ix} cy={iy} r="3" fill={color} opacity="0.5" />
          </g>
        );
      })}
      {/* Center */}
      <circle cx="200" cy="200" r="50" fill="none" stroke={color} strokeWidth="2" opacity="0.25" strokeDasharray="6 4" />
      <text x="200" y="207" textAnchor="middle" fill={color} fontSize="14" fontWeight="700" opacity="0.7">COR</text>
    </g>
  );
}

/* ── CCF: Concentric rings — orange outer, contrasting inner ───── */
function CCFVisual({ color }: { color: string }) {
  const innerColor = "#6B47FF";
  return (
    <g>
      {/* Outer ring */}
      <circle cx="200" cy="200" r="170" fill="none" stroke={color} strokeWidth="6" opacity="0.3" />
      <circle cx="200" cy="200" r="150" fill={color} opacity="0.08" />
      <circle cx="200" cy="200" r="150" fill="none" stroke={color} strokeWidth="3" opacity="0.4" />
      {/* Middle separation ring */}
      <circle cx="200" cy="200" r="100" fill="none" stroke={color} strokeWidth="2" opacity="0.3" />
      {/* Inner coloured core */}
      <circle cx="200" cy="200" r="80" fill={innerColor} opacity="0.12" />
      <circle cx="200" cy="200" r="80" fill="none" stroke={innerColor} strokeWidth="4" opacity="0.5" />
      <circle cx="200" cy="200" r="60" fill={innerColor} opacity="0.06" />
      <circle cx="200" cy="200" r="60" fill="none" stroke={innerColor} strokeWidth="1.5" opacity="0.3" />
      {/* Radial connectors showing two-part structure */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
        const rad = (deg * Math.PI) / 180;
        const x1 = 200 + Math.cos(rad) * 82;
        const y1 = 200 + Math.sin(rad) * 82;
        const x2 = 200 + Math.cos(rad) * 148;
        const y2 = 200 + Math.sin(rad) * 148;
        return <line key={deg} x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="1" opacity="0.1" />;
      })}
      <text x="200" y="207" textAnchor="middle" fill={innerColor} fontSize="13" fontWeight="700" opacity="0.7">CCF</text>
    </g>
  );
}

/* ── Corinthian: Fluted wedge cutouts around the perimeter ─────── */
function CorinthianVisual({ color }: { color: string }) {
  const flutes = Array.from({ length: 8 }, (_, i) => i * 45);
  return (
    <g>
      <circle cx="200" cy="200" r="170" fill="none" stroke={color} strokeWidth="6" opacity="0.3" />
      <circle cx="200" cy="200" r="155" fill={color} opacity="0.06" />
      {/* Fluted wedges */}
      {flutes.map((deg) => {
        const startRad = ((deg - 12) * Math.PI) / 180;
        const endRad = ((deg + 12) * Math.PI) / 180;
        const outerR = 155;
        const innerR = 100;
        const x1 = 200 + Math.cos(startRad) * outerR;
        const y1 = 200 + Math.sin(startRad) * outerR;
        const x2 = 200 + Math.cos(endRad) * outerR;
        const y2 = 200 + Math.sin(endRad) * outerR;
        const x3 = 200 + Math.cos(endRad) * innerR;
        const y3 = 200 + Math.sin(endRad) * innerR;
        const x4 = 200 + Math.cos(startRad) * innerR;
        const y4 = 200 + Math.sin(startRad) * innerR;
        return (
          <g key={deg}>
            <path
              d={`M ${x4} ${y4} L ${x1} ${y1} A ${outerR} ${outerR} 0 0 1 ${x2} ${y2} L ${x3} ${y3} A ${innerR} ${innerR} 0 0 0 ${x4} ${y4}`}
              fill={color}
              opacity="0.15"
              stroke={color}
              strokeWidth="1.5"
            />
          </g>
        );
      })}
      {/* Inner solid core */}
      <circle cx="200" cy="200" r="90" fill="none" stroke={color} strokeWidth="2" opacity="0.3" />
      <circle cx="200" cy="200" r="45" fill={color} opacity="0.06" />
      <circle cx="200" cy="200" r="45" fill="none" stroke={color} strokeWidth="2" opacity="0.35" />
      <text x="200" y="195" textAnchor="middle" fill={color} fontSize="10" fontWeight="600" opacity="0.6">COR</text>
      <text x="200" y="215" textAnchor="middle" fill={color} fontSize="10" fontWeight="600" opacity="0.6">INTHIAN</text>
    </g>
  );
}

/* ── Vortex: Spiral swirl pattern ──────────────────────────────── */
function VortexVisual({ color }: { color: string }) {
  // Generate spiral path
  const spiralPoints: string[] = [];
  for (let t = 0; t < 4 * Math.PI; t += 0.1) {
    const r = 20 + t * 10;
    if (r > 150) break;
    const x = 200 + Math.cos(t) * r;
    const y = 200 + Math.sin(t) * r;
    spiralPoints.push(`${x},${y}`);
  }
  const spiralPath = `M ${spiralPoints.join(" L ")}`;

  return (
    <g>
      <circle cx="200" cy="200" r="170" fill="none" stroke={color} strokeWidth="6" opacity="0.3" />
      <circle cx="200" cy="200" r="155" fill={color} opacity="0.04" />
      {/* Spiral */}
      <path d={spiralPath} fill="none" stroke={color} strokeWidth="3" opacity="0.35" strokeLinecap="round" />
      {/* Second spiral offset */}
      <g transform="rotate(180 200 200)">
        <path d={spiralPath} fill="none" stroke={color} strokeWidth="2" opacity="0.2" strokeLinecap="round" />
      </g>
      {/* Center twist node */}
      <circle cx="200" cy="200" r="20" fill={color} opacity="0.1" />
      <circle cx="200" cy="200" r="20" fill="none" stroke={color} strokeWidth="2" opacity="0.4" />
      {/* Outer accent ring */}
      <circle cx="200" cy="200" r="155" fill="none" stroke={color} strokeWidth="1.5" opacity="0.2" />
      <text x="200" y="207" textAnchor="middle" fill={color} fontSize="11" fontWeight="700" opacity="0.6">VORTEX</text>
    </g>
  );
}

/* ── Main Component ────────────────────────────────────────────── */
export default function FilterVisual({
  visualType,
  accent,
  isActive,
}: FilterVisualProps) {
  const color = ACCENT_COLORS[accent];

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: "100%", maxWidth: 400, aspectRatio: "1" }}
    >
      {/* Radial glow behind */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: `radial-gradient(circle at center, ${color}18 0%, transparent 70%)`,
          filter: `drop-shadow(0 0 40px ${color}22)`,
        }}
      />

      <svg
        viewBox="0 0 400 400"
        className="relative z-10 w-full h-full"
        style={{
          animation: isActive ? "filter-rotate 60s linear infinite" : "none",
          filter: `drop-shadow(0 8px 32px ${color}20)`,
        }}
        role="img"
        aria-label={`${visualType.toUpperCase()} filter cross-section illustration`}
      >
        {visualType === "cps" && <CPSVisual color={color} />}
        {visualType === "cor" && <CORVisual color={color} />}
        {visualType === "ccf" && <CCFVisual color={color} />}
        {visualType === "corinthian" && <CorinthianVisual color={color} />}
        {visualType === "vortex" && <VortexVisual color={color} />}
      </svg>

      {/* CSS rotation keyframes */}
      <style jsx>{`
        @keyframes filter-rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          svg { animation: none !important; }
        }
      `}</style>
    </div>
  );
}
