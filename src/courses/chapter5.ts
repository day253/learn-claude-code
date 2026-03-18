import { Chapter, Level } from "@/lib/course";
import { Shell } from "@/lib/shell";

const level5_1: Level = {
  id: "5-1",
  chapter: 5,
  order: 1,
  title: "认识 Claude Code",
  description:
    "Claude Code 是一个 AI 编程助手，它可以在终端里帮你读代码、改代码、运行命令。你不需要自己敲每一行，只需要告诉它你想做什么。",
  instructions: [
    "Claude Code 的工作方式很简单：",
    "1. 你用自然语言描述需求",
    "2. Claude 理解后帮你执行操作",
    "3. 你确认结果，继续下一步",
    "在这一关，我们先体验一下 Claude Code 模式。",
    "输入 `claude` 启动 Claude Code 模拟器。",
    "然后试着对它说：`帮我看看当前目录有什么文件`",
    "再说：`帮我读一下 README.md 的内容`",
  ],
  hints: [
    "Claude Code 就像有个程序员坐在你旁边帮你操作",
    "你说中文它也能理解",
    "不确定怎么做的时候，直接问它",
  ],
  initialFS: {
    home: {
      user: {
        "demo-project": {
          ".git": {},
          "README.md": "# Demo Project\n\nA simple demo for learning Claude Code.\n",
          "src": {
            "app.js":
              'const express = require("express");\nconst app = express();\n\napp.get("/", (req, res) => {\n  res.send("Hello World");\n});\n\napp.listen(3000);\n',
          },
          "package.json":
            '{\n  "name": "demo-project",\n  "version": "1.0.0",\n  "main": "src/app.js",\n  "dependencies": {\n    "express": "^4.18.0"\n  }\n}\n',
        },
      },
    },
  },
  initialCwd: "/home/user/demo-project",
  initialGit: true,
  checkpoints: [
    {
      id: "start-claude",
      description: "启动 Claude Code",
      validate: (_shell: Shell, history: string[]) =>
        history.some((h) => h.trim() === "claude"),
    },
    {
      id: "ask-ls",
      description: "让 Claude 查看文件",
      validate: (_shell: Shell, history: string[]) =>
        history.some(
          (h) =>
            h.includes("文件") ||
            h.includes("目录") ||
            h.includes("看看") ||
            h.includes("list"),
        ),
    },
    {
      id: "ask-read",
      description: "让 Claude 读取文件",
      validate: (_shell: Shell, history: string[]) =>
        history.some(
          (h) =>
            h.includes("README") ||
            h.includes("读") ||
            h.includes("read") ||
            h.includes("内容"),
        ),
    },
  ],
};

const level5_2: Level = {
  id: "5-2",
  chapter: 5,
  order: 2,
  title: "让 Claude 帮你改代码",
  description:
    "Claude Code 最强大的地方是它可以直接帮你修改文件。你描述要改什么，它来动手。",
  instructions: [
    "你正在一个 Express 项目里。来让 Claude 帮你做些修改。",
    "启动 Claude Code：`claude`",
    "试试对它说：`给 app.js 添加一个 /about 路由，返回项目信息`",
    "然后说：`帮我看看修改后的 app.js`",
    "最后说：`帮我提交这个修改，消息写 feat: add about route`",
  ],
  hints: [
    "Claude 会直接修改文件，你可以用 cat 验证",
    "像跟人说话一样描述需求就行",
    "如果结果不满意，可以让它重新修改",
  ],
  initialFS: {
    home: {
      user: {
        "demo-project": {
          ".git": {},
          "README.md": "# Demo Project\n\nA simple demo.\n",
          "src": {
            "app.js":
              'const express = require("express");\nconst app = express();\n\napp.get("/", (req, res) => {\n  res.send("Hello World");\n});\n\napp.listen(3000);\n',
          },
        },
      },
    },
  },
  initialCwd: "/home/user/demo-project",
  initialGit: true,
  checkpoints: [
    {
      id: "start-claude",
      description: "启动 Claude Code",
      validate: (_shell: Shell, history: string[]) =>
        history.some((h) => h.trim() === "claude"),
    },
    {
      id: "ask-modify",
      description: "让 Claude 修改代码",
      validate: (_shell: Shell, history: string[]) =>
        history.some(
          (h) =>
            h.includes("添加") ||
            h.includes("add") ||
            h.includes("路由") ||
            h.includes("route") ||
            h.includes("修改") ||
            h.includes("改"),
        ),
    },
    {
      id: "ask-commit",
      description: "让 Claude 提交修改",
      validate: (_shell: Shell, history: string[]) =>
        history.some(
          (h) =>
            h.includes("提交") ||
            h.includes("commit"),
        ),
    },
  ],
};

