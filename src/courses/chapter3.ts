import { Chapter, Level } from "@/lib/course";
import { Shell } from "@/lib/shell";

const level3_1: Level = {
  id: "3-1",
  chapter: 3,
  order: 1,
  title: "Fork — 把别人的项目复制一份",
  description:
    "在 GitHub 上，你不能直接修改别人的代码。你需要先 Fork（复制一份到你自己的账号下），然后在你的副本上修改。",
  instructions: [
    "想象你在 GitHub 上看到一个有趣的项目 `awesome-project`，你想贡献代码。",
    "第一步是 Fork。在真实的 GitHub 上，你只需要点一个按钮。在这里，我们模拟这个过程。",
    "输入 `git clone https://github.com/you/awesome-project.git` 模拟克隆你 Fork 后的仓库。",
    "进入项目目录 `cd awesome-project`，然后 `git remote -v` 查看远程仓库地址。",
  ],
  hints: [
    "Fork = 在 GitHub 上复制一份别人的仓库到你的账号",
    "Clone = 把远程仓库下载到本地",
    "remote -v 显示远程仓库的地址",
  ],
  checkpoints: [
    {
      id: "clone-repo",
      description: "克隆 awesome-project 仓库",
      validate: (shell: Shell) =>
        shell.fs.exists("/home/user/awesome-project"),
    },
    {
      id: "enter-repo",
      description: "进入 awesome-project 目录",
      validate: (shell: Shell) =>
        shell.fs.cwd.includes("awesome-project"),
    },
    {
      id: "check-remote",
      description: "用 git remote -v 查看远程地址",
      validate: (_shell: Shell, history: string[]) =>
        history.some((h) => h.includes("git remote")),
    },
  ],
};

const level3_2: Level = {
  id: "3-2",
  chapter: 3,
  order: 2,
  title: "在本地修改代码",
  description:
    "克隆下来之后，你就可以在本地自由修改了。好的习惯是：先创建一个新分支，在分支上改。",
  instructions: [
    "你已经在 awesome-project 目录里了。",
    "先创建一个新分支：`git checkout -b fix-typo`",
    "查看项目文件：`cat README.md`",
    "修复 README 中的错误：`echo '# Awesome Project\\n\\nThis is an awesome open source project.\\n\\nWelcome to contribute!' > README.md`",
    "检查修改：`git diff`",
    "暂存并提交：`git add .` 然后 `git commit -m 'fix: correct typo in README'`",
  ],
  hints: [
    "在新分支上改代码是最佳实践，这样 main 分支保持干净",
    "提交消息建议用 fix: / feat: / docs: 前缀",
  ],
  initialFS: {
    home: {
      user: {
        "awesome-project": {
          ".git": {},
          "README.md":
            "# Awsome Proejct\n\nThis is an awsome open sorce project.\n\nWelcom to contriubte!\n",
          "src": {
            "index.js": 'console.log("Hello World");\n',
          },
          LICENSE: "MIT License\n",
        },
      },
    },
  },
  initialCwd: "/home/user/awesome-project",
  initialGit: true,
  checkpoints: [
    {
      id: "create-branch",
      description: "创建并切换到新分支",
      validate: (shell: Shell) => shell.git.state.branch !== "main",
    },
    {
      id: "view-readme",
      description: "查看 README.md 内容",
      validate: (_shell: Shell, history: string[]) =>
        history.some((h) => h.includes("cat") && h.includes("README")),
    },
    {
      id: "fix-readme",
      description: "修改 README.md 修复错误",
      validate: (shell: Shell) => {
        const content = shell.fs.readFile(shell.fs.resolve("README.md")) || "";
        return !content.includes("Awsome") && !content.includes("Proejct");
      },
    },
    {
      id: "commit-fix",
      description: "暂存并提交修改",
      validate: (shell: Shell) => shell.git.state.commits.length > 0,
    },
  ],
};

const level3_3: Level = {
  id: "3-3",
  chapter: 3,
  order: 3,
  title: "Push — 推送到远程",
  description:
    "本地提交完成后，你需要把改动推送（Push）到 GitHub 上。这样别人才能看到你的修改。",
  instructions: [
    "你已经在 fix-typo 分支上提交了修改。",
    "现在把这个分支推送到远程：`git push`",
    "推送成功！接下来就可以在 GitHub 上创建 Pull Request 了。",
    "用 `git log --oneline` 再看一下你的提交记录。",
  ],
  hints: [
    "git push 把本地的提交上传到远程仓库",
    "第一次推送新分支时，GitHub 会自动创建远程分支",
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
          LICENSE: "MIT License\n",
        },
      },
    },
  },
  initialCwd: "/home/user/awesome-project",
  initialGit: true,
  checkpoints: [
    {
      id: "git-push",
      description: "推送到远程仓库",
      validate: (_shell: Shell, history: string[]) =>
        history.some((h) => h.trim() === "git push"),
    },
    {
      id: "view-log",
      description: "用 git log 查看提交记录",
      validate: (_shell: Shell, history: string[]) =>
        history.some((h) => h.startsWith("git log")),
    },
  ],
};

export const chapter3: Chapter = {
  id: 3,
  title: "GitHub 入门",
  description: "学会 Fork、Clone、Push 的完整流程",
  levels: [level3_1, level3_2, level3_3],
};
