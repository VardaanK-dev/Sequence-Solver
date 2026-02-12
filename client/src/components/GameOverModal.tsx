import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useState } from "react";
import { useSubmitScore } from "@/hooks/use-puzzle";
import { Trophy, RotateCcw } from "lucide-react";

interface GameOverModalProps {
  score: number;
  isOpen: boolean;
  onRestart: () => void;
}

export function GameOverModal({ score, isOpen, onRestart }: GameOverModalProps) {
  const [username, setUsername] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const submitScore = useSubmitScore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    submitScore.mutate({ username, score }, {
      onSuccess: () => {
        setSubmitted(true);
      }
    });
  };

  const handleRestart = () => {
    setSubmitted(false);
    setUsername("");
    onRestart();
  };

  return (
    <Dialog open={isOpen}>
      <DialogContent className="sm:max-w-md bg-white border-none shadow-2xl rounded-3xl p-0 overflow-hidden">
        <div className="bg-primary p-8 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="relative z-10">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
              <Trophy className="w-10 h-10 text-yellow-300" />
            </div>
            <DialogTitle className="text-3xl font-display font-bold mb-2">Great Run!</DialogTitle>
            <DialogDescription className="text-primary-foreground/80 text-lg">
              You correctly solved
            </DialogDescription>
            <div className="text-5xl font-black mt-2 font-mono">{score}</div>
            <div className="text-sm opacity-80 uppercase tracking-widest font-bold mt-1">Puzzles</div>
          </div>
        </div>

        <div className="p-8">
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2 text-center">
                <h3 className="font-bold text-slate-700 text-lg">Save your score</h3>
                <p className="text-slate-500 text-sm">Enter your name to appear on the leaderboard</p>
              </div>
              
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Your Name"
                maxLength={12}
                className="w-full text-center bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-800 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                autoFocus
              />

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={onRestart} // Allow skip without saving
                  className="flex-1 py-3 px-4 rounded-xl font-bold text-slate-500 hover:bg-slate-50 transition-colors"
                >
                  Skip
                </button>
                <button
                  type="submit"
                  disabled={!username.trim() || submitScore.isPending}
                  className="flex-1 py-3 px-4 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {submitScore.isPending ? "Saving..." : "Save Score"}
                </button>
              </div>
            </form>
          ) : (
            <div className="text-center space-y-6">
              <div className="p-4 bg-green-50 text-green-700 rounded-xl font-medium border border-green-100">
                Score saved successfully!
              </div>
              <button
                onClick={handleRestart}
                className="w-full py-4 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-700 transition-colors flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-5 h-5" /> Play Again
              </button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
