import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useState } from "react";
import { useSubmitScore } from "@/hooks/use-puzzle";
import { Trophy, RotateCcw } from "lucide-react";

interface GameOverModalProps {
  isOpen: boolean;
  onRestart: () => void;
}

export function GameOverModal({ isOpen, onRestart }: GameOverModalProps) {
  const handleRestart = () => {
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
            <DialogTitle className="text-3xl font-display font-bold mb-2">Great Effort!</DialogTitle>
            <DialogDescription className="text-primary-foreground/80 text-lg">
              Keep practicing to master these patterns!
            </DialogDescription>
          </div>
        </div>

        <div className="p-8">
          <div className="text-center space-y-6">
            <button
              onClick={handleRestart}
              className="w-full py-4 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-700 transition-colors flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-5 h-5" /> Play Again
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
