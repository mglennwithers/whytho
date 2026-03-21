import * as yaml from 'js-yaml'
import type { AnyFrontmatter } from '../types.js'

export function serializeAnnotation(frontmatter: AnyFrontmatter, body: string): string {
  const yamlStr = yaml.dump(frontmatter, {
    lineWidth: 120,
    quotingType: '"',
    forceQuotes: false,
    noRefs: true,
  })
  return `---\n${yamlStr}---\n\n${body}\n`
}
