import * as vscode from 'vscode'
import type { AnnotationService } from '../core/annotation-service.js'
import type { WhythoIndex, FolderIndexEntry, FileIndexEntry, BlockIndexEntry } from 'whytho'
import { getConfidenceLevel, loadThresholds } from '../util/confidence.js'

type TreeItemType = 'folder' | 'file' | 'block'

interface WhythoTreeItem {
  type: TreeItemType
  label: string
  path: string // folder/file path or symbolic ref for blocks
  indexEntry: FolderIndexEntry | FileIndexEntry | BlockIndexEntry
}

export class WhythoTreeDataProvider
  implements vscode.TreeDataProvider<WhythoTreeItem>
{
  private _onDidChangeTreeData = new vscode.EventEmitter<void>()
  readonly onDidChangeTreeData = this._onDidChangeTreeData.event

  constructor(private service: AnnotationService) {}

  refresh(): void {
    this._onDidChangeTreeData.fire()
  }

  async getChildren(element?: WhythoTreeItem): Promise<WhythoTreeItem[]> {
    const index = await this.service.getIndex()

    if (!element) {
      return this.getRootFolders(index)
    }

    if (element.type === 'folder') {
      return this.getFolderChildren(index, element.path)
    }

    if (element.type === 'file') {
      return this.getFileBlocks(index, element.path)
    }

    return []
  }

  getTreeItem(element: WhythoTreeItem): vscode.TreeItem {
    const item = new vscode.TreeItem(element.label)

    if (element.type === 'folder') {
      item.collapsibleState = vscode.TreeItemCollapsibleState.Collapsed
      item.iconPath = new vscode.ThemeIcon('folder')
      const entry = element.indexEntry as FolderIndexEntry
      item.description = `${entry.contained_files.length} files`
    } else if (element.type === 'file') {
      item.collapsibleState = vscode.TreeItemCollapsibleState.Collapsed
      item.iconPath = new vscode.ThemeIcon('file-code')
      const entry = element.indexEntry as FileIndexEntry
      item.description = `${entry.blocks.length} blocks`
    } else {
      item.collapsibleState = vscode.TreeItemCollapsibleState.None
      const entry = element.indexEntry as BlockIndexEntry
      const thresholds = loadThresholds()
      const level = getConfidenceLevel(entry.confidence, thresholds)
      const pct = Math.round(entry.confidence * 100)
      item.description = `${pct}%`
      item.iconPath = new vscode.ThemeIcon(kindToIcon(entry))
      item.command = {
        command: 'whytho.showAnnotation',
        title: 'Show Annotation',
        arguments: [element.path],
      }

      item.tooltip = `${element.label} (${level} confidence)`
    }

    return item
  }

  private getRootFolders(index: WhythoIndex): WhythoTreeItem[] {
    return Object.entries(index.folders)
      .filter(([_, entry]) => !entry.parent_folder || entry.parent_folder === '/')
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([path, entry]) => ({
        type: 'folder' as const,
        label: path,
        path,
        indexEntry: entry,
      }))
  }

  private getFolderChildren(
    index: WhythoIndex,
    folderPath: string,
  ): WhythoTreeItem[] {
    // Sub-folders
    const subFolders = Object.entries(index.folders)
      .filter(([_, entry]) => entry.parent_folder === folderPath)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([path, entry]) => ({
        type: 'folder' as const,
        label: path.replace(folderPath, ''),
        path,
        indexEntry: entry,
      }))

    // Files in this folder
    const entry = index.folders[folderPath]
    const files = (entry?.contained_files ?? [])
      .filter((f) => index.files[f])
      .sort()
      .map((filePath) => ({
        type: 'file' as const,
        label: filePath.split('/').pop() ?? filePath,
        path: filePath,
        indexEntry: index.files[filePath],
      }))

    return [...subFolders, ...files]
  }

  private getFileBlocks(
    index: WhythoIndex,
    filePath: string,
  ): WhythoTreeItem[] {
    const fileEntry = index.files[filePath]
    if (!fileEntry) return []

    return fileEntry.blocks
      .filter((ref) => index.blocks[ref])
      .map((ref) => {
        const entry = index.blocks[ref]
        const blockName = ref.includes('::') ? ref.split('::')[1] : ref
        return {
          type: 'block' as const,
          label: blockName,
          path: ref,
          indexEntry: entry,
        }
      })
  }
}

function kindToIcon(entry: BlockIndexEntry): string {
  // Infer kind from the symbolic ref's context or use a default
  // The index doesn't store kind, so we use a generic symbol icon
  return 'symbol-method'
}
