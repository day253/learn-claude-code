"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import Terminal from "@/components/Terminal";
import LevelPanel from "@/components/LevelPanel";
import ChapterSelect from "@/components/ChapterSelect";
import Confetti from "@/components/Confetti";
import GraduationModal from "@/components/GraduationModal";
import Toast from "@/components/Toast";
import Onboarding from "@/components/Onboarding";
import { Shell } from "@/lib/shell";
import { VirtualFS } from "@/lib/vfs";
import {
  CourseProgress,
  createProgress,
  validateCheckpoints,
  isLevelComplete,
  saveProgress,
  loadProgress,
} from "@/lib/course";
import {
  getLevelById,
  getNextLevel,
  getPrevLevel,
  getChapterForLevel,
  getAllLevels,
} from "@/courses";
import { CHAPTER_META } from "@/lib/constants";
import { Menu, X, BookOpen } from "lucide-react";

function createShellForLevel(levelId: string): Shell {
  const level = getLevelById(levelId);
  const fs = new VirtualFS();
  const shell = new Shell(fs);

  if (level?.initialFS) {
    fs.loadSnapshot(level.initialFS, "/");
  }

  if (level?.initialCwd) {
    fs.cd(level.initialCwd);
  } else {
    fs.cd("/home/user");
  }

  if (level?.initialGit) {
    shell.git.state.initialized = true;
    shell.git.state.branches = ["main"];
    shell.git.state.branch = "main";
    shell.git.state.remotes["origin"] =
      "https://github.com/you/awesome-project.git";

    if (level.id === "2-3") {
      shell.git.state.commits.push({
        hash: "a1b2c3d",
        message: "Initial commit",
        timestamp: Date.now() - 86400000,
        files: ["/home/user/my-first-repo/README.md"],
      });
    }

    if (level.id === "3-3" || level.id === "4-3") {
      shell.git.state.branch = "fix-typo";
      shell.git.state.branches = ["main", "fix-typo"];
      shell.git.state.commits.push({
        hash: "b2c3d4e",
        message: "fix: correct typo in README",
        timestamp: Date.now() - 3600000,
        files: ["/home/user/awesome-project/README.md"],
      });
    }

    if (level.id === "6-2") {
      shell.git.state.branch = "add-my-profile";
      shell.git.state.branches = ["main", "add-my-profile"];
      shell.git.state.commits.push({
        hash: "c3d4e5f",
        message: "feat: add my student profile",
        timestamp: Date.now() - 1800000,
        files: ["/home/user/playground/students/graduate.json"],
      });
    }
  }

  return shell;
}

