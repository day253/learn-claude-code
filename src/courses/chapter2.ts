import { Chapter, Level } from "@/lib/course";
import { Shell } from "@/lib/shell";

const level2_1: Level = {
  id: "2-1",
  chapter: 2,
  order: 1,
  title: "什么是 Git？",
  description:
    "Git 是版本控制工具——它帮你记录文件的每一次修改，就像游戏的存档功能。写错了？随时回档。多人合作？各写各的，最后合并。",
  instructions: [
    "先来初始化一个 Git 仓库。",
    "用 `mkdir my-first-repo` 创建项目文件夹，然后 `cd my-first-repo` 进入。",
    "输入 `git init` — 这会在当前文件夹里创建一个隐藏的 .git 目录，Git 的所有数据都存在这里。",
    "输入 `git status` 看看当前仓库的状态。",
  ],
  hints: [
    "git init 只需要执行一次，在项目开始的时候",
    "git status 会告诉你哪些文件被修改了、哪些还没被追踪",
  ],
  checkpoints: [
    {
      id: "create-repo",
      description: "创建并进入 my-first-repo 文件夹",
      validate: (shell: Shell) => shell.fs.cwd.includes("my-first-repo"),
    },
    {
      id: "git-init",
      description: "运行 git init",
      validate: (shell: Shell) => shell.git.state.initialized,
    },
    {
      id: "git-status",
      description: "运行 git status",
      validate: (_shell: Shell, history: string[]) =>
        history.some((h) => h.trim() === "git status"),
    },
  ],
};

const level2_2: Level = {
  id: "2-2",
  chapter: 2,
  order: 2,
  title: "你的第一次提交",
  description:
    "Git 的提交（commit）就是一个存档点。每次提交前，你需要先告诉 Git 要保存哪些文件（暂存），然后写一句话描述这次改动。",
  instructions: [
    "我们已经在一个 Git 仓库里了。先创建一个文件：",
    "`echo '# My First Repo' > README.md`",
    "用 `git status` 看看——Git 会告诉你有一个未追踪的文件。",
    "用 `git add README.md` 把它加入暂存区。",
    "再 `git status` 看看变化。",
    "最后，用 `git commit -m '添加 README'` 完成你的第一次提交！",
  ],
  hints: [
    'git add 把文件放入"暂存区"——相当于先选好要存档的东西',
    "git commit -m '消息' 才是真正的存档操作",
    '提交消息应该简短说明"这次改了什么"',
  ],
  initialFS: {
    "home": {
      "user": {
        "my-first-repo": {
          ".git": {},
        },
      },
    },
  },
  initialCwd: "/home/user/my-first-repo",
  initialGit: true,
  checkpoints: [
    {
      id: "create-readme",
      description: "创建 README.md 文件",
      validate: (shell: Shell) =>
        shell.fs.exists(shell.fs.resolve("README.md")),
    },
    {
      id: "git-add",
      description: "用 git add 暂存文件",
      validate: (_shell: Shell, history: string[]) =>
        history.some((h) => h.includes("git add")),
    },
    {
      id: "git-commit",
      description: "用 git commit 完成提交",
      validate: (shell: Shell) => shell.git.state.commits.length > 0,
    },
  ],
};

const level2_3: Level = {
  id: "2-3",
  chapter: 2,
  order: 3,
  title: "查看历史和变更",
  description: "提交了代码之后，你随时可以回顾历史。git log 是你的时光机，git diff 是你的放大镜。",
  instructions: [
    "仓库里已经有一些提交了。先看看历史：",
    "输入 `git log` 查看提交记录。",
    "试试 `git log --oneline` 看更紧凑的版本。",
    "现在修改一下文件：`echo '这是新增的一行' >> README.md`",
    "用 `git diff` 看看你改了什么。",
    "然后把改动提交了：`git add .` 然后 `git commit -m '更新 README'`",
  ],
  hints: [
    "git log 按时间倒序显示所有提交",
    "git log --oneline 每条提交只显示一行",
    "git diff 显示工作区和暂存区的差异",
    "git add . 中的 . 表示当前目录下所有文件",
  ],
  initialFS: {
    "home": {
      "user": {
        "my-first-repo": {
          ".git": {},
          "README.md": "# My First Repo\n\n这是我的第一个 Git 项目。\n",
        },
      },
    },
  },
  initialCwd: "/home/user/my-first-repo",
  initialGit: true,
  checkpoints: [
    {
      id: "git-log",
      description: "用 git log 查看提交历史",
      validate: (_shell: Shell, history: string[]) =>
        history.some((h) => h.trim().startsWith("git log")),
    },
    {
      id: "modify-file",
      description: "修改 README.md（追加内容）",
      validate: (shell: Shell) => {
        const content = shell.fs.readFile(shell.fs.resolve("README.md")) || "";
        return content.includes("新增");
      },
    },
    {
      id: "git-diff",
      description: "用 git diff 查看变更",
      validate: (_shell: Shell, history: string[]) =>
        history.some((h) => h.trim() === "git diff"),
    },
    {
      id: "commit-changes",
      description: "暂存并提交修改",
      validate: (shell: Shell) => shell.git.state.commits.length >= 2,
    },
  ],
};

const level2_4: Level = {
  id: "2-4",
  chapter: 2,
  order: 4,
  title: "分支——平行宇宙",
  description:
    "分支是 Git 最强大的功能之一。想象你在写一篇文章，分支让你可以同时尝试两个不同的写法，最后选择最好的那个。",
  instructions: [
    "你正在 main 分支上。先看看当前有哪些分支：",
    "输入 `git branch` 查看分支列表。",
    "创建并切换到一个新分支：`git checkout -b feature`",
    "在新分支上做点改动：`echo '新功能代码' > feature.txt`",
    "暂存并提交：`git add .` → `git commit -m '添加新功能'`",
    "切回 main 分支：`git checkout main`",
    "用 `ls` 看看——feature.txt 不见了！它只在 feature 分支上。",
  ],
  hints: [
    "git checkout -b <name> = 创建新分支并切换过去",
    "每个分支有自己独立的文件状态",
    "git checkout <branch> 切换到已有的分支",
  ],
  initialFS: {
    "home": {
      "user": {
        "my-first-repo": {
          ".git": {},
          "README.md": "# My First Repo\n",
        },
      },
    },
  },
  initialCwd: "/home/user/my-first-repo",
  initialGit: true,
  checkpoints: [
    {
      id: "view-branches",
      description: "用 git branch 查看分支",
      validate: (_shell: Shell, history: string[]) =>
        history.some((h) => h.trim() === "git branch"),
    },
    {
      id: "create-branch",
      description: "创建并切换到 feature 分支",
      validate: (shell: Shell) =>
        shell.git.state.branches.includes("feature"),
    },
    {
      id: "commit-on-branch",
      description: "在 feature 分支上提交改动",
      validate: (shell: Shell) => shell.git.state.commits.length > 0,
    },
    {
      id: "switch-back",
      description: "切回 main 分支",
      validate: (shell: Shell) => shell.git.state.branch === "main",
    },
  ],
};

export const chapter2: Chapter = {
  id: 2,
  title: "Git 基础",
  description: "掌握版本控制的核心技能",
  levels: [level2_1, level2_2, level2_3, level2_4],
};
