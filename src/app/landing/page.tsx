"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import {
  Terminal,
  GitBranch,
  GitPullRequest,
  Bot,
  Smartphone,
  Clock,
  Shield,
  ChevronRight,
  Award,
  ArrowRight,
  Zap,
  GraduationCap,
  Github,
} from "lucide-react";
import { LAYERS, CHAPTER_META, LAYER_COLORS } from "@/lib/constants";
import { chapters } from "@/courses";

const TYPING_LINES = [
  { prompt: "student@prschool:~$ ", text: "git checkout -b my-first-pr", delay: 0 },
  { output: "Switched to branch 'my-first-pr'", delay: 1200 },
  { prompt: "student@prschool:~ (my-first-pr)$ ", text: "claude", delay: 2000 },
  { output: "\u{1F916} Claude Code \u5DF2\u542F\u52A8\uFF01", outputClass: "text-emerald-400", delay: 3000 },
  { prompt: "\u{1F916} claude > ", text: "\u5E2E\u6211\u4FEE\u590D README \u91CC\u7684\u9519\u522B\u5B57\u7136\u540E\u63D0\u4EA4", delay: 3600 },
  { output: "\u{1F4AD} \u5206\u6790 README \u4E2D\u7684\u62FC\u5199\u9519\u8BEF...", outputClass: "text-zinc-500 italic text-xs", delay: 5000 },
  { output: "  \u25B6 \u4FEE\u6539 README.md \u2014 \u4FEE\u6B63 3 \u5904\u62FC\u5199\u9519\u8BEF", outputClass: "text-amber-400", delay: 5800 },
  { output: '  \u25B6 git add . && git commit -m "fix: correct typos in README"', outputClass: "text-amber-400", delay: 6400 },
  { output: "\u2705 \u5DF2\u63D0\u4EA4\uFF01\u7528 git push \u63A8\u9001\u5230\u8FDC\u7A0B\u5427\u3002", outputClass: "text-emerald-400", delay: 7200 },
];

function TerminalDemo() {
  const [visibleLines, setVisibleLines] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const timers: NodeJS.Timeout[] = [];
    TYPING_LINES.forEach((_, i) => {
      timers.push(setTimeout(() => setVisibleLines(i + 1), TYPING_LINES[i].delay));
    });
    return () => timers.forEach(clearTimeout);
  }, [inView]);

  return (
    <div ref={ref} className="bg-[#0f172a] rounded-xl overflow-hidden border border-[#1e293b] shadow-2xl shadow-blue-500/5">
      <div className="flex items-center gap-2 px-4 py-2.5 bg-[#0c1322] border-b border-[#1e293b]">
        <div className="w-3 h-3 rounded-full bg-red-500/80" />
        <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
        <div className="w-3 h-3 rounded-full bg-green-500/80" />
        <span className="ml-2 text-xs text-zinc-600 font-mono">terminal</span>
      </div>
      <div className="p-4 font-mono text-sm space-y-1.5 min-h-[260px]">
        {TYPING_LINES.slice(0, visibleLines).map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {line.prompt ? (
              <div>
                <span className="text-blue-400">{line.prompt}</span>
                <span className="text-zinc-200">{line.text}</span>
              </div>
            ) : (
              <div className={line.outputClass || "text-zinc-400"}>{line.output}</div>
            )}
          </motion.div>
        ))}
        {visibleLines < TYPING_LINES.length && (
          <span className="text-blue-400 animate-pulse">\u258A</span>
        )}
      </div>
    </div>
  );
}