const level5_3: Level = {
  id: "5-3",
  chapter: 5,
  order: 3,
  title: "用 Claude Code 做 Git 操作",
  description:
    "你不需要记住所有 Git 命令。Claude Code 可以帮你处理分支、提交、推送等所有 Git 操作。",
  instructions: [
    "来体验让 Claude 处理完整的 Git 工作流。",
    "启动 Claude Code：`claude`",
    "说：`帮我创建一个叫 add-tests 的新分支`",
    "说：`在 src 目录下创建一个 test.js 测试文件`",
    "说：`帮我暂存所有改动然后提交，消息是 test: add basic tests`",
    "说：`推送到远程`",
  ],
  hints: [
    "Claude 知道 Git 的所有命令，你只需要用自然语言描述意图",
    "创建分支 + 修改 + 提交 + 推送，Claude 都能一步搞定",
  ],
  initialFS: {
    home: {
      user: {
        "demo-project": {
          ".git": {},
          "README.md": "# Demo Project\n\nA simple demo.\n",
          "src": {
            "app.js":
              'const express = require("express");\nconst app = express();\n\napp.get("/", (req, res) => {\n  res.send("Hello World");\n});\n\napp.listen(3000);\n',
          },
        },
      },
    },
  },
  initialCwd: "/home/user/demo-project",
  initialGit: true,
  checkpoints: [
    {
      id: "start-claude",
      description: "启动 Claude Code",
      validate: (_shell: Shell, history: string[]) =>
        history.some((h) => h.trim() === "claude"),
    },
    {
      id: "ask-branch",
      description: "让 Claude 创建分支",
      validate: (_shell: Shell, history: string[]) =>
        history.some(
          (h) =>
            h.includes("分支") ||
            h.includes("branch") ||
            h.includes("add-tests"),
        ),
    },
    {
      id: "ask-create-file",
      description: "让 Claude 创建测试文件",
      validate: (_shell: Shell, history: string[]) =>
        history.some(
          (h) =>
            h.includes("test") ||
            h.includes("测试") ||
            h.includes("创建"),
        ),
    },
    {
      id: "ask-push",
      description: "让 Claude 推送到远程",
      validate: (_shell: Shell, history: string[]) =>
        history.some(
          (h) =>
            h.includes("推送") ||
            h.includes("push") ||
            h.includes("远程"),
        ),
    },
  ],
};

const level5_4: Level = {
  id: "5-4",
  chapter: 5,
  order: 4,
  title: "用 Claude Code 提 PR",
  description:
    "现在把所有技能串起来：用 Claude Code 完成从 Fork 到 PR 的全部流程。这就是你毕业后的日常操作。",
  instructions: [
    "来走一遍完整流程。启动 Claude Code：`claude`",
    "说：`帮我 clone https://github.com/learn-claude-code/practice-repo.git`",
    "说：`创建一个 my-contribution 分支`",
    "说：`在根目录创建 students/my-name.json，内容是我的学习记录`",
    "说：`提交并推送`",
    "说：`帮我写一个 PR 描述`",
    "恭喜！你已经掌握了用 Claude Code 贡献开源代码的完整技能！",
  ],
  hints: [
    "实际使用中，Claude Code 可以帮你分析代码库、理解项目结构",
    "有不懂的随时问 Claude，它可以解释任何代码",
  ],
  initialFS: {
    home: {
      user: {},
    },
  },
  checkpoints: [
    {
      id: "start-claude",
      description: "启动 Claude Code",
      validate: (_shell: Shell, history: string[]) =>
        history.some((h) => h.trim() === "claude"),
    },
    {
      id: "ask-clone",
      description: "让 Claude 克隆仓库",
      validate: (_shell: Shell, history: string[]) =>
        history.some(
          (h) =>
            h.includes("clone") || h.includes("克隆"),
        ),
    },
    {
      id: "ask-create-branch",
      description: "让 Claude 创建分支",
      validate: (_shell: Shell, history: string[]) =>
        history.some(
          (h) =>
            h.includes("分支") ||
            h.includes("branch") ||
            h.includes("contribution"),
        ),
    },
    {
      id: "ask-create-commit-push",
      description: "让 Claude 创建文件、提交并推送",
      validate: (_shell: Shell, history: string[]) =>
        history.some(
          (h) =>
            h.includes("提交") ||
            h.includes("commit") ||
            h.includes("推送") ||
            h.includes("push"),
        ),
    },
    {
      id: "ask-pr",
      description: "让 Claude 写 PR 描述",
      validate: (_shell: Shell, history: string[]) =>
        history.some(
          (h) =>
            h.includes("PR") ||
            h.includes("pull request") ||
            h.includes("描述"),
        ),
    },
  ],
};

export const chapter5: Chapter = {
  id: 5,
  title: "Claude Code 实战",
  description: "学会用 AI 助手高效编程和贡献代码",
  levels: [level5_1, level5_2, level5_3, level5_4],
};
