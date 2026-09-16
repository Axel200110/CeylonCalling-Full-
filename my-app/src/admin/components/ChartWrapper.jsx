import React, { useState } from "react";

const ChartWrapper = ({ type = "area", title, data, categories, color = "blue" }) => {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  // SVG dimensions
  const width = 500;
  const height = 200;
  const padding = 30;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  // Find max value to scale chart appropriately
  const maxValue = Math.max(...data, 100);

  // Calculate coordinates for points
  const points = data.map((val, idx) => {
    const x = padding + (idx / (data.length - 1)) * chartWidth;
    const y = padding + chartHeight - (val / maxValue) * chartHeight;
    return { x, y, value: val, category: categories[idx] };
  });

  // Generate SVG path for line/area
  const pathD = points.reduce((acc, p, idx) => {
    return idx === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
  }, "");

  // Generate closed path for area gradient fill
  const areaD = points.length > 0
    ? `${pathD} L ${points[points.length - 1].x} ${padding + chartHeight} L ${points[0].x} ${padding + chartHeight} Z`
    : "";

  // Color schemes
  const colorThemes = {
    blue: {
      stroke: "#60a5fa", // blue-400
      fillGrad: "url(#blueGrad)",
      glow: "shadow-blue-500/10",
      dot: "fill-blue-400",
      accent: "bg-blue-500",
      stopStart: "#3b82f6",
      stopEnd: "#1d4ed8"
    },
    green: {
      stroke: "#34d399", // emerald-400
      fillGrad: "url(#greenGrad)",
      glow: "shadow-emerald-500/10",
      dot: "fill-emerald-400",
      accent: "bg-emerald-500",
      stopStart: "#10b981",
      stopEnd: "#047857"
    },
    amber: {
      stroke: "#fbbf24", // amber-400
      fillGrad: "url(#amberGrad)",
      glow: "shadow-amber-500/10",
      dot: "fill-amber-400",
      accent: "bg-amber-500",
      stopStart: "#f59e0b",
      stopEnd: "#b45309"
    },
    purple: {
      stroke: "#c084fc", // purple-400
      fillGrad: "url(#purpleGrad)",
      glow: "shadow-purple-500/10",
      dot: "fill-purple-400",
      accent: "bg-purple-500",
      stopStart: "#a855f7",
      stopEnd: "#6b21a8"
    }
  };

  const theme = colorThemes[color] || colorThemes.blue;

  return (
    <div className={`rounded-2xl border border-gray-800 bg-gray-900/50 p-6 shadow-lg backdrop-blur-xl ${theme.glow}`}>
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-base font-semibold text-white">{title}</h4>
        {hoveredIdx !== null && (
          <div className="flex items-center gap-2 rounded-lg bg-gray-800 px-2.5 py-1 text-xs text-white border border-gray-700 animate-fadeIn">
            <span className={`h-2 w-2 rounded-full ${theme.accent}`} />
            <span className="font-medium">{categories[hoveredIdx]}:</span>
            <span className="font-bold">{data[hoveredIdx]}</span>
          </div>
        )}
      </div>

      <div className="relative">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
          <defs>
            {/* Gradients */}
            <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={theme.stopStart} stopOpacity="0.4" />
              <stop offset="100%" stopColor={theme.stopEnd} stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="greenGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={theme.stopStart} stopOpacity="0.4" />
              <stop offset="100%" stopColor={theme.stopEnd} stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="amberGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={theme.stopStart} stopOpacity="0.4" />
              <stop offset="100%" stopColor={theme.stopEnd} stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="purpleGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={theme.stopStart} stopOpacity="0.4" />
              <stop offset="100%" stopColor={theme.stopEnd} stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line
            x1={padding}
            y1={padding}
            x2={width - padding}
            y2={padding}
            stroke="#1f2937"
            strokeDasharray="4 4"
          />
          <line
            x1={padding}
            y1={padding + chartHeight / 2}
            x2={width - padding}
            y2={padding + chartHeight / 2}
            stroke="#1f2937"
            strokeDasharray="4 4"
          />
          <line
            x1={padding}
            y1={padding + chartHeight}
            x2={width - padding}
            y2={padding + chartHeight}
            stroke="#374151"
          />

          {/* Area & Line */}
          {type === "area" && (
            <>
              {/* Closed area gradient fill */}
              <path d={areaD} fill={theme.fillGrad} />
              {/* Stroke line */}
              <path
                d={pathD}
                fill="none"
                stroke={theme.stroke}
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </>
          )}

          {/* Bar Chart Type */}
          {type === "bar" &&
            points.map((p, idx) => {
              const barWidth = Math.min(24, chartWidth / points.length - 12);
              const barHeight = chartHeight - (p.y - padding);
              return (
                <rect
                  key={idx}
                  x={p.x - barWidth / 2}
                  y={p.y}
                  width={barWidth}
                  height={barHeight}
                  rx="4"
                  className="transition-all duration-300 cursor-pointer hover:opacity-80"
                  fill={hoveredIdx === idx ? theme.stroke : theme.stopStart}
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                />
              );
            })}

          {/* Interactivity Dots for Area/Line Chart */}
          {type === "area" &&
            points.map((p, idx) => (
              <g key={idx}>
                {/* Hover hotspot */}
                <circle
                  cx={p.x}
                  cy={p.y}
                  r="12"
                  fill="transparent"
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                />
                {/* Visual dot */}
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={hoveredIdx === idx ? "6" : "4"}
                  className={`transition-all duration-200 pointer-events-none ${theme.dot}`}
                  stroke="#111827"
                  strokeWidth="2"
                />
              </g>
            ))}

          {/* X Axis Labels */}
          {points.map((p, idx) => {
            // Draw every other label on small widths or all if small dataset
            if (points.length > 8 && idx % 2 !== 0) return null;
            return (
              <text
                key={idx}
                x={p.x}
                y={height - 8}
                textAnchor="middle"
                fill="#9ca3af"
                fontSize="10"
                className="font-medium pointer-events-none"
              >
                {p.category}
              </text>
            );
          })}
        </svg>
      </div>
    </div>
  );
};

export default ChartWrapper;
