import * as vscode from 'vscode'
import type { AnnotationService } from '../core/annotation-service.js'
import type { BlockFrontmatter, AnnotationFile, PushNote } from 'whytho'
import { parseSymbolicRef } from 'whytho'
import { extractSection } from '../util/markdown.js'
import { getConfidenceLevel, getConfidenceColor, loadThresholds } from '../util/confidence.js'

export class AnnotationPanel implements vscode.Disposable {
  private panel: vscode.WebviewPanel | null = null
  private currentRef: string | null = null

  constructor(
    private context: vscode.ExtensionContext,
    private service: AnnotationService,
  ) {}

  async show(symbolicRef: string): Promise<void> {
    this.currentRef = symbolicRef
    const annotation = await this.service.getBlockAnnotation(symbolicRef)
    if (!annotation) {
      vscode.window.showInformationMessage(`No annotation found for ${symbolicRef}`)
      return
    }

    const related = await this.service.getRelationships(symbolicRef)

    if (!this.panel) {
      this.panel = vscode.window.createWebviewPanel(
        'whytho.annotation',
        'whytho',
        vscode.ViewColumn.Beside,
        { enableScripts: true, retainContextWhenHidden: true },
      )
      this.panel.onDidDispose(() => {
        this.panel = null
        this.currentRef = null
      })
      this.panel.webview.onDidReceiveMessage((msg) =>
        this.handleMessage(msg),
      )
    }

    const { file, block: blockName } = parseSymbolicRef(symbolicRef)
    this.panel.title = `whytho: ${blockName}`
    this.panel.webview.html = this.buildHtml(annotation, symbolicRef, file, related)
  }

  async refresh(): Promise<void> {
    if (this.currentRef) await this.show(this.currentRef)
  }

