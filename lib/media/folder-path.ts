const SEGMENT_REGEX = /^[a-z0-9]([a-z0-9_-]*[a-z0-9])?$/

export const ROOT_FOLDER = "general"

export function normalizeSegment(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9_-]/g, "")
    .replace(/^-+|-+$/g, "")
}

export function normalizePath(raw: string): string {
  const parts = raw
    .split("/")
    .map((s) => normalizeSegment(s))
    .filter(Boolean)
  return parts.join("/")
}

export function isValidPath(path: string): boolean {
  if (!path) return false
  if (path.includes("..")) return false
  if (path.includes("//")) return false
  const parts = path.split("/")
  return parts.every((p) => SEGMENT_REGEX.test(p))
}

export function splitPath(path: string): string[] {
  return path.split("/").filter(Boolean)
}

export function joinPath(...parts: string[]): string {
  return parts
    .flatMap((p) => p.split("/"))
    .filter(Boolean)
    .join("/")
}

export function parentPath(path: string): string | null {
  const parts = splitPath(path)
  if (parts.length <= 1) return null
  return parts.slice(0, -1).join("/")
}

export function lastSegment(path: string): string {
  const parts = splitPath(path)
  return parts[parts.length - 1] ?? ""
}

export function ancestors(path: string): string[] {
  const parts = splitPath(path)
  const out: string[] = []
  for (let i = 1; i < parts.length; i++) {
    out.push(parts.slice(0, i).join("/"))
  }
  return out
}

export function isDescendant(path: string, ancestor: string): boolean {
  if (path === ancestor) return false
  return path.startsWith(ancestor + "/")
}

export interface FolderNode {
  path: string
  name: string
  children: FolderNode[]
  count: number
}

export function buildFolderTree(paths: string[], counts: Record<string, number> = {}): FolderNode[] {
  const root: FolderNode[] = []
  const map = new Map<string, FolderNode>()

  const unique = Array.from(new Set(paths)).sort()

  for (const full of unique) {
    const parts = splitPath(full)
    let parentChildren = root
    let acc = ""
    for (let i = 0; i < parts.length; i++) {
      acc = acc ? `${acc}/${parts[i]}` : parts[i]
      let node = map.get(acc)
      if (!node) {
        node = { path: acc, name: parts[i], children: [], count: counts[acc] ?? 0 }
        map.set(acc, node)
        parentChildren.push(node)
      }
      parentChildren = node.children
    }
  }

  return root
}
