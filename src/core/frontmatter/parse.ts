import matter from 'gray-matter'
import type { AnyFrontmatter } from '../types.js'

export interface ParsedAnnotation<T extends AnyFrontmatter = AnyFrontmatter> {
  frontmatter: T
  body: string
}

export function parseAnnotation<T extends AnyFrontmatter>(raw: string): ParsedAnnotation<T> {
  const { data, content } = matter(raw)
  return {
    frontmatter: data as T,
    body: content.trim(),
  }
}
