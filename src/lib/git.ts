import { VirtualFS } from "./vfs";

export interface GitCommit {
  hash: string;
  message: string;
  timestamp: number;
  files: string[];
}

export interface GitState {
  initialized: boolean;
  branch: string;
  branches: string[];
  staged: Set<string>;
  commits: GitCommit[];
  remotes: Record<string, string>;
}

function shortHash(): string {
  return Math.random().toString(16).slice(2, 9);
}

export class SimulatedGit {
  state: GitState;
  private fs: VirtualFS;

  constructor(fs: VirtualFS) {
    this.fs = fs;
    this.state = {
      initialized: false,
      branch: "main",
      branches: [],
      staged: new Set(),
      commits: [],
      remotes: {},
    };
  }

  init(): string {
    if (this.state.initialized) {
      return `Reinitialized existing Git repository in ${this.fs.cwd}/.git/`;
    }
    this.state.initialized = true;
    this.state.branches = ["main"];
    this.state.branch = "main";
    this.fs.mkdir(this.fs.cwd + "/.git");
    return `Initialized empty Git repository in ${this.fs.cwd}/.git/`;
  }

  add(path: string): string {
    if (!this.state.initialized) return "fatal: not a git repository";
    if (path === "." || path === "-A") {
      const files = this._getAllFiles(this.fs.cwd);
      files.forEach((f) => this.state.staged.add(f));
      return "";
    }
    const abs = this.fs.resolve(path);
    if (!this.fs.exists(abs)) return `fatal: pathspec '${path}' did not match any files`;
    this.state.staged.add(abs);
    return "";
  }

  private _getAllFiles(dir: string): string[] {
    const result: string[] = [];
    const entries = this.fs.ls(dir);
    for (const name of entries) {
      if (name === ".git") continue;
      const full = dir === "/" ? `/${name}` : `${dir}/${name}`;
      const node = this.fs.stat(full);
      if (node?.type === "file") {
        result.push(full);
      } else if (node?.type === "dir") {
        result.push(...this._getAllFiles(full));
      }
    }
    return result;
  }

  commit(message: string): string {
    if (!this.state.initialized) return "fatal: not a git repository";
    if (this.state.staged.size === 0) {
      return "nothing to commit, working tree clean";
    }
    const hash = shortHash();
    const commit: GitCommit = {
      hash,
      message,
      timestamp: Date.now(),
      files: Array.from(this.state.staged),
    };
    this.state.commits.push(commit);
    this.state.staged.clear();
    const shortMsg = message.length > 50 ? message.slice(0, 47) + "..." : message;
    return `[${this.state.branch} ${hash}] ${shortMsg}\n ${commit.files.length} file(s) changed`;
  }

  log(count = 5): string {
    if (!this.state.initialized) return "fatal: not a git repository";
    if (this.state.commits.length === 0) return "fatal: your current branch does not have any commits yet";
    const recent = this.state.commits.slice(-count).reverse();
    return recent
      .map((c) => {
        const date = new Date(c.timestamp).toISOString().replace("T", " ").slice(0, 19);
        return `commit ${c.hash}\nDate:   ${date}\n\n    ${c.message}`;
      })
      .join("\n\n");
  }

  status(): string {
    if (!this.state.initialized) return "fatal: not a git repository";
    const lines: string[] = [`On branch ${this.state.branch}`];
    if (this.state.commits.length === 0) {
      lines.push("\nNo commits yet\n");
    }
    if (this.state.staged.size > 0) {
      lines.push("\nChanges to be committed:");
      for (const f of this.state.staged) {
        const rel = f.replace(this.fs.cwd, "").replace(/^\//, "");
        lines.push(`  new file:   ${rel}`);
      }
    }
    const untracked = this._getAllFiles(this.fs.cwd).filter(
      (f) =>
        !this.state.staged.has(f) &&
        !this.state.commits.some((c) => c.files.includes(f)),
    );
    if (untracked.length > 0) {
      lines.push("\nUntracked files:");
      for (const f of untracked) {
        const rel = f.replace(this.fs.cwd, "").replace(/^\//, "");
        lines.push(`  ${rel}`);
      }
    }
    if (this.state.staged.size === 0 && untracked.length === 0 && this.state.commits.length > 0) {
      lines.push("nothing to commit, working tree clean");
    }
    return lines.join("\n");
  }

  diff(): string {
    if (this.state.staged.size === 0) return "";
    const lines: string[] = [];
    for (const f of this.state.staged) {
      const rel = f.replace(this.fs.cwd, "").replace(/^\//, "");
      const content = this.fs.readFile(f) || "";
      lines.push(`diff --git a/${rel} b/${rel}`);
      lines.push(`--- /dev/null`);
      lines.push(`+++ b/${rel}`);
      const fileLines = content.split("\n");
      lines.push(`@@ -0,0 +1,${fileLines.length} @@`);
      fileLines.forEach((l) => lines.push(`+${l}`));
    }
    return lines.join("\n");
  }

  branch(name?: string): string {
    if (!this.state.initialized) return "fatal: not a git repository";
    if (!name) {
      return this.state.branches
        .map((b) => (b === this.state.branch ? `* ${b}` : `  ${b}`))
        .join("\n");
    }
    if (this.state.branches.includes(name)) {
      return `fatal: A branch named '${name}' already exists.`;
    }
    this.state.branches.push(name);
    return "";
  }

  checkout(target: string, createNew = false): string {
    if (!this.state.initialized) return "fatal: not a git repository";
    if (createNew) {
      if (this.state.branches.includes(target)) {
        return `fatal: A branch named '${target}' already exists.`;
      }
      this.state.branches.push(target);
    }
    if (!this.state.branches.includes(target)) {
      return `error: pathspec '${target}' did not match any file(s) known to git`;
    }
    this.state.branch = target;
    return `Switched to branch '${target}'`;
  }

  remoteAdd(name: string, url: string): string {
    this.state.remotes[name] = url;
    return "";
  }

  clone(url: string): string {
    const repoName = url.split("/").pop()?.replace(".git", "") || "repo";
    this.fs.mkdir(repoName);
    this.fs.cd(repoName);
    this.init();
    this.remoteAdd("origin", url);
    this.fs.writeFile("README.md", `# ${repoName}\n\nCloned from ${url}\n`);
    this.add(".");
    this.commit("Initial commit");
    return `Cloning into '${repoName}'...\nremote: Enumerating objects: 42, done.\nremote: Counting objects: 100% (42/42), done.\nRemote: Total 42, reused 42\nReceiving objects: 100% (42/42), done.`;
  }

  push(): string {
    if (!this.state.remotes["origin"]) {
      return "fatal: No configured push destination.";
    }
    return `Enumerating objects: ${this.state.commits.length * 3}, done.\nCounting objects: 100%, done.\nWriting objects: 100%, done.\nTo ${this.state.remotes["origin"]}\n   ${shortHash()}..${shortHash()}  ${this.state.branch} -> ${this.state.branch}`;
  }
}
