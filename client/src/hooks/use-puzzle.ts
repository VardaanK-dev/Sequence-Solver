import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type InsertScore } from "@shared/routes";

// Hook for fetching a new puzzle
export function usePuzzle() {
  return useQuery({
    queryKey: [api.puzzle.get.path],
    queryFn: async () => {
      const res = await fetch(api.puzzle.get.path);
      if (!res.ok) throw new Error("Failed to fetch puzzle");
      return api.puzzle.get.responses[200].parse(await res.json());
    },
    refetchOnWindowFocus: false, // Don't refetch when tabbing back
  });
}

// Hook for checking the solution
export function useCheckSolution() {
  return useMutation({
    mutationFn: async ({ id, guess }: { id: string; guess: number }) => {
      const res = await fetch(api.puzzle.check.path, {
        method: api.puzzle.check.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, guess }),
      });
      if (!res.ok) throw new Error("Failed to check solution");
      return api.puzzle.check.responses[200].parse(await res.json());
    },
  });
}

// Hook for fetching high scores
export function useScores() {
  return useQuery({
    queryKey: [api.scores.list.path],
    queryFn: async () => {
      const res = await fetch(api.scores.list.path);
      if (!res.ok) throw new Error("Failed to fetch scores");
      return api.scores.list.responses[200].parse(await res.json());
    },
  });
}

// Hook for submitting a new high score
export function useSubmitScore() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertScore) => {
      const res = await fetch(api.scores.create.path, {
        method: api.scores.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to submit score");
      return api.scores.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.scores.list.path] });
    },
  });
}
