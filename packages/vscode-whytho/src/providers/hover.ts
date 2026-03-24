import * as vscode from 'vscode'
import type { AnnotationService } from '../core/annotation-service.js'
import { getConfidenceLevel, getConfidenceLabel, loadThresholds } from '../util/confidence.js'
import { extractSection } from '../util/markdown.js'

export class WhythoHoverProvider implements vscode.HoverProvider {
  constructor(private service: AnnotationService) {}

  async provideHover(
    document: vscode.TextDocument,
    position: vscode.Position,
    _token: vscode.CancellationToken,
  ): Promise<vscode.Hover | null> {
    const config = vscode.workspace.getConfiguration('whytho')
    if (!config.get<boolean>('showHoverCards', true)) return null

    const annotatedBlocks = await this.service.getAnnotatedBlocksForFile(document)

    // Find the block whose definition lines contain the hover position
    const hovered = annotatedBlocks.find((ab) => {
      const start = ab.parsedBlock.startLine - 1
      // Only trigger on the first few lines (signature), not the entire body
      const end = Math.min(ab.parsedBlock.startLine + 2, ab.parsedBlock.endLine) - 1
      return position.line >= start && position.line <= end
    })

    if (!hovered) return null

    const annotation = await this.service.getBlockAnnotation(hovered.symbolicRef)
    if (!annotation) return null

    const thresholds = loadThresholds()
    const level = getConfidenceLevel(hovered.indexEntry.confidence, thresholds)
    const icon = getConfidenceLabel(level)
    const pct = Math.round(hovered.indexEntry.confidence * 100)

    const md = new vscode.MarkdownString('', true)
    md.isTrusted = true
    md.supportHtml = true

    // Header
    md.appendMarkdown(
      `**whytho** \u2014 \`${hovered.parsedBlock.kind}\` ${icon} ${pct}%\n\n`,
    )

    // Purpose
    const purpose = extractSection(annotation.body, 'Purpose')
    if (purpose) {
      md.appendMarkdown(`${purpose}\n\n`)
    }

    // Link to full annotation
    const args = encodeURIComponent(JSON.stringify(hovered.symbolicRef))
    md.appendMarkdown(`[View full annotation](command:whytho.showAnnotation?${args})`)

    const hoverRange = new vscode.Range(
      hovered.parsedBlock.startLine - 1,
      0,
      Math.min(hovered.parsedBlock.startLine + 2, hovered.parsedBlock.endLine) - 1,
      Number.MAX_SAFE_INTEGER,
    )

    return new vscode.Hover(md, hoverRange)
  }
}

