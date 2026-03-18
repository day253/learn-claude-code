export const CHAPTER_META = {
  1: {
    layer: "terminal" as const,
    color: "#3B82F6",
    icon: "terminal",
    motto: "万丈高楼从命令行起",
  },
  2: {
    layer: "git" as const,
    color: "#10B981",
    icon: "git-branch",
    motto: "每次 commit 都是一个存档点",
  },
  3: {
    layer: "github" as const,
    color: "#8B5CF6",
    icon: "github",
    motto: "Fork 是开源协作的起点",
  },
  4: {
    layer: "pr" as const,
    color: "#F59E0B",
    icon: "git-pull-request",
    motto: "一个好的 PR 是一封礼貌的信",
  },
  5: {
    layer: "claude" as const,
    color: "#EF4444",
    icon: "bot",
    motto: "AI 是你的编程搭档",
  },
  6: {
    layer: "graduation" as const,
    color: "#EC4899",
    icon: "graduation-cap",
    motto: "你的第一个 PR，世界的一小步",
  },
} as const;

export type LayerId = "terminal" | "git" | "github" | "pr" | "claude" | "graduation";

export const LAYERS = [
  { id: "terminal" as const, label: "终端基础", color: "#3B82F6", chapters: [1] },
  { id: "git" as const, label: "版本控制", color: "#10B981", chapters: [2] },
  { id: "github" as const, label: "远程协作", color: "#8B5CF6", chapters: [3] },
  { id: "pr" as const, label: "Pull Request", color: "#F59E0B", chapters: [4] },
  { id: "claude" as const, label: "AI 编程", color: "#EF4444", chapters: [5] },
  { id: "graduation" as const, label: "毕业挑战", color: "#EC4899", chapters: [6] },
] as const;

export const LAYER_COLORS: Record<LayerId, { bg: string; border: string; text: string; dot: string }> = {
  terminal: { bg: "bg-blue-500/10", border: "border-blue-500/30", text: "text-blue-400", dot: "bg-blue-500" },
  git: { bg: "bg-emerald-500/10", border: "border-emerald-500/30", text: "text-emerald-400", dot: "bg-emerald-500" },
  github: { bg: "bg-purple-500/10", border: "border-purple-500/30", text: "text-purple-400", dot: "bg-purple-500" },
  pr: { bg: "bg-amber-500/10", border: "border-amber-500/30", text: "text-amber-400", dot: "bg-amber-500" },
  claude: { bg: "bg-red-500/10", border: "border-red-500/30", text: "text-red-400", dot: "bg-red-500" },
  graduation: { bg: "bg-pink-500/10", border: "border-pink-500/30", text: "text-pink-400", dot: "bg-pink-500" },
};
