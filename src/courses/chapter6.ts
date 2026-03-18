import { Chapter, Level } from "@/lib/course";
import { Shell } from "@/lib/shell";

const level6_1: Level = {
  id: "6-1",
  chapter: 6,
  order: 1,
  title: "实战练习",
  description:
    "是时候把所学的全部用上了。你要独立完成一个完整的贡献流程。放轻松，你已经准备好了。",
  instructions: [
    "任务：给 PRSchool 的练习仓库贡献你的「学员档案」。",
    "你可以用终端命令或 Claude Code 来完成，选你喜欢的方式！",
    "1. 克隆仓库：`git clone https://github.com/prschool/playground.git`",
    "2. 进入目录：`cd playground`",
    "3. 创建你的分支：`git checkout -b add-my-profile`",
    "4. 创建你的档案文件：`mkdir -p students` 然后创建 `students/graduate.json`",
    "5. 写入你的信息（随便写）：",
    "`echo '{\"name\": \"PRSchool Graduate\", \"date\": \"2026-03-17\", \"learned\": [\"terminal\", \"git\", \"github\", \"PR\", \"claude-code\"]}' > students/graduate.json`",
    "6. 提交：`git add .` → `git commit -m 'feat: add my student profile'`",
  ],
  hints: [
    "这就是你毕业后做开源贡献的真实流程",
    "不记得命令？随时输入 help 或回看之前的关卡",
    "或者输入 claude 让 AI 帮你！",
  ],
  checkpoints: [
    {
      id: "clone-playground",
      description: "克隆 playground 仓库",
      validate: (shell: Shell) => shell.fs.exists("/home/user/playground"),
    },
    {
      id: "create-branch",
      description: "创建新分支",
      validate: (shell: Shell) =>
        shell.git.state.initialized && shell.git.state.branch !== "main",
    },
    {
      id: "create-profile",
      description: "创建学员档案文件",
      validate: (shell: Shell) => {
        const f1 = shell.fs.readFile("/home/user/playground/students/graduate.json");
        return f1 !== null && f1.length > 5;
      },
    },
    {
      id: "commit-profile",
      description: "提交你的修改",
      validate: (shell: Shell) => shell.git.state.commits.length > 0,
    },
  ],
};

const level6_2: Level = {
  id: "6-2",
  chapter: 6,
  order: 2,
  title: "提交 PR — 毕业！",
  description:
    "最后一步：推送代码并完成 PR。做完这一步，你就是 PRSchool 毕业生了！",
  instructions: [
    "你已经在本地完成了所有修改。现在：",
    "1. 推送到远程：`git push`",
    "2. 写 PR 标题：`echo 'Add student profile for PRSchool graduate' > .pr-title`",
    "3. 写 PR 描述：",
    "`echo '## What\\nAdded my student profile to the playground repo.\\n\\n## Journey\\nCompleted all 6 chapters of PRSchool!\\n\\n## Learned\\n- Terminal basics\\n- Git workflow\\n- GitHub collaboration\\n- Pull Request process\\n- Claude Code' > .pr-body`",
    "4. 查看你的 PR：`cat .pr-title` 和 `cat .pr-body`",
    "🎓 **恭喜你！你已经完成了 PRSchool 的全部课程！**",
  ],
  hints: [
    "这是最后一关了，你已经学会了所有需要的技能！",
    "在真实世界中，你的 PR 提交后会自动审核并返还 9.9 元",
  ],
  initialFS: {
    home: {
      user: {
        playground: {
          ".git": {},
          "README.md": "# PRSchool Playground\n\nPractice repo for PRSchool graduates.\n",
          students: {
            "example.json":
              '{\n  "name": "Example Student",\n  "date": "2026-01-01",\n  "learned": ["terminal", "git"]\n}\n',
            "graduate.json":
              '{\n  "name": "PRSchool Graduate",\n  "date": "2026-03-17",\n  "learned": ["terminal", "git", "github", "PR", "claude-code"]\n}\n',
          },
        },
      },
    },
  },
  initialCwd: "/home/user/playground",
  initialGit: true,
  checkpoints: [
    {
      id: "push-code",
      description: "推送到远程仓库",
      validate: (_shell: Shell, history: string[]) =>
        history.some((h) => h.trim() === "git push"),
    },
    {
      id: "write-pr-title",
      description: "写 PR 标题",
      validate: (shell: Shell) => {
        const content = shell.fs.readFile(shell.fs.resolve(".pr-title")) || "";
        return content.trim().length > 5;
      },
    },
    {
      id: "write-pr-body",
      description: "写 PR 描述",
      validate: (shell: Shell) => {
        const content = shell.fs.readFile(shell.fs.resolve(".pr-body")) || "";
        return content.trim().length > 10;
      },
    },
    {
      id: "view-pr",
      description: "查看你的 PR 内容",
      validate: (_shell: Shell, history: string[]) =>
        history.some((h) => h.includes("cat") && h.includes(".pr-")),
    },
  ],
};

export const chapter6: Chapter = {
  id: 6,
  title: "毕业挑战",
  description: "综合运用所学，完成你的第一个真正的 PR",
  levels: [level6_1, level6_2],
};
