import { chapter1 } from "./chapter1";
import { chapter2 } from "./chapter2";
import { chapter3 } from "./chapter3";
import { chapter4 } from "./chapter4";
import { chapter5 } from "./chapter5";
import { chapter6 } from "./chapter6";
import { Chapter, Level } from "@/lib/course";

export const chapters: Chapter[] = [
  chapter1,
  chapter2,
  chapter3,
  chapter4,
  chapter5,
  chapter6,
];

export function getAllLevels(): Level[] {
  return chapters.flatMap((ch) => ch.levels);
}

export function getLevelById(id: string): Level | undefined {
  return getAllLevels().find((l) => l.id === id);
}

export function getNextLevel(currentId: string): Level | undefined {
  const all = getAllLevels();
  const idx = all.findIndex((l) => l.id === currentId);
  return idx >= 0 && idx < all.length - 1 ? all[idx + 1] : undefined;
}

export function getPrevLevel(currentId: string): Level | undefined {
  const all = getAllLevels();
  const idx = all.findIndex((l) => l.id === currentId);
  return idx > 0 ? all[idx - 1] : undefined;
}

export function getChapterForLevel(levelId: string): Chapter | undefined {
  return chapters.find((ch) => ch.levels.some((l) => l.id === levelId));
}
