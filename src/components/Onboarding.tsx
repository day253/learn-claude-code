"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, GitBranch, Bot, ArrowRight } from "lucide-react";

const SLIDES = [
  {
    icon: Terminal,
    color: "#3B82F6",
    title: "学会终端",
    desc: "在模拟终端里输入命令，从 ls 到 git commit，一步步掌握",
  },
  {
    icon: GitBranch,
    color: "#10B981",
    title: "掌握 Git & GitHub",
    desc: "版本控制、分支、Pull Request — 开源协作的基本功",
  },
  {
    icon: Bot,
    color: "#8B5CF6",
    title: "用 AI 提 PR",
    desc: "用 Claude Code 帮你读代码、改代码、提交 — 效率翻倍",
  },
];

export default function Onboarding({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(0);

  const handleNext = () => {
    if (step < SLIDES.length - 1) {
      setStep(step + 1);
    } else {
      localStorage.setItem("prschool_onboarded", "1");
      onDone();
    }
  };

  const slide = SLIDES[step];

  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex flex-col items-center justify-center p-6">
      <div className="max-w-xs w-full text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
          >
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-8"
              style={{ background: `${slide.color}15` }}
            >
              <slide.icon className="w-10 h-10" style={{ color: slide.color }} />
            </div>
            <h2 className="text-xl font-bold tracking-tight mb-3">
              {slide.title}
            </h2>
            <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed mb-10">
              {slide.desc}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Dots */}
        <div className="flex justify-center gap-2 mb-8">
          {SLIDES.map((_, i) => (
            <div
              key={i}
              className="h-1.5 rounded-full transition-all duration-300"
              style={{
                width: i === step ? 24 : 6,
                background: i === step ? slide.color : "var(--color-border)",
              }}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-white text-zinc-900 rounded-xl font-semibold hover:bg-zinc-100 transition-colors text-sm"
        >
          {step === SLIDES.length - 1 ? "开始学习" : "下一步"}
          <ArrowRight size={16} />
        </button>

        {step < SLIDES.length - 1 && (
          <button
            onClick={() => {
              localStorage.setItem("prschool_onboarded", "1");
              onDone();
            }}
            className="mt-4 text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] transition-colors"
          >
            跳过介绍
          </button>
        )}
      </div>
    </div>
  );
}
