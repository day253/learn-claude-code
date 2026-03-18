"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Level } from "@/lib/course";
import { CHAPTER_META, LAYER_COLORS } from "@/lib/constants";
import {
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Circle,
  Lightbulb,
  ArrowLeft,
  ArrowRight,
  Sparkles,
} from "lucide-react";

interface LevelPanelProps {
  level: Level;
  checkpointStates: Record<string, boolean>;
  onPrev?: () => void;
  onNext?: () => void;
  isComplete: boolean;
  hasPrev: boolean;
  hasNext: boolean;
  chapterTitle: string;
}

export default function LevelPanel({
  level,
  checkpointStates,
  onPrev,
  onNext,
  isComplete,
  hasPrev,
  hasNext,
  chapterTitle,
}: LevelPanelProps) {
  const [showHints, setShowHints] = useState(false);
  const [expandedInstructions, setExpandedInstructions] = useState(true);

  const completedCount = Object.values(checkpointStates).filter(Boolean).length;
  const totalCount = level.checkpoints.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const meta = CHAPTER_META[level.chapter as keyof typeof CHAPTER_META];
  const colors = meta ? LAYER_COLORS[meta.layer] : null;
  const layerColor = meta?.color || "#3b82f6";

  return (
    <div className="flex flex-col h-full bg-[var(--color-bg)]">
      {/* Header */}
      <div className="px-4 py-3 border-b border-[var(--color-border)]">
        <div className="flex items-center gap-2 mb-1">
          <div
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: layerColor }}
          />
          <span className="text-xs text-[var(--color-text-muted)]">
            第{level.chapter}章 · {chapterTitle}
          </span>
        </div>
        <h2 className="text-lg font-bold tracking-tight">
          {level.order}. {level.title}
        </h2>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1 leading-relaxed">
          {level.description}
        </p>
      </div>

      {/* Progress */}
      <div className="px-4 py-3">
        <div className="flex justify-between text-xs mb-1.5">
          <span className="text-[var(--color-text-muted)] font-mono tabular-nums">
            {completedCount}/{totalCount} 任务
          </span>
          {isComplete && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-1 text-emerald-400 font-medium"
            >
              <Sparkles size={12} />
              通关
            </motion.span>
          )}
        </div>
        <div className="h-1.5 bg-[var(--color-bg-secondary)] rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: layerColor }}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto min-h-0 px-4 pb-4 space-y-5">
        {/* Instructions */}
        <div>
          <button
            onClick={() => setExpandedInstructions(!expandedInstructions)}
            className="flex items-center gap-1.5 text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider w-full mb-2"
          >
            {expandedInstructions ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            操作指引
          </button>
          <AnimatePresence>
            {expandedInstructions && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="space-y-2">
                  {level.instructions.map((inst, i) => (
                    <p
                      key={i}
                      className="text-sm text-[var(--color-text-secondary)] leading-relaxed"
                      dangerouslySetInnerHTML={{
                        __html: inst.replace(
                          /`([^`]+)`/g,
                          '<code class="px-1.5 py-0.5 bg-[#27272a] border border-[#3f3f46] text-pink-300 rounded text-xs font-mono">$1</code>',
                        ),
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Checkpoints */}
        <div>
          <div className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-2">
            任务清单
          </div>
          <div className="space-y-1.5">
            {level.checkpoints.map((cp) => {
              const done = checkpointStates[cp.id] || false;
              return (
                <motion.div
                  key={cp.id}
                  layout
                  className={`flex items-center gap-2.5 p-2.5 rounded-lg border transition-all ${
                    done
                      ? "bg-emerald-500/5 border-emerald-500/20"
                      : "bg-[var(--color-bg-secondary)] border-transparent"
                  }`}
                >
                  {done ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    >
                      <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                    </motion.div>
                  ) : (
                    <Circle size={16} className="text-[var(--color-text-muted)] shrink-0" />
                  )}
                  <span
                    className={`text-sm ${
                      done
                        ? "text-emerald-400/80 line-through"
                        : "text-[var(--color-text-secondary)]"
                    }`}
                  >
                    {cp.description}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Hints */}
        {level.hints.length > 0 && (
          <div>
            <button
              onClick={() => setShowHints(!showHints)}
              className="flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 transition-colors"
            >
              <Lightbulb size={13} />
              {showHints ? "隐藏提示" : "需要提示？"}
            </button>
            <AnimatePresence>
              {showHints && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="mt-2 p-3 bg-amber-500/5 border border-amber-500/20 rounded-lg space-y-1.5">
                    {level.hints.map((hint, i) => (
                      <p key={i} className="text-sm text-amber-300/80">
                        {hint}
                      </p>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="px-4 py-3 border-t border-[var(--color-border)] flex justify-between items-center gap-2">
        <button
          onClick={onPrev}
          disabled={!hasPrev}
          className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg border border-[var(--color-border)] text-[var(--color-text-secondary)] disabled:opacity-20 hover:border-[var(--color-border-hover)] hover:text-[var(--color-text)] transition-all"
        >
          <ArrowLeft size={14} />
          上一关
        </button>
        <button
          onClick={onNext}
          disabled={!hasNext || !isComplete}
          className={`flex items-center gap-1.5 px-4 py-2 text-sm rounded-lg font-medium transition-all ${
            isComplete && hasNext
              ? "bg-white text-zinc-900 hover:bg-zinc-100"
              : "border border-[var(--color-border)] text-[var(--color-text-muted)]"
          } disabled:opacity-20`}
        >
          下一关
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}