function AgentLoopDiagram() {
  return (
    <div className="bg-[#0f172a] rounded-xl border border-[#1e293b] overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-2 bg-[#0c1322] border-b border-[#1e293b]">
        <span className="text-xs text-zinc-500 font-mono">learning_loop.py</span>
      </div>
      <pre className="p-5 text-[13px] leading-relaxed overflow-x-auto">
        <code>
          <span className="text-purple-400 font-medium">while </span>
          <span className="text-amber-400">True</span>
          <span className="text-zinc-400">:</span>
          {"\n"}
          {"  "}<span className="text-zinc-400"># \u8BFB\u9898 \u2192 \u5728\u7EC8\u7AEF\u64CD\u4F5C \u2192 \u7CFB\u7EDF\u9A8C\u8BC1 \u2192 \u8FDB\u5165\u4E0B\u4E00\u5173</span>
          {"\n"}
          {"  "}level = <span className="text-blue-400 font-semibold">read_instructions</span>
          <span className="text-zinc-400">(</span>
          <span className="text-emerald-400">current_chapter</span>
          <span className="text-zinc-400">)</span>
          {"\n"}
          {"  "}result = <span className="text-blue-400 font-semibold">execute_in_terminal</span>
          <span className="text-zinc-400">(</span>
          <span className="text-emerald-400">your_command</span>
          <span className="text-zinc-400">)</span>
          {"\n"}
          {"  "}<span className="text-purple-400 font-medium">if </span>
          <span className="text-blue-400">all_checkpoints_passed</span>
          <span className="text-zinc-400">(level):</span>
          {"\n"}
          {"    "}<span className="text-purple-400 font-medium">break</span>
          <span className="text-zinc-400">  </span>
          <span className="text-zinc-600">{"# \u{1F389} \u8FC7\u5173\uFF01"}</span>
          {"\n"}
          {"  "}<span className="text-blue-400 font-semibold">show_progress</span>
          <span className="text-zinc-400">(</span>
          <span className="text-emerald-400">checkpoints</span>
          <span className="text-zinc-400">)</span>
        </code>
      </pre>
    </div>
  );
}

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.5 },
};

