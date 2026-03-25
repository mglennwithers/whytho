import { describe, it, expect } from 'vitest'

// Re-implement the pure data-transformation helpers from src/views/tree-view.ts
// to test them without importing vscode. These match the implementations there.

type TreeItemType = 'folder' | 'file' | 'block'

interface FolderIndexEntry {
  parent_folder?: string
  contained_files: string[]
}
interface FileIndexEntry {
  blocks: string[]
}
interface BlockIndexEntry {
  confidence: number
}

interface WhythoIndex {
  folders: Record<string, FolderIndexEntry>
  files: Record<string, FileIndexEntry>
  blocks: Record<string, BlockIndexEntry>
}

interface TreeItem {
  type: TreeItemType
  label: string
  path: string
}

function getRootFolders(index: WhythoIndex): TreeItem[] {
  return Object.entries(index.folders)
    .filter(([_, entry]) => !entry.parent_folder || entry.parent_folder === '/')
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([path, _]) => ({ type: 'folder' as const, label: path, path }))
}

function getFolderChildren(index: WhythoIndex, folderPath: string): TreeItem[] {
  const subFolders = Object.entries(index.folders)
    .filter(([_, entry]) => entry.parent_folder === folderPath)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([path, _]) => ({
      type: 'folder' as const,
      label: path.replace(folderPath, ''),
      path,
    }))

  const entry = index.folders[folderPath]
  const files = (entry?.contained_files ?? [])
    .filter((f) => index.files[f])
    .sort()
    .map((filePath) => ({
      type: 'file' as const,
      label: filePath.split('/').pop() ?? filePath,
      path: filePath,
    }))

  return [...subFolders, ...files]
}

function getFileBlocks(index: WhythoIndex, filePath: string): TreeItem[] {
  const fileEntry = index.files[filePath]
  if (!fileEntry) return []

  return fileEntry.blocks
    .filter((ref) => index.blocks[ref])
    .map((ref) => {
      const blockName = ref.includes('::') ? ref.split('::')[1] : ref
      return { type: 'block' as const, label: blockName, path: ref }
    })
}

// ─── Test fixtures ────────────────────────────────────────────────────────────

const INDEX: WhythoIndex = {
  folders: {
    'src/': { parent_folder: '/', contained_files: ['src/auth.ts', 'src/missing.ts'] },
    'src/core/': { parent_folder: 'src/', contained_files: ['src/core/types.ts'] },
    'tests/': { parent_folder: '/', contained_files: [] },
    'orphan/': { parent_folder: 'nonexistent/', contained_files: [] },
  },
  files: {
    'src/auth.ts': { blocks: ['src/auth.ts::login', 'src/auth.ts::logout', 'src/auth.ts::ghost'] },
    'src/core/types.ts': { blocks: [] },
  },
  blocks: {
    'src/auth.ts::login': { confidence: 0.9 },
    'src/auth.ts::logout': { confidence: 0.5 },
    // 'ghost' block is in the file but NOT in the blocks index
  },
}

// ─── getRootFolders ───────────────────────────────────────────────────────────

describe('getRootFolders', () => {
  it('returns only folders with no parent or parent "/"', () => {
    const items = getRootFolders(INDEX)
    expect(items.map((i) => i.path)).toEqual(['src/', 'tests/'])
  })

  it('excludes folders whose parent is another folder', () => {
    const items = getRootFolders(INDEX)
    expect(items.map((i) => i.path)).not.toContain('src/core/')
  })

  it('sorts alphabetically', () => {
    const items = getRootFolders(INDEX)
    expect(items[0].path).toBe('src/')
    expect(items[1].path).toBe('tests/')
  })

  it('returns empty for an index with no root folders', () => {
    const empty: WhythoIndex = { folders: { 'a/': { parent_folder: 'b/', contained_files: [] } }, files: {}, blocks: {} }
    expect(getRootFolders(empty)).toHaveLength(0)
  })
})

// ─── getFolderChildren ────────────────────────────────────────────────────────

describe('getFolderChildren', () => {
  it('returns sub-folders before files', () => {
    const items = getFolderChildren(INDEX, 'src/')
    const types = items.map((i) => i.type)
    expect(types.indexOf('folder')).toBeLessThan(types.indexOf('file'))
  })

  it('returns sub-folders of the given folder', () => {
    const items = getFolderChildren(INDEX, 'src/')
    expect(items.find((i) => i.path === 'src/core/')).toBeDefined()
  })

  it('returns files present in both folder.contained_files and index.files', () => {
    const items = getFolderChildren(INDEX, 'src/')
    const paths = items.map((i) => i.path)
    expect(paths).toContain('src/auth.ts')
    expect(paths).not.toContain('src/missing.ts') // not in index.files
  })

  it('uses the filename as the label for files', () => {
    const items = getFolderChildren(INDEX, 'src/')
    const auth = items.find((i) => i.path === 'src/auth.ts')
    expect(auth?.label).toBe('auth.ts')
  })

  it('returns empty for a folder with no children', () => {
    expect(getFolderChildren(INDEX, 'tests/')).toHaveLength(0)
  })
})

// ─── getFileBlocks ────────────────────────────────────────────────────────────

describe('getFileBlocks', () => {
  it('returns only blocks that exist in the index', () => {
    const items = getFileBlocks(INDEX, 'src/auth.ts')
    expect(items.map((i) => i.label)).toEqual(['login', 'logout'])
  })

  it('strips the file path prefix to produce the block label', () => {
    const items = getFileBlocks(INDEX, 'src/auth.ts')
    for (const item of items) {
      expect(item.label).not.toContain('::')
      expect(item.label).not.toContain('/')
    }
  })

  it('sets path to the full symbolic ref', () => {
    const items = getFileBlocks(INDEX, 'src/auth.ts')
    expect(items[0].path).toBe('src/auth.ts::login')
  })

  it('returns empty for a file with no blocks in the index', () => {
    expect(getFileBlocks(INDEX, 'src/core/types.ts')).toHaveLength(0)
  })

  it('returns empty for a file not in the index', () => {
    expect(getFileBlocks(INDEX, 'src/nonexistent.ts')).toHaveLength(0)
  })
})
