import { VirtualFS } from "./vfs";
import { SimulatedGit } from "./git";

export interface ShellResult {
  output: string;
  exitCode: number;
}

export class Shell {
  fs: VirtualFS;
  git: SimulatedGit;
  env: Record<string, string>;
  history: string[];

  constructor(fs?: VirtualFS) {
    this.fs = fs || new VirtualFS();
    this.fs.cd("/home/user");
    this.git = new SimulatedGit(this.fs);
    this.env = {
      HOME: "/home/user",
      USER: "student",
      PATH: "/usr/bin:/bin",
    };
    this.history = [];
  }

  get prompt(): string {
    const cwd = this.fs.cwd.replace("/home/user", "~") || "/";
    const branch = this.git.state.initialized ? ` (${this.git.state.branch})` : "";
    return `student@learn:${cwd}${branch}$ `;
  }

  exec(input: string): ShellResult {
    const trimmed = input.trim();
    if (!trimmed) return { output: "", exitCode: 0 };

    this.history.push(trimmed);
    const { cmd, args } = this._parse(trimmed);

    try {
      switch (cmd) {
        case "ls":
          return this._ls(args);
        case "cd":
          return this._cd(args);
        case "pwd":
          return { output: this.fs.cwd, exitCode: 0 };
        case "cat":
          return this._cat(args);
        case "echo":
          return this._echo(args, trimmed);
        case "touch":
          return this._touch(args);
        case "mkdir":
          return this._mkdir(args);
        case "rm":
          return this._rm(args);
        case "tree":
          return this._tree(args);
        case "clear":
          return { output: "\x1b[2J\x1b[H", exitCode: 0 };
        case "whoami":
          return { output: this.env.USER, exitCode: 0 };
        case "date":
          return { output: new Date().toISOString(), exitCode: 0 };
        case "git":
          return this._git(args);
        case "help":
          return this._help();
        case "man":
          return this._man(args);
        default:
          return {
            output: `bash: ${cmd}: command not found`,
            exitCode: 127,
          };
      }
    } catch (e) {
      return {
        output: `Error: ${e instanceof Error ? e.message : String(e)}`,
        exitCode: 1,
      };
    }
  }

  private _parse(input: string): { cmd: string; args: string[] } {
    const tokens: string[] = [];
    let current = "";
    let inSingle = false;
    let inDouble = false;

    for (let i = 0; i < input.length; i++) {
      const ch = input[i];
      if (ch === "'" && !inDouble) {
        inSingle = !inSingle;
      } else if (ch === '"' && !inSingle) {
        inDouble = !inDouble;
      } else if (ch === " " && !inSingle && !inDouble) {
        if (current) {
          tokens.push(current);
          current = "";
        }
      } else {
        current += ch;
      }
    }
    if (current) tokens.push(current);

    return { cmd: tokens[0] || "", args: tokens.slice(1) };
  }

  private _ls(args: string[]): ShellResult {
    const showAll = args.includes("-a") || args.includes("-la") || args.includes("-al");
    const path = args.find((a) => !a.startsWith("-"));
    const entries = this.fs.ls(path);
    if (entries.length === 0 && path) {
      const node = this.fs.stat(path);
      if (!node) return { output: `ls: cannot access '${path}': No such file or directory`, exitCode: 2 };
      if (node.type === "file") return { output: path, exitCode: 0 };
    }
    let result = showAll ? [".", "..", ...entries] : entries.filter((e) => !e.startsWith("."));
    return { output: result.join("  "), exitCode: 0 };
  }

  private _cd(args: string[]): ShellResult {
    const target = args[0] || this.env.HOME;
    const expanded = target.replace("~", this.env.HOME);
    if (!this.fs.cd(expanded)) {
      return { output: `bash: cd: ${target}: No such file or directory`, exitCode: 1 };
    }
    return { output: "", exitCode: 0 };
  }

  private _cat(args: string[]): ShellResult {
    if (args.length === 0) return { output: "cat: missing operand", exitCode: 1 };
    const results: string[] = [];
    for (const path of args) {
      const content = this.fs.readFile(path);
      if (content === null) {
        return { output: `cat: ${path}: No such file or directory`, exitCode: 1 };
      }
      results.push(content);
    }
    return { output: results.join("\n"), exitCode: 0 };
  }

