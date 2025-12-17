export interface ComparisonCriterion {
  name: string;
  descriptions: string[]; 
  scores: number[]; 
  winnerIndex: number;
}

export interface ComparisonResult {
  items: string[];
  summary: string;
  criteria: ComparisonCriterion[];
  verdict: string;
}

export type LoadingState = 'idle' | 'analyzing' | 'generating' | 'rendering' | 'complete' | 'error';
