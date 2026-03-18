import { Shell, ShellResult } from "./shell";

interface ClaudeResponse {
  thinking: string;
  actions: { command: string; output: string }[];
  reply: string;
}

const PATTERNS: {
  match: RegExp;
  handler: (shell: Shell, input: string, match: RegExpMatchArray) => ClaudeResponse;
}[] = [
  {
    match: /看看.*(文件|目录)|list|ls|有什么|有哪些文件/i,
    handler: (shell) => {
      const result = shell.exec("ls");
      return {
        thinking: "用户想查看当前目录的文件列表",
        actions: [{ command: "ls", output: result.output }],
        reply: `当前目录 \`${shell.fs.cwd}\` 下有这些文件：\n\n${result.output.split("  ").map((f) => `- ${f}`).join("\n")}`,
      };
    },
  },
  {
    match: /读|看.*(内容|文件)|read|cat|打开\s*(\S+)/i,
    handler: (shell, input) => {
      const fileMatch = input.match(/(?:读|看|read|cat|打开)\s*(?:一下\s*)?(\S+\.?\w+)/i);
      const file = fileMatch?.[1] || "README.md";
      const result = shell.exec(`cat ${file}`);
      return {
        thinking: `用户想查看 ${file} 的内容`,
        actions: [{ command: `cat ${file}`, output: result.output }],
        reply: result.exitCode === 0
          ? `这是 \`${file}\` 的内容：\n\n\`\`\`\n${result.output}\n\`\`\``
          : `找不到文件 \`${file}\`。用 \`ls\` 看看当前目录有哪些文件？`,
      };
    },
  },
  {
    match: /clone|克隆/i,
    handler: (shell, input) => {
      const urlMatch = input.match(/(https?:\/\/\S+)/);
      const url = urlMatch?.[1] || "https://github.com/prschool/practice-repo.git";
      const result = shell.exec(`git clone ${url}`);
      return {
        thinking: `用户想克隆仓库 ${url}`,
        actions: [{ command: `git clone ${url}`, output: result.output }],
        reply: `仓库已克隆完成！\n\n${result.output}`,
      };
    },
  },
  {
    match: /创建.*(分支|branch)|新.*(分支|branch)|checkout.*-b/i,
    handler: (shell, input) => {
      const nameMatch = input.match(/(?:叫|名|叫做|named?|branch)\s*(\S+)/i);
      const name = nameMatch?.[1]?.replace(/[`'"]/g, "") || "feature";
      const result = shell.exec(`git checkout -b ${name}`);
      return {
        thinking: `用户想创建并切换到新分支 ${name}`,
        actions: [{ command: `git checkout -b ${name}`, output: result.output }],
        reply: `已创建并切换到新分支 \`${name}\`！\n\n${result.output}`,
      };
    },
  },
  {
    match: /添加.*路由|add.*route|加.*route/i,
    handler: (shell) => {
      const appFile = shell.fs.resolve("src/app.js");
      const current = shell.fs.readFile(appFile) || "";
      const newRoute = `\napp.get("/about", (req, res) => {\n  res.json({ name: "demo-project", version: "1.0.0" });\n});\n`;
      const updated = current.replace(
        "app.listen(3000);",
        newRoute + "\napp.listen(3000);",
      );
      shell.fs.writeFile(appFile, updated);
      return {
        thinking: "用户想给 app.js 添加一个 /about 路由",
        actions: [
          {
            command: "# 修改 src/app.js — 添加 /about 路由",
            output: "✏️  已添加 /about 路由到 src/app.js",
          },
        ],
        reply: "已经给 `src/app.js` 添加了 `/about` 路由，返回项目信息的 JSON。你可以用 `cat src/app.js` 查看修改后的代码。",
      };
    },
  },
  {
    match: /提交|commit/i,
    handler: (shell, input) => {
      const msgMatch = input.match(/(?:消息|message|写|是)\s*['"`]?([^'"`]+)['"`]?/i);
      const msg = msgMatch?.[1]?.trim() || "update code";
      const addResult = shell.exec("git add .");
      const commitResult = shell.exec(`git commit -m "${msg}"`);
      return {
        thinking: `用户想暂存并提交，消息为: ${msg}`,
        actions: [
          { command: "git add .", output: addResult.output },
          { command: `git commit -m "${msg}"`, output: commitResult.output },
        ],
        reply: commitResult.output.includes("nothing")
          ? "没有需要提交的改动。"
          : `已提交！\n\n${commitResult.output}`,
      };
    },
  },
  {
    match: /推送|push|远程/i,
    handler: (shell) => {
      const result = shell.exec("git push");
      return {
        thinking: "用户想推送到远程仓库",
        actions: [{ command: "git push", output: result.output }],
        reply: `已推送到远程！\n\n${result.output}`,
      };
    },
  },
  {
    match: /暂存|stage|git add/i,
    handler: (shell) => {
      const result = shell.exec("git add .");
      return {
        thinking: "用户想暂存所有改动",
        actions: [{ command: "git add .", output: result.output }],
        reply: "已暂存所有改动。用 `git status` 可以查看暂存区状态。",
      };
    },
  },
  {
    match: /状态|status/i,
    handler: (shell) => {
      const result = shell.exec("git status");
      return {
        thinking: "用户想查看 Git 状态",
        actions: [{ command: "git status", output: result.output }],
        reply: `当前 Git 状态：\n\n\`\`\`\n${result.output}\n\`\`\``,
      };
    },
  },
  {
    match: /创建.*文件|create.*file|新建.*文件|touch|在.*创建/i,
    handler: (shell, input) => {
      const pathMatch = input.match(/(?:创建|create|新建|touch)\s*(?:一个\s*)?(\S+)/i);
      let filePath = pathMatch?.[1] || "new-file.txt";
      if (filePath.includes("，")) filePath = filePath.split("，")[0];

      const contentMatch = input.match(/(?:内容|content|写)[是为：:]\s*(.+)/i);
      const content = contentMatch?.[1] || "";

      const dirPart = filePath.split("/").slice(0, -1).join("/");
      if (dirPart) {
        shell.exec(`mkdir -p ${dirPart}`);
      }

      shell.fs.writeFile(shell.fs.resolve(filePath), content + "\n");

      return {
        thinking: `用户想创建文件 ${filePath}`,
        actions: [
          {
            command: `# 创建 ${filePath}`,
            output: `✏️  已创建 ${filePath}`,
          },
        ],
        reply: content
          ? `已创建 \`${filePath}\` 并写入内容。用 \`cat ${filePath}\` 查看。`
          : `已创建 \`${filePath}\`。用 \`cat ${filePath}\` 查看。`,
      };
    },
  },
  {
    match: /PR|pull request|描述/i,
    handler: (shell) => {
      const prTitle = "feat: add student contribution";
      const prBody =
        "## What\nAdded my contribution to the project.\n\n## Why\nLearning open source collaboration through PRSchool.\n\n## Changes\n- Created student profile\n- Following PR best practices";
      shell.fs.writeFile(shell.fs.resolve(".pr-title"), prTitle + "\n");
      shell.fs.writeFile(shell.fs.resolve(".pr-body"), prBody + "\n");
      return {
        thinking: "用户想写 PR 描述",
        actions: [
          { command: "# 生成 PR 标题和描述", output: "✏️  已生成" },
        ],
        reply: `我帮你写好了 PR：\n\n**标题：** ${prTitle}\n\n**描述：**\n${prBody}\n\n文件保存在 \`.pr-title\` 和 \`.pr-body\` 中。你可以 \`cat .pr-title\` 查看。`,
      };
    },
  },
];

const FALLBACK: ClaudeResponse = {
  thinking: "理解用户需求...",
  actions: [],
  reply:
    "我理解你的需求。你可以试试这些指令：\n\n- `帮我看看当前目录有什么文件`\n- `帮我读一下 README.md`\n- `帮我创建一个新分支`\n- `帮我提交代码`\n- `帮我推送到远程`\n\n或者直接描述你想做什么！",
};

export function processClaudeInput(
  shell: Shell,
  input: string,
): ClaudeResponse {
  for (const pattern of PATTERNS) {
    const match = input.match(pattern.match);
    if (match) {
      return pattern.handler(shell, input, match);
    }
  }
  return FALLBACK;
}

export function simulateTypingDelay(): number {
  return 300 + Math.random() * 700;
}
