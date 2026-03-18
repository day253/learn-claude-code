# Learn Claude Code — 从零到 Pull Request

**交互式教程，在浏览器里学会终端、Git、GitHub 和 Claude Code。**

打开网页直接学，不需要安装任何软件。手机也能用。

## 在线体验

👉 **[https://day253.github.io/learn-claude-code](https://day253.github.io/learn-claude-code)**

## 你能学到什么

```
第1章  认识终端        ls, cd, cat — 命令行入门
第2章  Git 基础       init, add, commit, branch — 版本控制
第3章  GitHub 入门    Fork, Clone, Push — 远程协作
第4章  Pull Request   创建 PR, Code Review, Merge
第5章  Claude Code    用 AI 助手高效编程
第6章  毕业挑战       独立完成一个真正的 PR
```

6 章 20 关，2-4 小时学完。每一关都在模拟终端里实际操作，不是看视频。

## 技术架构

纯前端，零服务端依赖：

- **Virtual Filesystem** — 内存中的文件系统模拟
- **Simulated Git** — 前端实现的 Git 命令（init, add, commit, branch, push...）
- **Shell Interpreter** — 命令解析和执行
- **Claude Code Simulator** — 自然语言 → 命令翻译的 AI 模拟器
- **进度保存** — localStorage，刷新不丢

技术栈：Next.js + TypeScript + Tailwind CSS + Framer Motion

## 本地运行

```bash
git clone https://github.com/day253/learn-claude-code.git
cd learn-claude-code
npm install
npm run dev
```

打开 http://localhost:3000

## 贡献

欢迎贡献！可以：

- 改进现有关卡的说明和提示
- 添加新的关卡或章节
- 修复 bug
- 改进 UI/UX
- 翻译成其他语言

提 Issue 或直接提 PR。

## License

MIT
