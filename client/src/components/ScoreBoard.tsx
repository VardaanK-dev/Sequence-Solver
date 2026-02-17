import { useScores } from "@/hooks/use-puzzle";
import { Trophy, Award } from "lucide-react";
import { motion } from "framer-motion";
import type { Score } from "@shared/schema";

export function ScoreBoard() {
  const { data: scores = [], isLoading } = useScores();

  return (
    <div className="bg-white rounded-3xl p-6 shadow-lg border-2 border-slate-100 h-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-yellow-100 rounded-xl text-yellow-600">
          <Trophy className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800">Leaderboard</h2>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i: number) => (
              <div key={i} className="h-12 bg-slate-50 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : scores && scores.length > 0 ? (
          <div className="flex flex-col gap-2">
            {scores.slice(0, 10).map((score: Score, index: number) => (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                key={score.id}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`
                      w-8 h-8 flex items-center justify-center rounded-full font-bold text-sm
                      ${index === 0 ? "bg-yellow-100 text-yellow-700" : 
                        index === 1 ? "bg-slate-200 text-slate-700" :
                        index === 2 ? "bg-orange-100 text-orange-700" :
                        "bg-slate-50 text-slate-400"}
                    `}
                  >
                    {index + 1}
                  </div>
                  <span className="font-semibold text-slate-700 font-display">
                    {score.username}
                  </span>
                </div>
                <div className="font-mono font-bold text-primary bg-primary/5 px-3 py-1 rounded-lg">
                  {score.score}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-slate-400">
            <Award className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p>
              No high scores yet.
              <br />
              Be the first!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
