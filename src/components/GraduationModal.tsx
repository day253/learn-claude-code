"use client";

import { motion } from "framer-motion";
import { GraduationCap, X, Share2, Github } from "lucide-react";

interface GraduationModalProps {
  onClose: () => void;
  completedLevels: number;
  totalLevels: number;
}

const SKILLS = [
  "终端命令行操作",
  "Git 版本控制",
  "GitHub 远程协作",
  "Pull Request 全流程",
  "Claude Code AI 编程",
  "开源项目贡献",
];

export default function GraduationModal({
  onClose,
  completedLevels,
  totalLevels,
}: GraduationModalProps) {
  const shareText = `我在 PRSchool 完成了 ${completedLevels}/${totalLevels} 关，学会了从终端到 Pull Request 的完整流程！`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="relative bg-[var(--color-bg)] rounded-2xl p-6 max-w-sm w-full border border-[var(--color-border)] overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-pink-500/5 pointer-events-none" />

        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors z-10"
        >
          <X size={18} />
        </button>

        <div className="relative text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 20, delay: 0.2 }}
            className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-4"
          >
            <GraduationCap className="w-8 h-8 text-amber-400" />
          </motion.div>

          <h3 className="text-xl font-bold tracking-tight mb-2">
            毕业快乐！
          </h3>
          <p className="text-sm text-[var(--color-text-secondary)] mb-6">
            你已完成 {completedLevels}/{totalLevels} 关。
            <br />
            从终端小白到能提 PR 的开发者，了不起。
          </p>

          <div className="text-left mb-6">
            <div className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-2">
              已掌握技能
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {SKILLS.map((skill) => (
                <div
                  key={skill}
                  className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/5 border border-emerald-500/15 rounded-lg px-2.5 py-1.5"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                  {skill}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <a
              href="https://github.com/day253/learn-claude-code"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 bg-white text-zinc-900 rounded-xl font-semibold text-sm hover:bg-zinc-100 transition-colors"
            >
              <Github size={16} />
              去 GitHub 给项目点个 Star
            </a>
            <button
              onClick={() => {
                navigator.clipboard?.writeText(shareText);
              }}
              className="flex items-center justify-center gap-2 w-full py-3 border border-[var(--color-border)] rounded-xl text-sm text-[var(--color-text-secondary)] hover:border-[var(--color-border-hover)] hover:text-[var(--color-text)] transition-colors"
            >
              <Share2 size={14} />
              分享成就
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
