import { Shell } from "./shell";
import { FSSnapshot } from "./vfs";

export interface Checkpoint {
  id: string;
  description: string;
  validate: (shell: Shell, history: string[]) => boolean;
}

export interface Level {
  id: string;
  chapter: number;
  order: number;
  title: string;
  description: string;
  instructions: string[];
  hints: string[];
  checkpoints: Checkpoint[];
  initialFS?: FSSnapshot;
  initialCwd?: string;
  initialGit?: boolean;
}

export interface Chapter {
  id: number;
  title: string;
  description: string;
  levels: Level[];
}

export interface CourseProgress {
  completedLevels: Set<string>;
  currentLevel: string;
  checkpointStates: Record<string, Record<string, boolean>>;
}

export function createProgress(startLevel: string): CourseProgress {
  return {
    completedLevels: new Set(),
    currentLevel: startLevel,
    checkpointStates: {},
  };
}

export function validateCheckpoints(
  level: Level,
  shell: Shell,
): Record<string, boolean> {
  const results: Record<string, boolean> = {};
  for (const cp of level.checkpoints) {
    results[cp.id] = cp.validate(shell, shell.history);
  }
  return results;
}

export function isLevelComplete(
  level: Level,
  shell: Shell,
): boolean {
  return level.checkpoints.every((cp) => cp.validate(shell, shell.history));
}

export function saveProgress(progress: CourseProgress) {
  if (typeof window === "undefined") return;
  const data = {
    completedLevels: Array.from(progress.completedLevels),
    currentLevel: progress.currentLevel,
    checkpointStates: progress.checkpointStates,
  };
  localStorage.setItem("prschool_progress", JSON.stringify(data));
}

export function loadProgress(): CourseProgress | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("prschool_progress");
  if (!raw) return null;
  try {
    const data = JSON.parse(raw);
    return {
      completedLevels: new Set(data.completedLevels),
      currentLevel: data.currentLevel,
      checkpointStates: data.checkpointStates || {},
    };
  } catch {
    return null;
  }
}