  private _echo(args: string[], raw: string): ShellResult {
    const redirectIdx = args.indexOf(">");
    const appendIdx = args.indexOf(">>");
    if (redirectIdx !== -1 || appendIdx !== -1) {
      const isAppend = appendIdx !== -1;
      const idx = isAppend ? appendIdx : redirectIdx;
      const file = args[idx + 1];
      const text = args.slice(0, idx).join(" ");
      if (!file) return { output: "bash: syntax error near unexpected token `newline'", exitCode: 1 };
      const existing = isAppend ? (this.fs.readFile(file) || "") : "";
      this.fs.writeFile(file, existing + text + "\n");
      return { output: "", exitCode: 0 };
    }
    const echoContent = raw.replace(/^echo\s+/, "").replace(/^["']|["']$/g, "");
    return { output: echoContent, exitCode: 0 };
  }

  private _touch(args: string[]): ShellResult {
    for (const path of args) {
      if (!this.fs.exists(path)) {
        this.fs.writeFile(path, "");
      }
    }
    return { output: "", exitCode: 0 };
  }

  private _mkdir(args: string[]): ShellResult {
    const paths = args.filter((a) => a !== "-p");
    for (const path of paths) {
      if (!this.fs.mkdir(path)) {
        return { output: `mkdir: cannot create directory '${path}': File exists`, exitCode: 1 };
      }
    }
    return { output: "", exitCode: 0 };
  }

  private _rm(args: string[]): ShellResult {
    const paths = args.filter((a) => !a.startsWith("-"));
    for (const path of paths) {
      if (!this.fs.rm(path)) {
        return { output: `rm: cannot remove '${path}': No such file or directory`, exitCode: 1 };
      }
    }
    return { output: "", exitCode: 0 };
  }

  private _tree(args: string[]): ShellResult {
    const path = args[0];
    const lines = this.fs.tree(path);
    const target = path || ".";
    return { output: [target, ...lines].join("\n"), exitCode: 0 };
  }

  private _git(args: string[]): ShellResult {
    if (args.length === 0) return { output: "usage: git <command> [<args>]", exitCode: 1 };
    const sub = args[0];
    const rest = args.slice(1);

    switch (sub) {
      case "init":
        return { output: this.git.init(), exitCode: 0 };

      case "add":
        if (rest.length === 0) return { output: "Nothing specified, nothing added.", exitCode: 0 };
        return { output: this.git.add(rest[0]), exitCode: 0 };

      case "commit": {
        const mIdx = rest.indexOf("-m");
        if (mIdx === -1 || !rest[mIdx + 1]) {
          return { output: "error: switch `m' requires a value", exitCode: 1 };
        }
        const msg = rest[mIdx + 1];
        const result = this.git.commit(msg);
        const isErr = result.startsWith("nothing");
        return { output: result, exitCode: isErr ? 1 : 0 };
      }

      case "status":
        return { output: this.git.status(), exitCode: 0 };

      case "log": {
        const nIdx = rest.indexOf("-n");
        const count = nIdx !== -1 ? parseInt(rest[nIdx + 1] || "5") : 5;
        const onelineIdx = rest.indexOf("--oneline");
        if (onelineIdx !== -1) {
          const commits = this.git.state.commits.slice(-count).reverse();
          if (commits.length === 0) return { output: "fatal: your current branch does not have any commits yet", exitCode: 1 };
          return { output: commits.map((c) => `${c.hash} ${c.message}`).join("\n"), exitCode: 0 };
        }
        return { output: this.git.log(count), exitCode: 0 };
      }

      case "diff":
        return { output: this.git.diff() || "no changes", exitCode: 0 };

      case "branch":
        return { output: this.git.branch(rest[0]), exitCode: 0 };

      case "checkout": {
        const createNew = rest[0] === "-b";
        const target = createNew ? rest[1] : rest[0];
        if (!target) return { output: "error: switch requires a value", exitCode: 1 };
        return { output: this.git.checkout(target, createNew), exitCode: 0 };
      }

      case "clone":
        if (!rest[0]) return { output: "fatal: You must specify a repository to clone.", exitCode: 1 };
        return { output: this.git.clone(rest[0]), exitCode: 0 };

      case "push":
        return { output: this.git.push(), exitCode: 0 };

      case "remote":
        if (rest[0] === "add" && rest[1] && rest[2]) {
          return { output: this.git.remoteAdd(rest[1], rest[2]), exitCode: 0 };
        }
        if (rest[0] === "-v") {
          const lines = Object.entries(this.git.state.remotes)
            .flatMap(([n, u]) => [`${n}\t${u} (fetch)`, `${n}\t${u} (push)`]);
          return { output: lines.join("\n"), exitCode: 0 };
        }
        return { output: Object.keys(this.git.state.remotes).join("\n"), exitCode: 0 };

      default:
        return { output: `git: '${sub}' is not a git command.`, exitCode: 1 };
    }
  }

  private _help(): ShellResult {
    return {
      output: [
        "Available commands:",
        "  ls [path]          List directory contents",
        "  cd <path>          Change directory",
        "  pwd                Print working directory",
        "  cat <file>         Display file contents",
        "  echo <text>        Print text (supports > and >>)",
        "  touch <file>       Create empty file",
        "  mkdir <dir>        Create directory",
        "  rm <file>          Remove file",
        "  tree               Show directory tree",
        "  clear              Clear screen",
        "  whoami             Print current user",
        "  git <command>      Git operations",
        "  help               Show this message",
        "",
        "Git commands: init, add, commit, status, log, diff,",
        "              branch, checkout, clone, push, remote",
      ].join("\n"),
      exitCode: 0,
    };
  }

  private _man(args: string[]): ShellResult {
    if (args.length === 0) return { output: "What manual page do you want?", exitCode: 1 };
    return { output: `No manual entry for ${args[0]}\nTry 'help' for available commands.`, exitCode: 0 };
  }
}
