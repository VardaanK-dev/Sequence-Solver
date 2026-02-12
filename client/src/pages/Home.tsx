import { useState } from "react";
import { usePuzzle } from "@/hooks/use-puzzle";
import { PuzzleCard } from "@/components/PuzzleCard";
import { ScoreBoard } from "@/components/ScoreBoard";
import { GameOverModal } from "@/components/GameOverModal";
import { Zap, BrainCircuit, RefreshCw } from "lucide-react";

export default function Home() {
  const { data: puzzle, isLoading, error, refetch } = usePuzzle();
  const [streak, setStreak] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);

  // If correct, increment streak but wait for user to click next to fetch new puzzle
  const handleCorrect = () => {
    setStreak(prev => prev + 1);
  };

  // If incorrect, game over!
  const handleIncorrect = () => {
    setIsGameOver(true);
  };

  const handleNext = () => {
    refetch(); // Get new puzzle
  };

  const handleRestart = () => {
    setStreak(0);
    setIsGameOver(false);
    refetch();
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center p-8">
          <BrainCircuit className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-700 mb-2">Something went wrong</h2>
          <button 
            onClick={() => window.location.reload()}
            className="text-primary font-bold hover:underline"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-body text-slate-800 pb-12">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-display font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              SeqFinder
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-full border border-slate-200">
              <Zap className={`w-5 h-5 ${streak > 0 ? 'text-yellow-500 fill-yellow-500' : 'text-slate-400'}`} />
              <span className="font-mono font-bold text-slate-700">{streak}</span>
              <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">Streak</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Game Area */}
          <div className="lg:col-span-8 space-y-8">
            {isLoading ? (
              <div className="bg-white rounded-[2rem] p-12 shadow-xl border-4 border-slate-100 flex flex-col items-center justify-center min-h-[400px]">
                <RefreshCw className="w-12 h-12 text-primary animate-spin mb-4" />
                <p className="text-lg font-medium text-slate-500">Loading your puzzle...</p>
              </div>
            ) : puzzle ? (
              <PuzzleCard 
                key={puzzle.id} // Important for resetting state
                id={puzzle.id}
                sequence={puzzle.sequence}
                onNext={handleNext}
                onCorrect={handleCorrect}
                onIncorrect={handleIncorrect}
              />
            ) : null}

            {/* Instructions / Footer Info */}
            <div className="bg-white/50 border border-slate-200 rounded-2xl p-6 text-center text-slate-500">
              <p>Find the pattern in the sequence and enter the missing number.</p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 h-full">
             <div className="sticky top-28">
               <ScoreBoard />
             </div>
          </div>
        </div>
      </main>

      <GameOverModal 
        isOpen={isGameOver} 
        score={streak} 
        onRestart={handleRestart}
      />
    </div>
  );
}
