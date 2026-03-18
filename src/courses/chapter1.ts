import { Chapter, Level } from "@/lib/course";
import { Shell } from "@/lib/shell";

const level1_1: Level = {
  id: "1-1",
  chapter: 1,
  order: 1,
  title: "你的第一条命令",
  description: "命令行（终端）是程序员和电脑对话的方式。你输入一条命令，电脑执行并返回结果。",
  instructions: [
    "欢迎来到 Learn Claude Code！在这里，你将学会用终端操作电脑。",
    "下面是一个模拟终端。试着输入 `whoami` 然后按回车，看看电脑怎么回答你。",
    "接着输入 `pwd` 查看你当前在哪个目录（文件夹），最后输入 `help` 看看还有哪些命令可以用。",
  ],
  hints: [
    "直接输入 whoami 然后按回车键",
    "pwd 是 Print Working Directory 的缩写",
    "help 会列出所有可用命令",
  ],
  checkpoints: [
    {
      id: "run-whoami",
      description: "输入 whoami 命令",
      validate: (_shell: Shell, history: string[]) =>
        history.some((h) => h.trim() === "whoami"),
    },
    {
      id: "run-pwd",
      description: "输入 pwd 查看当前目录",
      validate: (_shell: Shell, history: string[]) =>
        history.some((h) => h.trim() === "pwd"),
    },
    {
      id: "run-help",
      description: "输入 help 查看可用命令",
      validate: (_shell: Shell, history: string[]) =>
        history.some((h) => h.trim() === "help"),
    },
  ],
};

const level1_2: Level = {
  id: "1-2",
  chapter: 1,
  order: 2,
  title: "探索文件系统",
  description: "电脑里的文件按照文件夹（目录）组织，就像抽屉柜一样。学会用 ls 和 cd 在文件夹之间穿梭。",
  instructions: [
    "你的主目录下已经有一些文件和文件夹了。",
    "用 `ls` 看看当前目录里有什么。",
    "用 `cd documents` 进入 documents 文件夹。",
    "再用 `cat notes.txt` 读取里面的文件内容。",
    "用 `cd ..` 回到上一层目录。",
  ],
  hints: [
    "ls 会列出当前文件夹里的所有文件和子文件夹",
    "cd 是 Change Directory 的缩写，后面跟文件夹名",
    'cd .. 中的 .. 表示"上一层目录"',
  ],
  initialFS: {
    "home": {
      "user": {
        "documents": {
          "notes.txt": "Hello! 这是你的第一个文本文件。\n你已经学会用 cat 读取文件了！",
          "todo.txt": "1. 学会终端基本操作\n2. 学会 Git\n3. 给开源项目提 PR！",
        },
        "pictures": {},
        "README.md": "# 欢迎来到 Learn Claude Code\n\n这是你的工作目录。",
      },
    },
  },
  checkpoints: [
    {
      id: "run-ls",
      description: "用 ls 列出当前目录内容",
      validate: (_shell: Shell, history: string[]) =>
        history.some((h) => h.trim() === "ls" || h.trim().startsWith("ls ")),
    },
    {
      id: "enter-documents",
      description: "用 cd 进入 documents 文件夹",
      validate: (_shell: Shell, history: string[]) =>
        history.some((h) => h.includes("cd") && h.includes("documents")),
    },
    {
      id: "read-file",
      description: "用 cat 读取 notes.txt",
      validate: (_shell: Shell, history: string[]) =>
        history.some((h) => h.includes("cat") && h.includes("notes.txt")),
    },
    {
      id: "go-back",
      description: "用 cd .. 回到上一层",
      validate: (_shell: Shell, history: string[]) =>
        history.some((h) => h.trim() === "cd .." || h.trim() === "cd ../" ),
    },
  ],
};

const level1_3: Level = {
  id: "1-3",
  chapter: 1,
  order: 3,
  title: "创建和编辑文件",
  description: "学会创建文件和文件夹，往文件里写入内容。这是后面用 Git 的基础。",
  instructions: [
    "现在来学创建东西。",
    "用 `mkdir myproject` 创建一个新文件夹。",
    "用 `cd myproject` 进入它。",
    "用 `touch hello.txt` 创建一个空文件。",
    "用 `echo 'Hello World' > hello.txt` 往里面写点东西。",
    "用 `cat hello.txt` 验证内容写进去了。",
  ],
  hints: [
    "mkdir 是 Make Directory 的缩写",
    "touch 创建一个空文件（如果文件已存在则更新时间戳）",
    "echo 'text' > file 会把文字写入文件（覆盖已有内容）",
    "echo 'text' >> file 用两个 > 则是追加内容",
  ],
  checkpoints: [
    {
      id: "create-dir",
      description: "用 mkdir 创建 myproject 文件夹",
      validate: (shell: Shell) => shell.fs.exists("/home/user/myproject"),
    },
    {
      id: "enter-dir",
      description: "用 cd 进入 myproject",
      validate: (shell: Shell) => shell.fs.cwd.includes("myproject"),
    },
    {
      id: "create-file",
      description: "用 touch 创建 hello.txt",
      validate: (shell: Shell) => shell.fs.exists(shell.fs.resolve("hello.txt")),
    },
    {
      id: "write-content",
      description: "用 echo 向 hello.txt 写入内容",
      validate: (shell: Shell) => {
        const content = shell.fs.readFile(shell.fs.resolve("hello.txt"));
        return content !== null && content.trim().length > 0;
      },
    },
    {
      id: "verify-content",
      description: "用 cat 验证文件内容",
      validate: (_shell: Shell, history: string[]) =>
        history.some((h) => h.includes("cat") && h.includes("hello.txt")),
    },
  ],
};

export const chapter1: Chapter = {
  id: 1,
  title: "认识终端",
  description: "从零开始，学会在终端里操作电脑",
  levels: [level1_1, level1_2, level1_3],
};
