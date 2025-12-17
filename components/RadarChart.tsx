import React from 'react';
import { ComparisonResult } from '../types';

interface RadarChartProps {
  data: ComparisonResult;
}

const COLORS = [
  '#38bdf8', // Sky 400
  '#f472b6', // Pink 400
  '#a78bfa', // Purple 400
  '#34d399', // Emerald 400
];

const RadarChart: React.FC<RadarChartProps> = ({ data }) => {
  const size = 300;
  const center = size / 2;
  const radius = (size / 2) - 40; // Padding
  const criteriaCount = data.criteria.length;
  const angleSlice = (Math.PI * 2) / criteriaCount;

  // Helper to get coordinates
  const getCoordinates = (value: number, index: number, max: number = 10) => {
    const angle = index * angleSlice - Math.PI / 2; // Start from top
    const r = (value / max) * radius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  };

  // Generate grid levels (2, 4, 6, 8, 10)
  const levels = [2, 4, 6, 8, 10];

  return (
    <div className="w-full flex flex-col items-center justify-center bg-slate-800/50 rounded-xl border border-slate-700 p-6">
      <h3 className="text-lg font-semibold text-slate-200 mb-6">Attribute Analysis</h3>
      
      <div className="relative">
        <svg width={size} height={size} className="overflow-visible">
          {/* Draw Grid (Background) */}
          {levels.map((level) => (
            <polygon
              key={level}
              points={data.criteria.map((_, i) => {
                const { x, y } = getCoordinates(level, i);
                return `${x},${y}`;
              }).join(' ')}
              fill="none"
              stroke="#475569"
              strokeWidth="1"
              strokeDasharray={level === 10 ? "0" : "4 4"}
              opacity={0.5}
            />
          ))}

          {/* Draw Axes */}
          {data.criteria.map((_, i) => {
            const { x, y } = getCoordinates(10, i);
            return (
              <line
                key={i}
                x1={center}
                y1={center}
                x2={x}
                y2={y}
                stroke="#475569"
                strokeWidth="1"
                opacity={0.5}
              />
            );
          })}

          {/* Draw Data Polygons */}
          {data.items.map((item, itemIndex) => {
            const points = data.criteria.map((c, i) => {
              const { x, y } = getCoordinates(c.scores[itemIndex], i);
              return `${x},${y}`;
            }).join(' ');

            return (
              <g key={item}>
                <polygon
                  points={points}
                  fill={COLORS[itemIndex % COLORS.length]}
                  fillOpacity="0.2"
                  stroke={COLORS[itemIndex % COLORS.length]}
                  strokeWidth="2"
                />
                {/* Dots at vertices */}
                {data.criteria.map((c, i) => {
                  const { x, y } = getCoordinates(c.scores[itemIndex], i);
                  return (
                    <circle
                      key={i}
                      cx={x}
                      cy={y}
                      r="3"
                      fill={COLORS[itemIndex % COLORS.length]}
                    />
                  );
                })}
              </g>
            );
          })}

          {/* Draw Labels */}
          {data.criteria.map((c, i) => {
            // Push labels out a bit further than radius
            const { x, y } = getCoordinates(12.5, i); 
            return (
              <text
                key={i}
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="#94a3b8"
                fontSize="11"
                className="font-medium"
              >
                {c.name}
              </text>
            );
          })}
        </svg>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mt-8 justify-center">
        {data.items.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: COLORS[i % COLORS.length] }}
            />
            <span className="text-sm text-slate-300">{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RadarChart;
