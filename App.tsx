import React, { useState, useRef } from 'react';
import { generateComparison } from './services/gemini';
import { ComparisonResult, LoadingState } from './types';
import ComparisonChart from './components/ComparisonChart';
import ComparisonTable from './components/ComparisonTable';
import { Plus, Trash2, ArrowRight, Loader2, Sparkles, Scale } from 'lucide-react';

const App: React.FC = () => {
  // State for input items (start with 2 empty strings)
  const [items, setItems] = useState<string[]>(['', '']);
  const [result, setResult] = useState<ComparisonResult | null>(null);
  const [loadingState, setLoadingState] = useState<LoadingState>('idle');
  const [error, setError] = useState<string | null>(null);

  const resultRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (index: number, value: string) => {
    const newItems = [...items];
    newItems[index] = value;
    setItems(newItems);
  };

  const addItem = () => {
    if (items.length < 4) {
      setItems([...items, '']);
    }
  };

  const removeItem = (index: number) => {
    if (items.length > 2) {
      const newItems = items.filter((_, i) => i !== index);
      setItems(newItems);
    }
  };

  const handleCompare = async () => {
    // Basic validation
    const filledItems = items.filter(i => i.trim() !== '');
    if (filledItems.length < 2) {
      setError("Please enter at least 2 items to compare.");
      return;
    }

    setLoadingState('analyzing');
    setError(null);
    setResult(null);

    try {
      // Small artificial delay for "analyzing" UI effect
      setTimeout(() => setLoadingState('generating'), 1500);
      
      const data = await generateComparison(filledItems);
      setResult(data);
      setLoadingState('complete');
      
      // Scroll to results
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err) {
      console.error(err);
      setError("Failed to generate comparison. Please try again or check your API key.");
      setLoadingState('error');
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 flex flex-col">
      {/* Header */}
      <header className="py-6 border-b border-slate-800 bg-slate-900/50 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-brand-600 p-2 rounded-lg">
              <Scale className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-brand-400 to-indigo-400 bg-clip-text text-transparent">
              Versus AI
            </h1>
          </div>
          <div className="text-sm text-slate-400 hidden sm:block">
            Powered by Gemini 2.5
          </div>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center">
        
        {/* Hero / Input Section */}
        <div className="w-full max-w-4xl px-6 py-12 sm:py-20 flex flex-col items-center text-center">
          <h2 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-6">
            Compare <span className="text-brand-400">Everything</span>
          </h2>
          <p className="text-lg text-slate-400 mb-10 max-w-2xl">
            From tech frameworks to philosophical concepts, enter any items below and let our AI engine generate a deep, unbiased comparison.
          </p>

          <div className="w-full bg-slate-800/50 p-6 sm:p-8 rounded-2xl border border-slate-700 shadow-2xl backdrop-blur-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {items.map((item, index) => (
                <div key={index} className="relative group">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    placeholder={`Item ${index + 1} (e.g. ${index === 0 ? 'React' : 'Vue'})`}
                    className="w-full bg-slate-900 border border-slate-600 rounded-xl px-4 py-4 text-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all placeholder:text-slate-600"
                  />
                  {items.length > 2 && (
                    <button
                      onClick={() => removeItem(index)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
              
              {items.length < 4 && (
                <button
                  onClick={addItem}
                  className="flex items-center justify-center gap-2 border-2 border-dashed border-slate-700 rounded-xl px-4 py-4 text-slate-500 hover:border-brand-500 hover:text-brand-400 transition-all"
                >
                  <Plus className="w-5 h-5" />
                  <span>Add Comparison Item</span>
                </button>
              )}
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-900/20 border border-red-800 text-red-200 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              onClick={handleCompare}
              disabled={loadingState !== 'idle' && loadingState !== 'complete' && loadingState !== 'error'}
              className="w-full bg-brand-600 hover:bg-brand-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-lg font-bold py-4 rounded-xl shadow-lg shadow-brand-900/20 transition-all flex items-center justify-center gap-3"
            >
              {loadingState === 'idle' || loadingState === 'complete' || loadingState === 'error' ? (
                <>
                  <span>Generate Analysis</span>
                  <Sparkles className="w-5 h-5" />
                </>
              ) : (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>
                    {loadingState === 'analyzing' ? 'Understanding Context...' : 'Comparing Attributes...'}
                  </span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results Section */}
        {result && (
          <div ref={resultRef} className="w-full max-w-6xl px-6 pb-20 animate-fade-in-up">
            <div className="flex flex-col gap-8">
              
              {/* Verdict Card */}
              <div className="bg-gradient-to-br from-indigo-900/50 to-brand-900/50 p-8 rounded-2xl border border-indigo-500/30 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-32 bg-brand-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="relative z-10">
                  <h3 className="text-brand-300 font-semibold mb-2 uppercase tracking-wider text-sm">AI Verdict</h3>
                  <p className="text-2xl sm:text-3xl font-light text-white leading-relaxed">
                    {result.verdict}
                  </p>
                </div>
              </div>

              {/* Summary */}
              <div className="bg-slate-800/30 p-6 rounded-xl border border-slate-700">
                <h3 className="text-slate-200 font-semibold mb-3 flex items-center gap-2">
                  <ArrowRight className="w-5 h-5 text-brand-400" />
                  Summary
                </h3>
                <p className="text-slate-300 leading-relaxed">
                  {result.summary}
                </p>
              </div>

              {/* Grid: Chart + Details */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Chart Column */}
                <div className="lg:col-span-1">
                  <ComparisonChart data={result} />
                </div>
                
                {/* Table Column */}
                <div className="lg:col-span-2">
                  <ComparisonTable data={result} />
                </div>
              </div>

            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default App;
