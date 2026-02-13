import { useState } from "react";
import { usePuzzle } from "@/hooks/use-puzzle";
import { PuzzleCard } from "@/components/PuzzleCard";
import { ScoreBoard } from "@/components/ScoreBoard";
import { GameOverModal } from "@/components/GameOverModal";
import { Zap, BrainCircuit, RefreshCw } from "lucide-react";

import logoImg from "@assets/Gemini_Generated_Image_vqfmsqvqfmsqvqfm-removebg-preview_1770997451977.png";

export default function Home() {
  const { data: puzzle, isLoading, error, refetch } = usePuzzle();
  const [streak, setStreak] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);

  const handleCorrect = () => {
    // Correct answer feedback is handled in PuzzleCard
  };

  const handleIncorrect = () => {
    setIsGameOver(true);
  };

  const handleNext = () => {
    refetch(); // Get new puzzle
  };

  const handleRestart = () => {
    setIsGameOver(false);
    refetch();
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="text-center p-8">
          <BrainCircuit className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
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
    <div className="min-h-screen bg-background font-body text-foreground pb-12">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src={logoImg} 
              alt="Sequence Logic Logo" 
              className="w-12 h-12 rounded-xl object-contain"
            />
            <h1 className="text-2xl font-display font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Sequence Logic
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="space-y-8">
          {/* Main Game Area */}
          <div className="space-y-8">
            {isLoading ? (
              <div className="bg-card rounded-[2rem] p-12 shadow-xl border-4 border-border flex flex-col items-center justify-center min-h-[400px]">
                <RefreshCw className="w-12 h-12 text-primary animate-spin mb-4" />
                <p className="text-lg font-medium text-muted-foreground">Loading your puzzle...</p>
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
            <div className="bg-primary/20 border-2 border-primary/30 rounded-2xl p-6 text-center shadow-lg shadow-primary/5">
              <p className="text-primary-foreground font-bold text-lg">Find the pattern in the sequence and enter the missing number.</p>
            </div>
          </div>
        </div>
      </main>

      <GameOverModal 
        isOpen={isGameOver} 
        onRestart={handleRestart}
      />
    </div>
  );
}