export default function Home() {
  const [showOnboarding, setShowOnboarding] = useState(() => {
    if (typeof window === "undefined") return false;
    return !localStorage.getItem("prschool_onboarded");
  });
  const [view, setView] = useState<"chapters" | "level">("chapters");
  const [progress, setProgress] = useState<CourseProgress>(() =>
    createProgress("1-1"),
  );
  const [currentLevelId, setCurrentLevelId] = useState("1-1");
  const [shell, setShell] = useState<Shell>(() => createShellForLevel("1-1"));
  const [checkpointStates, setCheckpointStates] = useState<
    Record<string, boolean>
  >({});
  const [showPanel, setShowPanel] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showGraduation, setShowGraduation] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "achievement";
  } | null>(null);
  const progressRef = useRef(progress);
  progressRef.current = progress;

  useEffect(() => {
    const saved = loadProgress();
    if (saved) {
      setProgress(saved);
      setCurrentLevelId(saved.currentLevel);
    }
  }, []);

  const currentLevel = getLevelById(currentLevelId);
  const chapter = currentLevel ? getChapterForLevel(currentLevel.id) : null;
  const nextLevel = getNextLevel(currentLevelId);
  const prevLevel = getPrevLevel(currentLevelId);
  const complete = currentLevel ? isLevelComplete(currentLevel, shell) : false;
  const totalLevels = getAllLevels().length;

  const meta = currentLevel
    ? CHAPTER_META[currentLevel.chapter as keyof typeof CHAPTER_META]
    : null;
  const layerColor = meta?.color || "#3b82f6";

  const navigateToLevel = useCallback((levelId: string) => {
    const newShell = createShellForLevel(levelId);
    setShell(newShell);
    setCurrentLevelId(levelId);
    setCheckpointStates({});
    setView("level");

    const newProgress = {
      ...progressRef.current,
      currentLevel: levelId,
    };
    setProgress(newProgress);
    saveProgress(newProgress);
  }, []);

  const handleCommand = useCallback(() => {
    if (!currentLevel) return;
    const states = validateCheckpoints(currentLevel, shell);
    setCheckpointStates(states);

    const prevStates =
      progressRef.current.checkpointStates[currentLevel.id] || {};
    const newlyCompleted = Object.entries(states).find(
      ([id, done]) => done && !prevStates[id],
    );

    if (newlyCompleted) {
      const cp = currentLevel.checkpoints.find(
        (c) => c.id === newlyCompleted[0],
      );
      if (cp) {
        setToast({ message: `\u2713 ${cp.description}`, type: "success" });
      }
    }

    const nowComplete = isLevelComplete(currentLevel, shell);
    const wasComplete = progressRef.current.completedLevels.has(
      currentLevel.id,
    );

    if (nowComplete) {
      const newProgress: CourseProgress = {
        ...progressRef.current,
        completedLevels: new Set([
          ...progressRef.current.completedLevels,
          currentLevel.id,
        ]),
        checkpointStates: {
          ...progressRef.current.checkpointStates,
          [currentLevel.id]: states,
        },
      };
      setProgress(newProgress);
      saveProgress(newProgress);

      if (!wasComplete) {
        setShowConfetti(true);
        setToast({
          message: `\u{1F389} \u5173\u5361\u901A\u8FC7\uFF01${currentLevel.title}`,
          type: "achievement",
        });
        if (currentLevel.id === "6-2") {
          setTimeout(() => setShowGraduation(true), 1500);
        }
      }
    } else {
      const newProgress: CourseProgress = {
        ...progressRef.current,
        checkpointStates: {
          ...progressRef.current.checkpointStates,
          [currentLevel.id]: states,
        },
      };
      setProgress(newProgress);
      saveProgress(newProgress);
    }
  }, [currentLevel, shell]);

  if (showOnboarding) {
    return <Onboarding onDone={() => setShowOnboarding(false)} />;
  }

  if (view === "chapters") {
    return (
      <>
        <ChapterSelect progress={progress} onSelectLevel={navigateToLevel} />
        {showGraduation && (
          <GraduationModal
            onClose={() => setShowGraduation(false)}
            completedLevels={progress.completedLevels.size}
            totalLevels={totalLevels}
          />
        )}
      </>
    );
  }

  return (
    <div className="h-[100dvh] flex flex-col bg-[var(--color-bg)] overflow-hidden">
      {toast && (
        <Toast
          key={toast.message + Date.now()}
          message={toast.message}
          type={toast.type}
          onDone={() => setToast(null)}
        />
      )}
      {showConfetti && <Confetti onDone={() => setShowConfetti(false)} />}
      {showGraduation && (
        <GraduationModal
          onClose={() => setShowGraduation(false)}
          completedLevels={progress.completedLevels.size}
          totalLevels={totalLevels}
        />
      )}

      {/* Top bar */}
      <div className="flex items-center justify-between px-3 py-2 bg-[var(--color-bg)] border-b border-[var(--color-border)]">
        <button
          onClick={() => setView("chapters")}
          className="flex items-center gap-1.5 text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
        >
          <BookOpen size={14} />
          目录
        </button>
        <div className="flex items-center gap-2">
          <div
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: layerColor }}
          />
          <span className="text-xs text-[var(--color-text-secondary)] font-medium truncate max-w-[200px]">
            {currentLevel?.order}. {currentLevel?.title}
          </span>
        </div>
        <button
          onClick={() => setShowPanel(!showPanel)}
          className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors p-1"
        >
          {showPanel ? <X size={16} /> : <Menu size={16} />}
        </button>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
        {showPanel && currentLevel && chapter && (
          <div className="h-[45%] md:h-full md:w-[380px] shrink-0 border-b md:border-b-0 md:border-r border-[var(--color-border)] overflow-hidden">
            <LevelPanel
              level={currentLevel}
              checkpointStates={checkpointStates}
              onPrev={
                prevLevel ? () => navigateToLevel(prevLevel.id) : undefined
              }
              onNext={
                nextLevel ? () => navigateToLevel(nextLevel.id) : undefined
              }
              isComplete={complete}
              hasPrev={!!prevLevel}
              hasNext={!!nextLevel}
              chapterTitle={chapter.title}
            />
          </div>
        )}

        <div className="flex-1 min-h-0">
          <Terminal shell={shell} onCommand={handleCommand} />
        </div>
      </div>
    </div>
  );
}
