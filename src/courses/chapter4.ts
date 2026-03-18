import { Chapter, Level } from "@/lib/course";
import { Shell } from "@/lib/shell";

const level4_1: Level = {
  id: "4-1",
  chapter: 4,
  order: 1,
  title: "什么是 Pull Request？",
  description:
    'Pull Request（PR）是你对别人说："嘿，我改了点东西，你看看要不要合并到主项目？"。它是开源协作的核心方式。',
  instructions: [
    "PR 的完整流程是这样的：",
    "1. Fork 别人的项目 → 2. 克隆到本地 → 3. 新建分支 → 4. 修改代码 → 5. 提交 → 6. Push → **7. 创建 PR**",
    "你已经完成了 1-6，现在来模拟创建 PR。",
    "在真实的 GitHub 上，你会在网页上点按钮创建 PR。这里我们模拟一下：",
    "输入 `echo 'PR Title: fix typo in README' > .pr-title`",
    "输入 `echo 'Fixed spelling errors in README.md' > .pr-body`",
    "然后 `cat .pr-title` 和 `cat .pr-body` 确认内容。",
  ],
  hints: [
    "PR 标题应该简洁明了，说清楚改了什么",
    "PR 描述可以更详细——改了什么、为什么改、怎么测试",
    "好的 PR 让审核者一眼就能理解你的意图",
  ],
  initialFS: {
    home: {
      user: {
        "awesome-project": {
          ".git": {},
          "README.md":
            "# Awesome Project\n\nThis is an awesome open source project.\n\nWelcome to contribute!\n",
          "src": {
            "index.js": 'console.log("Hello World");\n',
          },
        },
      },
    },
  },
  initialCwd: "/home/user/awesome-project",
  initialGit: true,
  checkpoints: [
    {
      id: "write-title",
      description: "写 PR 标题",
      validate: (shell: Shell) => {
        const content = shell.fs.readFile(shell.fs.resolve(".pr-title")) || "";
        return content.trim().length > 0;
      },
    },
    {
      id: "write-body",
      description: "写 PR 描述",
      validate: (shell: Shell) => {
        const content = shell.fs.readFile(shell.fs.resolve(".pr-body")) || "";
        return content.trim().length > 0;
      },
    },
    {
      id: "verify-pr",
      description: "确认 PR 内容",
      validate: (_shell: Shell, history: string[]) =>
        history.some((h) => h.includes("cat") && h.includes(".pr-")),
    },
  ],
};

const level4_2: Level = {
  id: "4-2",
  chapter: 4,
  order: 2,
  title: "写好 PR 描述",
  description:
    "一个好的 PR 描述是礼貌的开始。它帮助维护者理解你的改动，大大提高被合并的概率。",
  instructions: [
    "来学习写一个规范的 PR 描述。通常包含：",
    "**What（改了什么）** — 简要说明改动内容",
    "**Why（为什么改）** — 背景和动机",
    "**How（怎么改的）** — 技术细节（如果有的话）",
    "来试试创建一个完整的 PR 描述文件：",
    "```",
    "echo '## What\\nFixed typos in README.md\\n\\n## Why\\nImproved readability for new contributors\\n\\n## Changes\\n- Fixed spelling of project name\\n- Fixed word contrubte -> contribute' > PR_DESCRIPTION.md",
    "```",
    "然后 `cat PR_DESCRIPTION.md` 检查一下。",
  ],
  hints: [
    "维护者每天可能收到很多 PR，好的描述帮他们节省时间",
    "可以提供截图、before/after 对比",
    "有关联的 Issue 记得用 Fixes #123 链接",
  ],
  initialFS: {
    home: {
      user: {
        "awesome-project": {
          ".git": {},
          "README.md":
            "# Awesome Project\n\nThis is an awesome open source project.\n",
        },
      },
    },
  },
  initialCwd: "/home/user/awesome-project",
  initialGit: true,
  checkpoints: [
    {
      id: "create-description",
      description: "创建 PR 描述文件",
      validate: (shell: Shell) => {
        const content =
          shell.fs.readFile(shell.fs.resolve("PR_DESCRIPTION.md")) || "";
        return content.length > 20;
      },
    },
    {
      id: "verify-description",
      description: "查看并确认描述内容",
      validate: (_shell: Shell, history: string[]) =>
        history.some(
          (h) => h.includes("cat") && h.includes("PR_DESCRIPTION"),
        ),
    },
  ],
};

