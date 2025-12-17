import React from 'react';
import { ComparisonResult } from '../types';
import { Trophy, CheckCircle, XCircle, Minus } from 'lucide-react';

interface ComparisonTableProps {
  data: ComparisonResult;
}

const ComparisonTable: React.FC<ComparisonTableProps> = ({ data }) => {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-700 bg-slate-800/50 shadow-xl">
      <table className="w-full border-collapse text-left text-sm">
        <thead>
          <tr className="bg-slate-900/50">
            <th className="p-4 font-semibold text-slate-400 border-b border-slate-700">Criteria</th>
            {data.items.map((item, idx) => (
              <th key={idx} className="p-4 font-bold text-lg text-white border-b border-slate-700 min-w-[200px]">
                {item}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-700">
          {data.criteria.map((criterion, idx) => (
            <tr key={idx} className="hover:bg-slate-800/80 transition-colors">
              <td className="p-4 font-medium text-slate-300 align-top">
                {criterion.name}
              </td>
              {criterion.descriptions.map((desc, itemIdx) => {
                const isWinner = criterion.winnerIndex === itemIdx;
                const isTie = criterion.winnerIndex === -1;
                const score = criterion.scores[itemIdx];

                return (
                  <td key={itemIdx} className={`p-4 align-top ${isWinner ? 'bg-brand-900/10' : ''}`}>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                          score >= 8 ? 'bg-green-500/20 text-green-400' :
                          score >= 5 ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          Score: {score}/10
                        </span>
                        {isWinner && <Trophy className="w-4 h-4 text-yellow-500" />}
                      </div>
                      <p className="text-slate-400 leading-relaxed">{desc}</p>
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ComparisonTable;
