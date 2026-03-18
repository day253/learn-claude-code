"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { Shell } from "@/lib/shell";
import { processClaudeInput, simulateTypingDelay } from "@/lib/claude-sim";

interface TerminalProps {
  shell: Shell;
  onCommand?: (cmd: string) => void;
}

interface TermLine {
  type: "prompt" | "output" | "claude-thinking" | "claude-action" | "claude-reply";
  text: string;
}

export default function Terminal({ shell, onCommand }: TerminalProps) {
  const [lines, setLines] = useState<TermLine[]>([]);
  const [input, setInput] = useState("");
  const [historyIdx, setHistoryIdx] = useState(-1);
  const [claudeMode, setClaudeMode] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLines([
      {
        type: "output",
        text: "\u6B22\u8FCE\u6765\u5230 PRSchool \u7EC8\u7AEF\uFF01\u8F93\u5165 help \u67E5\u770B\u53EF\u7528\u547D\u4EE4\u3002",
      },
    ]);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines]);

  const addLine = useCallback((line: TermLine) => {
    setLines((prev) => [...prev, line]);
  }, []);

  const handleClaudeInput = useCallback(
    async (text: string) => {
      addLine({ type: "prompt", text: `\u{1F916} claude > ${text}` });
      setIsTyping(true);

      const response = processClaudeInput(shell, text);

      await new Promise((r) => setTimeout(r, simulateTypingDelay()));
      addLine({ type: "claude-thinking", text: `\u{1F4AD} ${response.thinking}` });

      for (const action of response.actions) {
        await new Promise((r) => setTimeout(r, simulateTypingDelay()));
        addLine({ type: "claude-action", text: `  \u25B6 ${action.command}` });
        if (action.output) {
          addLine({ type: "output", text: `  ${action.output}` });
        }
      }

      await new Promise((r) => setTimeout(r, simulateTypingDelay()));
      addLine({ type: "claude-reply", text: response.reply });

      setIsTyping(false);
      onCommand?.(text);
    },
    [shell, onCommand, addLine],
  );

  const handleSubmit = useCallback(
    (e?: React.FormEvent) => {
      e?.preventDefault();
      if (isTyping) return;
      const cmd = input.trim();

      if (!claudeMode) {
        const prompt = shell.prompt;
        setLines((prev) => [...prev, { type: "prompt", text: prompt + cmd }]);

        if (cmd) {
          if (cmd === "claude") {
            setClaudeMode(true);
            setLines((prev) => [
              ...prev,
              {
                type: "claude-reply",
                text: "\u{1F916} Claude Code \u5DF2\u542F\u52A8\uFF01\u76F4\u63A5\u7528\u81EA\u7136\u8BED\u8A00\u544A\u8BC9\u6211\u4F60\u60F3\u505A\u4EC0\u4E48\u3002\n\u8F93\u5165 exit \u9000\u51FA Claude \u6A21\u5F0F\u3002",
              },
            ]);
            shell.history.push(cmd);
            onCommand?.(cmd);
          } else {
            const result = shell.exec(cmd);
            if (result.output) {
              if (result.output === "\x1b[2J\x1b[H") {
                setLines([]);
              } else {
                setLines((prev) => [
                  ...prev,
                  { type: "output", text: result.output },
                ]);
              }
            }
            onCommand?.(cmd);
          }
        }
      } else {
        if (cmd === "exit" || cmd === "quit") {
          setClaudeMode(false);
          addLine({ type: "prompt", text: `\u{1F916} claude > ${cmd}` });
          addLine({ type: "output", text: "\u5DF2\u9000\u51FA Claude Code \u6A21\u5F0F\u3002" });
        } else if (cmd) {
          shell.history.push(cmd);
          handleClaudeInput(cmd);
        }
      }

      setInput("");
      setHistoryIdx(-1);
    },
    [input, shell, onCommand, claudeMode, isTyping, handleClaudeInput, addLine],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowUp") {
        e.preventDefault();
        const history = shell.history;
        if (history.length === 0) return;
        const newIdx =
          historyIdx === -1 ? history.length - 1 : Math.max(0, historyIdx - 1);
        setHistoryIdx(newIdx);
        setInput(history[newIdx]);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        const history = shell.history;
        if (historyIdx === -1) return;
        const newIdx = historyIdx + 1;
        if (newIdx >= history.length) {
          setHistoryIdx(-1);
          setInput("");
        } else {
          setHistoryIdx(newIdx);
          setInput(history[newIdx]);
        }
      }
    },
    [shell.history, historyIdx],
  );

  const focusInput = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  const currentPrompt = claudeMode ? "\u{1F916} claude > " : shell.prompt;

  return (
    <div
      className="bg-[#0f172a] text-[#e2e8f0] font-mono text-sm flex flex-col h-full"
      onClick={focusInput}
    >
      {/* Terminal header */}
      <div className="flex items-center gap-2 px-4 py-2.5 bg-[#0c1322] border-b border-[#1e293b]">
        <div className="w-3 h-3 rounded-full bg-red-500/70" />
        <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
        <div className="w-3 h-3 rounded-full bg-green-500/70" />
        <span className="ml-2 text-xs text-zinc-600 font-mono">
          {claudeMode ? "claude code" : "terminal"}
        </span>
        {claudeMode && (
          <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
            AI \u6A21\u5F0F
          </span>
        )}
      </div>

      {/* Terminal body */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-1 min-h-0"
      >
        {lines.map((line, i) => (
          <div key={i} className="whitespace-pre-wrap break-all leading-relaxed">
            {line.type === "prompt" ? (
              line.text.startsWith("\u{1F916}") ? (
                <span>
                  <span className="text-purple-400">
                    {line.text.split("> ")[0]}&gt;{" "}
                  </span>
                  <span className="text-zinc-200">
                    {line.text.split("> ").slice(1).join("> ")}
                  </span>
                </span>
              ) : (
                <span>
                  <span className="text-blue-400">
                    {line.text.split("$ ")[0]}${" "}
                  </span>
                  <span className="text-zinc-200">
                    {line.text.split("$ ").slice(1).join("$ ")}
                  </span>
                </span>
              )
            ) : line.type === "claude-thinking" ? (
              <span className="text-zinc-600 italic text-xs">{line.text}</span>
            ) : line.type === "claude-action" ? (
              <span className="text-amber-400">{line.text}</span>
            ) : line.type === "claude-reply" ? (
              <span className="text-emerald-400">{line.text}</span>
            ) : (
              <span className="text-zinc-400">{line.text}</span>
            )}
          </div>
        ))}
        {isTyping && (
          <div className="text-purple-400 animate-pulse text-xs">
            Claude \u6B63\u5728\u601D\u8003...
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex items-center">
          <span
            className={`${claudeMode ? "text-purple-400" : "text-blue-400"} whitespace-pre`}
          >
            {currentPrompt}
          </span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isTyping}
            className="flex-1 bg-transparent outline-none text-zinc-200 caret-blue-400 min-w-0 disabled:opacity-50"
            autoFocus
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            placeholder={claudeMode ? "\u7528\u81EA\u7136\u8BED\u8A00\u63CF\u8FF0\u4F60\u60F3\u505A\u4EC0\u4E48..." : ""}
          />
        </form>
      </div>
    </div>
  );
}
