import type { WhythoIndex } from 'whytho'
import { readIndex } from 'whytho'

export class IndexCache {
  private index: WhythoIndex | null = null
  private loading: Promise<WhythoIndex> | null = null

  constructor(private whyRoot: string) {}

  async get(): Promise<WhythoIndex> {
    if (this.index) return this.index
    // Deduplicate concurrent loads
    if (!this.loading) {
      this.loading = this.load()
    }
    return this.loading
  }

  invalidate(): void {
    this.index = null
    this.loading = null
  }

  private async load(): Promise<WhythoIndex> {
    const raw = await readIndex(this.whyRoot)
    const index = raw as unknown as WhythoIndex
    this.index = index
    this.loading = null
    return index
  }
}
