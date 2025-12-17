export interface ComparisonCriterion {
  name: string;
  descriptions: string[]; // Parallel to the items array
  scores: number[]; // Parallel to the items array, 1-10
  winnerIndex: number; // -1 for tie/N/A
}

export interface ComparisonResult {
  items: string[];
  summary: string;
  criteria: ComparisonCriterion[];
  verdict: string;
}

export type LoadingState = 'idle' | 'analyzing' | 'generating' | 'rendering' | 'complete' | 'error';