const level4_3: Level = {
  id: "4-3",
  chapter: 4,
  order: 3,
  title: "Code Review — 应对审查意见",
  description:
    '提交 PR 后，维护者会审查你的代码（Code Review）。他们可能会提出修改意见。这不是批评，而是正常的协作流程。别紧张！',
  instructions: [
    "假设维护者给你留了 Review 意见：",
    '> "README 里最好加一个 Getting Started 部分，方便新人上手。"',
    "你需要根据意见修改代码，然后追加提交。",
    "先看看当前 README：`cat README.md`",
    "追加 Getting Started 部分：`echo '\\n## Getting Started\\n\\n1. Clone this repo\\n2. Run npm install\\n3. Run npm start' >> README.md`",
    "暂存提交：`git add .` → `git commit -m 'docs: add Getting Started section per review'`",
    "推送更新：`git push`（PR 会自动更新）",
  ],
  hints: [
    "Review 意见是学习的好机会",
    "追加提交会自动出现在 PR 里，不需要重新创建",
    "提交消息里可以提到 per review 表示这是根据审查修改的",
  ],
  initialFS: {
    home: {
      user: {
        "awesome-project": {
          ".git": {},
          "README.md":
            "# Awesome Project\n\nThis is an awesome open source project.\n\nWelcome to contribute!\n",
          "src": {
            "index.js": 'console.log("Hello World");\n',
          },
        },
      },
    },
  },
  initialCwd: "/home/user/awesome-project",
  initialGit: true,
  checkpoints: [
    {
      id: "read-readme",
      description: "查看当前 README 内容",
      validate: (_shell: Shell, history: string[]) =>
        history.some((h) => h.includes("cat") && h.includes("README")),
    },
    {
      id: "add-section",
      description: "添加 Getting Started 部分",
      validate: (shell: Shell) => {
        const content =
          shell.fs.readFile(shell.fs.resolve("README.md")) || "";
        return (
          content.toLowerCase().includes("getting started") ||
          content.toLowerCase().includes("start")
        );
      },
    },
    {
      id: "commit-update",
      description: "提交修改",
      validate: (shell: Shell) => shell.git.state.commits.length > 0,
    },
    {
      id: "push-update",
      description: "推送更新",
      validate: (_shell: Shell, history: string[]) =>
        history.some((h) => h.trim() === "git push"),
    },
  ],
};

const level4_4: Level = {
  id: "4-4",
  chapter: 4,
  order: 4,
  title: "合并！你的第一个贡献",
  description:
    "维护者满意了，点击了 Merge 按钮。恭喜！你的代码正式成为了开源项目的一部分！",
  instructions: [
    "你的 PR 已经被合并了！来庆祝一下。",
    "在真实世界中，合并后你通常需要做一些清理工作：",
    "切回 main 分支：`git checkout main`",
    "查看一下分支列表：`git branch`",
    "现在你已经掌握了完整的 PR 流程！回顾一下：",
    "Fork → Clone → Branch → Edit → Commit → Push → PR → Review → Merge",
    "输入 `echo 'I made my first PR!' > celebration.txt` 来庆祝！",
  ],
  hints: [
    "合并后，你的 GitHub 贡献图会多一个绿色格子",
    "第一个 PR 是最难的，后面会越来越顺",
  ],
  initialFS: {
    home: {
      user: {
        "awesome-project": {
          ".git": {},
          "README.md":
            "# Awesome Project\n\nThis is an awesome open source project.\n\nWelcome to contribute!\n\n## Getting Started\n\n1. Clone this repo\n2. Run npm install\n3. Run npm start\n",
          "src": {
            "index.js": 'console.log("Hello World");\n',
          },
        },
      },
    },
  },
  initialCwd: "/home/user/awesome-project",
  initialGit: true,
  checkpoints: [
    {
      id: "switch-main",
      description: "切回 main 分支",
      validate: (shell: Shell) => shell.git.state.branch === "main",
    },
    {
      id: "view-branches",
      description: "查看分支列表",
      validate: (_shell: Shell, history: string[]) =>
        history.some((h) => h.trim() === "git branch"),
    },
    {
      id: "celebrate",
      description: "创建庆祝文件！",
      validate: (shell: Shell) =>
        shell.fs.exists(shell.fs.resolve("celebration.txt")),
    },
  ],
};

export const chapter4: Chapter = {
  id: 4,
  title: "Pull Request 全流程",
  description: "学会创建、描述、回应审查、完成你的第一个 PR",
  levels: [level4_1, level4_2, level4_3, level4_4],
};
