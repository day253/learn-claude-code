export interface VFSNode {
  type: "file" | "dir";
  name: string;
  content?: string;
  children?: Map<string, VFSNode>;
  createdAt: number;
  modifiedAt: number;
}

function makeDir(name: string, children?: Record<string, VFSNode>): VFSNode {
  const map = new Map<string, VFSNode>();
  if (children) {
    for (const [k, v] of Object.entries(children)) map.set(k, v);
  }
  return {
    type: "dir",
    name,
    children: map,
    createdAt: Date.now(),
    modifiedAt: Date.now(),
  };
}

function makeFile(name: string, content = ""): VFSNode {
  return {
    type: "file",
    name,
    content,
    createdAt: Date.now(),
    modifiedAt: Date.now(),
  };
}

export class VirtualFS {
  root: VFSNode;
  cwd: string;

  constructor() {
    this.root = makeDir("/");
    this.cwd = "/";
    this._ensureDir("/home/user");
  }

  private _ensureDir(path: string): VFSNode {
    const parts = this._splitPath(path);
    let node = this.root;
    for (const part of parts) {
      if (!node.children) node.children = new Map();
      if (!node.children.has(part)) {
        node.children.set(part, makeDir(part));
      }
      node = node.children.get(part)!;
    }
    return node;
  }

  private _splitPath(p: string): string[] {
    return p
      .split("/")
      .filter((s) => s !== "" && s !== ".");
  }

  resolve(path: string): string {
    if (!path.startsWith("/")) {
      path = this.cwd + (this.cwd.endsWith("/") ? "" : "/") + path;
    }
    const parts: string[] = [];
    for (const seg of path.split("/")) {
      if (seg === "" || seg === ".") continue;
      if (seg === "..") {
        parts.pop();
      } else {
        parts.push(seg);
      }
    }
    return "/" + parts.join("/");
  }

  private _traverse(absPath: string): VFSNode | null {
    if (absPath === "/") return this.root;
    const parts = this._splitPath(absPath);
    let node = this.root;
    for (const part of parts) {
      if (!node.children?.has(part)) return null;
      node = node.children.get(part)!;
    }
    return node;
  }

  stat(path: string): VFSNode | null {
    return this._traverse(this.resolve(path));
  }

  ls(path?: string): string[] {
    const target = this._traverse(this.resolve(path || this.cwd));
    if (!target || target.type !== "dir") return [];
    return Array.from(target.children?.keys() ?? []).sort();
  }

  cd(path: string): boolean {
    const abs = this.resolve(path);
    const node = this._traverse(abs);
    if (!node || node.type !== "dir") return false;
    this.cwd = abs;
    return true;
  }

  readFile(path: string): string | null {
    const node = this._traverse(this.resolve(path));
    if (!node || node.type !== "file") return null;
    return node.content ?? "";
  }

  writeFile(path: string, content: string): boolean {
    const abs = this.resolve(path);
    const parts = this._splitPath(abs);
    const fileName = parts.pop();
    if (!fileName) return false;

    const parentPath = "/" + parts.join("/");
    const parent = this._traverse(parentPath);
    if (!parent || parent.type !== "dir") return false;

    if (!parent.children) parent.children = new Map();
    const existing = parent.children.get(fileName);
    if (existing && existing.type === "dir") return false;

    if (existing) {
      existing.content = content;
      existing.modifiedAt = Date.now();
    } else {
      parent.children.set(fileName, makeFile(fileName, content));
    }
    return true;
  }

  mkdir(path: string): boolean {
    const abs = this.resolve(path);
    if (this._traverse(abs)) return false;
    this._ensureDir(abs);
    return true;
  }

  rm(path: string): boolean {
    const abs = this.resolve(path);
    const parts = this._splitPath(abs);
    const name = parts.pop();
    if (!name) return false;

    const parentPath = "/" + parts.join("/");
    const parent = this._traverse(parentPath);
    if (!parent?.children?.has(name)) return false;

    parent.children.delete(name);
    return true;
  }

  exists(path: string): boolean {
    return this._traverse(this.resolve(path)) !== null;
  }

  tree(path?: string, prefix = ""): string[] {
    const target = this._traverse(this.resolve(path || this.cwd));
    if (!target || target.type !== "dir") return [];
    const lines: string[] = [];
    const entries = Array.from(target.children?.entries() ?? []).sort(
      ([a], [b]) => a.localeCompare(b),
    );
    entries.forEach(([name, node], i) => {
      const isLast = i === entries.length - 1;
      const connector = isLast ? "└── " : "├── ";
      lines.push(prefix + connector + name);
      if (node.type === "dir") {
        const childPrefix = prefix + (isLast ? "    " : "│   ");
        const absChild = this.resolve((path || this.cwd) + "/" + name);
        lines.push(...this.tree(absChild, childPrefix));
      }
    });
    return lines;
  }

  loadSnapshot(snapshot: FSSnapshot, basePath = "/") {
    for (const [name, value] of Object.entries(snapshot)) {
      const fullPath = basePath === "/" ? `/${name}` : `${basePath}/${name}`;
      if (typeof value === "string") {
        this.writeFile(fullPath, value);
      } else {
        this.mkdir(fullPath);
        this.loadSnapshot(value, fullPath);
      }
    }
  }
}

export type FSSnapshot = {
  [key: string]: string | FSSnapshot;
};
