import { useState, useRef, useEffect } from "react";
import { useCheckSolution } from "@/hooks/use-puzzle";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, ArrowRight, HelpCircle } from "lucide-react";
import confetti from "canvas-confetti";

interface PuzzleCardProps {
  id: string;
  sequence: (number | null)[];
  onNext: () => void;
  onCorrect: () => void;
  onIncorrect: () => void;
}

export function PuzzleCard({ id, sequence, onNext, onCorrect, onIncorrect }: PuzzleCardProps) {
  const [guess, setGuess] = useState("");
  const [result, setResult] = useState<{ correct: boolean; rule: string; answer: number } | null>(null);
  const checkSolution = useCheckSolution();
  const inputRef = useRef<HTMLInputElement>(null);

  // Reset local state when puzzle ID changes
  useEffect(() => {
    setGuess("");
    setResult(null);
    inputRef.current?.focus();
  }, [id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guess) return;

    checkSolution.mutate(
      { id, guess: parseInt(guess) },
      {
        onSuccess: (data) => {
          setResult({
            correct: data.correct,
            rule: data.ruleExplanation,
            answer: data.correctAnswer
          });
          
          if (data.correct) {
            onCorrect();
            confetti({
              particleCount: 100,
              spread: 70,
              origin: { y: 0.6 },
              colors: ['#8b5cf6', '#f97316', '#14b8a6']
            });
          } else {
            onIncorrect();
          }
        }
      }
    );
  };

  const handleNext = () => {
    onNext();
  };

  const isPending = checkSolution.isPending;

  return (
    <div className="bg-white rounded-[2rem] p-8 shadow-xl border-4 border-slate-100 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 p-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800 flex items-center gap-2">
            <span className="w-3 h-8 bg-secondary rounded-full inline-block"></span>
            Solve the Sequence
          </h2>
          <div className="bg-slate-100 p-2 rounded-full text-slate-400">
            <HelpCircle className="w-6 h-6" />
          </div>
        </div>

        {/* Sequence Display */}
        <div className="flex flex-wrap gap-3 md:gap-4 justify-center items-center py-8 mb-8">
          {sequence.map((num, idx) => (
            <motion.div
              key={idx}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: idx * 0.1 }}
              className={`
                w-16 h-16 md:w-24 md:h-24 flex items-center justify-center rounded-2xl text-2xl md:text-4xl font-mono font-bold
                ${num === null 
                  ? 'bg-secondary/10 border-2 border-dashed border-secondary text-secondary' 
                  : 'bg-slate-50 border-2 border-slate-200 text-slate-700 shadow-sm'
                }
              `}
            >
              {num === null ? '?' : num}
            </motion.div>
          ))}
        </div>

        {/* Input Form */}
        <AnimatePresence mode="wait">
          {!result ? (
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              onSubmit={handleSubmit} 
              className="max-w-md mx-auto"
            >
              <div className="flex gap-4">
                <input
                  ref={inputRef}
                  type="number"
                  value={guess}
                  onChange={(e) => setGuess(e.target.value)}
                  placeholder="?"
                  disabled={isPending}
                  className="
                    flex-1 bg-slate-50 border-2 border-slate-200 rounded-xl px-6 py-4 text-center text-2xl font-bold text-slate-800
                    focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all
                    placeholder:text-slate-300
                  "
                />
                <button
                  type="submit"
                  disabled={!guess || isPending}
                  className="
                    px-8 py-4 bg-primary text-white rounded-xl font-bold text-lg
                    shadow-lg shadow-primary/30 hover:shadow-xl hover:-translate-y-1 hover:bg-primary/90
                    disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                    transition-all duration-200 flex items-center gap-2
                  "
                >
                  {isPending ? (
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>Check <ArrowRight className="w-5 h-5" /></>
                  )}
                </button>
              </div>
            </motion.form>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`
                rounded-2xl p-6 text-center
                ${result.correct ? 'bg-green-50 border-2 border-green-100' : 'bg-red-50 border-2 border-red-100'}
              `}
            >
              <div className="mb-4">
                <div className={`
                  w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4
                  ${result.correct ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}
                `}>
                  {result.correct ? <Check className="w-8 h-8" /> : <X className="w-8 h-8" />}
                </div>
                <h3 className={`text-2xl font-bold mb-2 ${result.correct ? 'text-green-800' : 'text-red-800'}`}>
                  {result.correct ? 'Brilliant!' : 'Not quite right'}
                </h3>
                <p className={`${result.correct ? 'text-green-700' : 'text-red-700'} mb-2 text-lg`}>
                  The answer was <span className="font-bold">{result.answer}</span>
                </p>
                <div className="bg-white/60 rounded-lg p-3 inline-block">
                  <p className="text-sm font-medium text-slate-600">
                    <span className="font-bold text-slate-800 uppercase text-xs tracking-wider mr-2">Rule:</span>
                    {result.rule}
                  </p>
                </div>
              </div>
              
              <button
                onClick={handleNext}
                autoFocus
                className="
                  mx-auto px-8 py-3 bg-white border-2 rounded-xl font-bold text-lg
                  shadow-sm hover:shadow-md hover:-translate-y-0.5
                  transition-all duration-200 flex items-center gap-2
                  text-slate-700 border-slate-200
                "
              >
                Next Puzzle <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
