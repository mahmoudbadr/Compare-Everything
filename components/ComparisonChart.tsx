import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
  Tooltip
} from 'recharts';
import { ComparisonResult } from '../types';

interface ComparisonChartProps {
  data: ComparisonResult;
}

// Pre-defined colors for up to 4 items
const COLORS = [
  { stroke: '#38bdf8', fill: '#38bdf8' }, // Brand 400 (Sky Blue)
  { stroke: '#f472b6', fill: '#f472b6' }, // Pink 400
  { stroke: '#a78bfa', fill: '#a78bfa' }, // Purple 400
  { stroke: '#34d399', fill: '#34d399' }, // Emerald 400
];

const ComparisonChart: React.FC<ComparisonChartProps> = ({ data }) => {
  // Transform data for Recharts Radar
  // Expected format: [{ subject: 'Math', A: 120, B: 110 }, ...]
  const chartData = data.criteria.map((criterion) => {
    const point: any = { subject: criterion.name };
    criterion.scores.forEach((score, index) => {
      point[data.items[index]] = score;
    });
    return point;
  });

  return (
    <div className="w-full h-[400px] bg-slate-800/50 rounded-xl border border-slate-700 p-4">
      <h3 className="text-lg font-semibold text-slate-200 mb-4 text-center">Attribute Analysis</h3>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
          <PolarGrid stroke="#475569" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
          <PolarRadiusAxis angle={30} domain={[0, 10]} tick={false} axisLine={false} />
          
          {data.items.map((item, index) => (
            <Radar
              key={item}
              name={item}
              dataKey={item}
              stroke={COLORS[index % COLORS.length].stroke}
              fill={COLORS[index % COLORS.length].fill}
              fillOpacity={0.3}
            />
          ))}
          
          <Legend wrapperStyle={{ color: '#cbd5e1' }} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9' }}
            itemStyle={{ color: '#f1f5f9' }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ComparisonChart;
