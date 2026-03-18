"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { chapters } from "@/courses";
import { CourseProgress } from "@/lib/course";
import { CHAPTER_META, LAYER_COLORS, LAYERS } from "@/lib/constants";
import {
  CheckCircle2,
  Circle,
  ArrowRight,
  Terminal,
  GitBranch,
  Github,
  GitPullRequest,
  Bot,
  GraduationCap,
} from "lucide-react";

const CHAPTER_ICONS: Record<number, React.ElementType> = {
  1: Terminal,
  2: GitBranch,
  3: Github,
  4: GitPullRequest,
  5: Bot,
  6: GraduationCap,
};

interface ChapterSelectProps {
  progress: CourseProgress;
  onSelectLevel: (levelId: string) => void;
}

export default function ChapterSelect({
  progress,
  onSelectLevel,
}: ChapterSelectProps) {
  const allCompletedLevels = progress.completedLevels;
  const totalLevels = chapters.reduce((acc, ch) => acc + ch.levels.length, 0);
  const completedTotal = allCompletedLevels.size;

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--color-border)]">
        <Link
          href="/landing"
          className="text-sm font-semibold text-[var(--color-text)]"
        >
          PRSchool
        </Link>
        <a
          href="https://github.com/day253/learn-claude-code"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-bg-secondary)] transition-colors"
        >
          <Github size={14} />
          GitHub
        </a>
      </div>

      {/* Hero summary */}
      <div className="px-6 pt-10 pb-8 max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">
            学习路径
          </h1>
          <p className="text-[var(--color-text-secondary)] mb-6">
            6 章 {totalLevels} 关，从终端命令到提交你的第一个 Pull Request。
          </p>

          {/* Overall progress */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-2 bg-[var(--color-bg-secondary)] rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${totalLevels > 0 ? (completedTotal / totalLevels) * 100 : 0}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
            <span className="text-xs text-[var(--color-text-muted)] font-mono tabular-nums">
              {completedTotal}/{totalLevels}
            </span>
          </div>
        </motion.div>
      </div>

      {/* Layer pills */}
      <div className="px-4 max-w-2xl mx-auto mb-6">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {LAYERS.map((layer) => {
            const colors = LAYER_COLORS[layer.id];
            return (
              <div
                key={layer.id}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium shrink-0 border ${colors.bg} ${colors.border} ${colors.text}`}
              >
                <div className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
                {layer.label}
              </div>
            );
          })}
        </div>
      </div>

      {/* Chapters */}
      <div className="px-4 pb-12 space-y-4 max-w-2xl mx-auto">
        {chapters.map((chapter, chapterIdx) => {
          const meta = CHAPTER_META[chapter.id as keyof typeof CHAPTER_META];
          const colors = meta ? LAYER_COLORS[meta.layer] : null;
          const Icon = CHAPTER_ICONS[chapter.id] || Terminal;
          const completedInChapter = chapter.levels.filter((l) =>
            allCompletedLevels.has(l.id),
          ).length;
          const total = chapter.levels.length;
          const chapterProgress = total > 0 ? (completedInChapter / total) * 100 : 0;

          return (
            <motion.div
              key={chapter.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: chapterIdx * 0.06 }}
              className={`rounded-xl border overflow-hidden transition-colors ${
                colors ? `${colors.border}` : "border-[var(--color-border)]"
              }`}
            >
              {/* Chapter header */}
              <div
                className={`p-4 ${colors?.bg || "bg-[var(--color-bg-card)]"}`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                    style={meta ? { background: `${meta.color}15` } : {}}
                  >
                    <Icon size={18} style={meta ? { color: meta.color } : {}} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-sm">
                        第{chapter.id}章：{chapter.title}
                      </h3>
                      {chapterProgress === 100 && (
                        <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                      {meta?.motto}
                    </p>
                  </div>
                  <span className="text-xs text-[var(--color-text-muted)] font-mono tabular-nums">
                    {completedInChapter}/{total}
                  </span>
                </div>

                {/* Chapter progress bar */}
                <div className="h-1 bg-[var(--color-bg-secondary)] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${chapterProgress}%`,
                      background: meta?.color || "#3b82f6",
                    }}
                  />
                </div>
              </div>

              {/* Levels */}
              <div className="divide-y divide-[var(--color-border)]">
                {chapter.levels.map((level) => {
                  const done = allCompletedLevels.has(level.id);
                  const isCurrent = progress.currentLevel === level.id;

                  return (
                    <button
                      key={level.id}
                      onClick={() => onSelectLevel(level.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left text-sm transition-colors group ${
                        isCurrent
                          ? `bg-[var(--color-bg-secondary)]`
                          : "bg-[var(--color-bg-card)] hover:bg-[var(--color-bg-secondary)]"
                      }`}
                    >
                      {done ? (
                        <CheckCircle2
                          size={16}
                          className="text-emerald-400 shrink-0"
                        />
                      ) : isCurrent ? (
                        <div
                          className="w-4 h-4 rounded-full border-2 shrink-0 animate-pulse"
                          style={{ borderColor: meta?.color || "#3b82f6" }}
                        />
                      ) : (
                        <Circle
                          size={16}
                          className="text-[var(--color-text-muted)] shrink-0"
                        />
                      )}
                      <span
                        className={`flex-1 ${
                          done
                            ? "text-[var(--color-text-muted)]"
                            : isCurrent
                              ? "text-[var(--color-text)] font-medium"
                              : "text-[var(--color-text-secondary)]"
                        }`}
                      >
                        {level.order}. {level.title}
                      </span>
                      <ArrowRight
                        size={14}
                        className="text-[var(--color-text-muted)] opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all"
                      />
                    </button>
                  );
                })}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