  private buildHtml(
    annotation: AnnotationFile<BlockFrontmatter>,
    symbolicRef: string,
    filePath: string,
    related: { direction: 'out' | 'in'; edge: { type: string; source: string; target: string } }[],
  ): string {
    const fm = annotation.frontmatter
    const thresholds = loadThresholds()
    const confidence = fm.identity?.confidence ?? 0
    const level = getConfidenceLevel(confidence, thresholds)
    const color = getConfidenceColor(level)
    const pct = Math.round(confidence * 100)

    const sections = ['Purpose', 'Inferred Design Rationale', 'Tradeoffs', 'What Cannot Be Determined', 'Uncertainty']
    const sectionHtml = sections
      .map((heading) => {
        const content = extractSection(annotation.body, heading)
        if (!content) return ''
        return `<details open><summary><strong>${heading}</strong></summary><div class="section-body">${escapeHtml(content)}</div></details>`
      })
      .filter(Boolean)
      .join('\n')

    const activeNotes = (fm.push_notes ?? []).filter((n) => n.status === 'active')
    const notesHtml = activeNotes.length > 0
      ? buildPushNotesHtml(activeNotes)
      : ''

    const relHtml = related.length > 0
      ? buildRelationshipsHtml(related)
      : ''

    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
  body {
    font-family: var(--vscode-font-family);
    color: var(--vscode-foreground);
    background: var(--vscode-editor-background);
    padding: 16px;
    line-height: 1.6;
  }
  .header {
    border-bottom: 1px solid var(--vscode-widget-border);
    padding-bottom: 12px;
    margin-bottom: 16px;
  }
  .ref { font-size: 0.85em; opacity: 0.7; word-break: break-all; }
  .badge {
    display: inline-block;
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 0.85em;
    font-weight: bold;
    color: #fff;
    background: ${color};
  }
  .meta { font-size: 0.85em; opacity: 0.7; margin-top: 8px; }
  details { margin-bottom: 12px; }
  summary {
    cursor: pointer;
    padding: 4px 0;
    user-select: none;
  }
  .section-body {
    padding: 8px 0 4px 12px;
    white-space: pre-wrap;
    font-size: 0.95em;
  }
  ul { padding-left: 20px; }
  code {
    background: var(--vscode-textCodeBlock-background);
    padding: 1px 4px;
    border-radius: 3px;
    font-size: 0.9em;
  }
  .note-meta { font-size: 0.8em; opacity: 0.6; margin-bottom: 4px; }
  .nav-link {
    color: var(--vscode-textLink-foreground);
    cursor: pointer;
    text-decoration: underline;
  }
</style>
</head>
<body>
  <div class="header">
    <h2>${escapeHtml(parseSymbolicRef(symbolicRef).block)}</h2>
    <div class="ref">${escapeHtml(symbolicRef)}</div>
    <div style="margin-top: 8px;">
      <span class="badge">${pct}% confidence</span>
      <span style="margin-left: 8px; font-size: 0.85em;">${fm.identity?.canonical_metric ?? 'unknown'} metric</span>
    </div>
    <div class="meta">
      File: <span class="nav-link" onclick="navigateToSource()">${escapeHtml(filePath)}</span>
      &bull; Kind: ${escapeHtml(fm.identity?.structural?.kind ?? 'unknown')}
      ${fm.inferred ? '&bull; <em>Inferred</em>' : ''}
    </div>
  </div>
  ${sectionHtml}
  ${notesHtml}
  ${relHtml}
  <script>
    const vscode = acquireVsCodeApi();
    function navigateToSource() {
      vscode.postMessage({ type: 'navigateToSource', ref: '${escapeHtml(symbolicRef)}' });
    }
    function goToBlock(ref) {
      vscode.postMessage({ type: 'goToBlock', ref });
    }
    function showAnnotation(ref) {
      vscode.postMessage({ type: 'showAnnotation', ref });
    }
  </script>
</body>
</html>`
  }

  private async handleMessage(msg: { type: string; ref?: string }) {
    if (!msg.ref) return

    if (msg.type === 'navigateToSource' || msg.type === 'goToBlock') {
      await vscode.commands.executeCommand('whytho.goToBlock', msg.ref)
    } else if (msg.type === 'showAnnotation') {
      await this.show(msg.ref)
    }
  }

  dispose(): void {
    this.panel?.dispose()
  }
}

const TYPE_LABELS: Record<string, string> = {
  extends: 'Extends',
  depends_on: 'Depends on',
  implements: 'Implements',
  tests: 'Tests',
}

type RelatedEntry = {
  direction: 'out' | 'in'
  edge: { type: string; source: string; target: string }
}

function buildPushNotesHtml(notes: PushNote[]): string {
  const items = notes
    .map((n) => `<li><div class="note-meta">${escapeHtml(n.session)} &bull; ${escapeHtml(n.timestamp.slice(0, 10))}</div><div class="section-body">${escapeHtml(n.body)}</div></li>`)
    .join('\n')
  return `<details open><summary><strong>Developer Notes</strong> (${notes.length})</summary><ul>${items}</ul></details>`
}

function buildRelationshipsHtml(related: RelatedEntry[]): string {
  // Group by type
  const grouped = new Map<string, RelatedEntry[]>()
  for (const entry of related) {
    const list = grouped.get(entry.edge.type)
    if (list) list.push(entry)
    else grouped.set(entry.edge.type, [entry])
  }

  let html = ''
  for (const [type, entries] of grouped) {
    const label = TYPE_LABELS[type] ?? type
    html += `<details open><summary><strong>${escapeHtml(label)}</strong> (${entries.length})</summary><ul>`
    for (const { direction, edge } of entries) {
      const targetRef = direction === 'out' ? edge.target : edge.source
      const arrow = direction === 'out' ? '\u2192' : '\u2190'
      const shortName = targetRef.includes('::')
        ? targetRef.split('::').pop()!
        : targetRef
      const escaped = escapeHtml(targetRef)
      html += `<li>${arrow} <span class="nav-link" onclick="goToBlock('${escaped}')">`
      html += `<code>${escapeHtml(shortName)}</code></span>`
      html += ` <span class="nav-link" style="font-size:0.8em;opacity:0.6" onclick="showAnnotation('${escaped}')">(view)</span>`
      html += `</li>`
    }
    html += `</ul></details>`
  }
  return html
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}
