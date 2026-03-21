import {
  SessionFrontmatterSchema,
  FolderFrontmatterSchema,
  FileFrontmatterSchema,
  BlockFrontmatterSchema,
} from '../types.js'
import type { AnyFrontmatter } from '../types.js'
import { ZodError } from 'zod'

export class ValidationError extends Error {
  constructor(
    message: string,
    public readonly issues: ZodError['issues'],
  ) {
    super(message)
    this.name = 'ValidationError'
  }
}

export function validateAnnotation(data: unknown): AnyFrontmatter {
  const obj = data as Record<string, unknown>
  const type = obj?.type

  try {
    switch (type) {
      case 'session':
        return SessionFrontmatterSchema.parse(data)
      case 'folder':
        return FolderFrontmatterSchema.parse(data)
      case 'file':
        return FileFrontmatterSchema.parse(data)
      case 'block':
        return BlockFrontmatterSchema.parse(data)
      default:
        throw new ValidationError(`Unknown annotation type: ${String(type)}`, [])
    }
  } catch (err) {
    if (err instanceof ZodError) {
      throw new ValidationError(`Validation failed for ${String(type)} annotation`, err.issues)
    }
    throw err
  }
}

export function validateBlockAnnotation(data: unknown) {
  return BlockFrontmatterSchema.parse(data)
}

export function validateSessionAnnotation(data: unknown) {
  return SessionFrontmatterSchema.parse(data)
}