const FEATURES = [
  { icon: Smartphone, title: "\u624B\u673A\u5C31\u80FD\u5B66", desc: "\u7EAF\u6D4F\u89C8\u5668\u8FD0\u884C\uFF0C\u4E0D\u9700\u8981\u5B89\u88C5\u4EFB\u4F55\u8F6F\u4EF6", color: "#3b82f6" },
  { icon: Terminal, title: "\u4EA4\u4E92\u5F0F\u7EC8\u7AEF", desc: "\u5728\u6A21\u62DF\u7EC8\u7AEF\u91CC\u5B9E\u9645\u64CD\u4F5C\uFF0C\u4E0D\u662F\u770B\u89C6\u9891", color: "#10b981" },
  { icon: Bot, title: "AI \u6559\u7EC3", desc: "\u5185\u7F6E Claude Code \u6A21\u62DF\u5668\uFF0C\u5B66\u4F1A\u7528 AI \u5199\u4EE3\u7801", color: "#8b5cf6" },
  { icon: GitBranch, title: "\u771F\u5B9E\u6280\u80FD", desc: "Git\u3001GitHub\u3001PR \u5168\u6D41\u7A0B\uFF0C\u5B66\u5B8C\u5C31\u80FD\u4E0A\u624B", color: "#f59e0b" },
  { icon: Clock, title: "2-4 \u5C0F\u65F6", desc: "20 \u4E2A\u5173\u5361\uFF0C\u788E\u7247\u65F6\u95F4\u5C31\u80FD\u5B66\u5B8C", color: "#ef4444" },
  { icon: Shield, title: "9.9 \u901A\u5173\u8FD4\u73B0", desc: "\u5B8C\u6210\u6BD5\u4E1A\u6311\u6218\uFF0C\u5168\u989D\u9000\u8FD8", color: "#ec4899" },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      {/* Hero */}
      <section className="relative px-6 pt-20 pb-16 text-center max-w-3xl mx-auto overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gradient-radial from-blue-500/8 via-transparent to-transparent rounded-full blur-3xl" />
        </div>
        <motion.div {...fadeUp}>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-xs font-medium mb-8 border border-blue-500/20">
            <Zap size={12} />
            \u65B0\u624B\u53CB\u597D \u00B7 \u624B\u673A\u53EF\u5B66 \u00B7 \u901A\u5173\u8FD4\u73B0
          </div>
        </motion.div>

        <motion.h1
          {...fadeUp}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-[1.1]"
        >
          \u4ECE\u96F6\u5230{" "}
          <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient">
            Pull Request
          </span>
        </motion.h1>

        <motion.p
          {...fadeUp}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-[var(--color-text-secondary)] text-lg md:text-xl max-w-xl mx-auto mb-10 leading-relaxed"
        >
          2-4 \u5C0F\u65F6\u4EA4\u4E92\u5F0F\u6559\u7A0B\uFF0C\u6559\u4F60\u7528 Claude Code \u7ED9 GitHub \u9879\u76EE\u8D21\u732E\u4EE3\u7801\u3002
          <br className="hidden sm:block" />
          \u624B\u673A\u6D4F\u89C8\u5668\u5C31\u80FD\u5B66\u3002
        </motion.p>

        <motion.div
          {...fadeUp}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-3 justify-center"
        >
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white text-zinc-900 rounded-xl font-semibold hover:bg-zinc-100 transition-colors text-sm"
          >
            \u514D\u8D39\u5F00\u59CB\u5B66\u4E60
            <ArrowRight size={16} />
          </Link>
          <a
            href="https://github.com/shareAI-lab/learn-claude-code"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-transparent border border-[var(--color-border)] text-[var(--color-text-secondary)] rounded-xl font-medium hover:border-[var(--color-border-hover)] hover:text-[var(--color-text)] transition-colors text-sm"
          >
            <Github size={16} />
            GitHub \u5F00\u6E90\u4ED3\u5E93
          </a>
        </motion.div>
      </section>

      {/* Terminal Demo */}
      <section className="px-4 pb-20 max-w-2xl mx-auto">
        <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.2 }}>
          <TerminalDemo />
        </motion.div>
      </section>

      {/* Core Pattern */}
      <section className="px-4 pb-20 max-w-3xl mx-auto">
        <motion.div {...fadeUp} className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-3">
            \u5B66\u4E60\u5FAA\u73AF <span className="text-[var(--color-text-muted)] font-normal text-lg">The Learning Loop</span>
          </h2>
          <p className="text-[var(--color-text-secondary)] max-w-lg mx-auto">
            \u6BCF\u4E00\u5173\u90FD\u662F\u540C\u4E00\u4E2A\u6A21\u5F0F\uFF1A\u8BFB\u4EFB\u52A1 \u2192 \u5728\u7EC8\u7AEF\u64CD\u4F5C \u2192 \u81EA\u52A8\u9A8C\u8BC1 \u2192 \u8FC7\u5173\u3002
          </p>
        </motion.div>
        <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.1 }}>
          <AgentLoopDiagram />
        </motion.div>
      </section>

      {/* Learning Path */}
      <section className="px-4 pb-20 max-w-3xl mx-auto">
        <motion.div {...fadeUp} className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-3">
            \u5B66\u4E60\u8DEF\u5F84 <span className="text-[var(--color-text-muted)] font-normal text-lg">6 \u7AE0 20 \u5173</span>
          </h2>
          <p className="text-[var(--color-text-secondary)] max-w-lg mx-auto">
            \u4ECE\u201C\u8FD9\u662F\u4EC0\u4E48\u201D\u5230\u201C\u6211\u63D0\u4E86\u4E00\u4E2A PR\u201D\uFF0C\u6E10\u8FDB\u5F0F\u638C\u63E1\u6BCF\u4E2A\u6280\u80FD\u3002
          </p>
        </motion.div>

        <div className="space-y-3">
          {chapters.map((chapter, i) => {
            const meta = CHAPTER_META[chapter.id as keyof typeof CHAPTER_META];
            const colors = meta ? LAYER_COLORS[meta.layer] : null;
            return (
              <motion.div
                key={chapter.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
              >
                <Link
                  href="/"
                  className={`flex items-center gap-4 p-4 rounded-xl border transition-all group ${
                    colors
                      ? `${colors.bg} ${colors.border} hover:border-opacity-60`
                      : "bg-[var(--color-bg-card)] border-[var(--color-border)]"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 ${
                      colors ? colors.text : ""
                    }`}
                    style={meta ? { background: `${meta.color}20` } : {}}
                  >
                    {chapter.id}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm">{chapter.title}</span>
                      <span className={`text-xs ${colors?.text || "text-zinc-500"}`}>
                        {chapter.levels.length}\u5173
                      </span>
                    </div>
                    <div className="text-xs text-[var(--color-text-muted)] mt-0.5">
                      {meta?.motto}
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-[var(--color-text-muted)] group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Layer Overview */}
      <section className="px-4 pb-20 max-w-3xl mx-auto">
        <motion.div {...fadeUp} className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-3">
            \u5206\u5C42\u67B6\u6784 <span className="text-[var(--color-text-muted)] font-normal text-lg">Skill Layers</span>
          </h2>
          <p className="text-[var(--color-text-secondary)] max-w-lg mx-auto">
            \u6BCF\u4E00\u5C42\u5EFA\u7ACB\u5728\u524D\u4E00\u5C42\u4E4B\u4E0A\uFF0C\u5C42\u5C42\u9012\u8FDB\u3002
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {LAYERS.map((layer, i) => {
            const colors = LAYER_COLORS[layer.id];
            return (
              <motion.div
                key={layer.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className={`relative p-4 rounded-xl border overflow-hidden ${colors.bg} ${colors.border}`}
              >
                <div className="absolute top-0 left-0 w-1 h-full rounded-l-xl" style={{ background: layer.color }} />
                <div className={`text-sm font-semibold mb-1 ${colors.text}`}>{layer.label}</div>
                <div className="text-xs text-[var(--color-text-muted)]">
                  {layer.chapters.length === 1 ? `\u7B2C ${layer.chapters[0]} \u7AE0` : `\u7B2C ${layer.chapters[0]}-${layer.chapters[layer.chapters.length - 1]} \u7AE0`}
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Features */}
      <section className="px-4 pb-20 max-w-3xl mx-auto">
        <motion.div {...fadeUp} className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-3">
            \u4E3A\u4EC0\u4E48\u9009 PRSchool
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] hover:border-[var(--color-border-hover)] transition-colors"
            >
              <f.icon className="w-5 h-5 mb-3" style={{ color: f.color }} />
              <div className="font-medium text-sm mb-1">{f.title}</div>
              <div className="text-xs text-[var(--color-text-muted)] leading-relaxed">{f.desc}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 pb-20 max-w-lg mx-auto">
        <motion.div
          {...fadeUp}
          className="relative overflow-hidden rounded-2xl border border-[var(--color-border)] p-8 text-center"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5" />
          <div className="relative">
            <GraduationCap className="w-12 h-12 text-amber-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-3">9.9 \u5143 \u00B7 \u901A\u5173\u8FD4\u73B0</h3>
            <p className="text-[var(--color-text-secondary)] text-sm mb-8 leading-relaxed">
              \u5B8C\u6210\u5168\u90E8 20 \u5173\u5E76\u63D0\u4EA4\u6BD5\u4E1A PR\uFF0C\u81EA\u52A8\u9000\u8FD8 9.9 \u5143\u3002
              <br />
              \u5B66\u4E0D\u4F1A\u4E0D\u82B1\u94B1\uFF0C\u5B66\u4F1A\u4E86\u4E5F\u4E0D\u82B1\u94B1\u3002
            </p>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white text-zinc-900 rounded-xl font-semibold hover:bg-zinc-100 transition-colors text-sm w-full max-w-xs"
            >
              \u5F00\u59CB\u5B66\u4E60
              <ArrowRight size={16} />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="px-4 py-8 border-t border-[var(--color-border)] text-center text-xs text-[var(--color-text-muted)]">
        PRSchool \u00A9 2026 \u00B7 \u8BA9\u6BCF\u4E2A\u4EBA\u90FD\u80FD\u4E3A\u5F00\u6E90\u8D21\u732E\u4EE3\u7801
      </footer>
    </div>
  );
}
