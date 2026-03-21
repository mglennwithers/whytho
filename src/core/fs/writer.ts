import * as fs from 'fs/promises'
import * as path from 'path'

/**
 * Atomically write a file using write-to-temp-then-rename.
 * Prevents corrupt state if the process is interrupted mid-write.
 */
export async function writeFile(filePath: string, content: string): Promise<void> {
  await fs.mkdir(path.dirname(filePath), { recursive: true })
  const tmp = `${filePath}.whytho-tmp`
  await fs.writeFile(tmp, content, 'utf8')
  await fs.rename(tmp, filePath)
}

export async function writeJson(filePath: string, data: unknown): Promise<void> {
  await writeFile(filePath, JSON.stringify(data, null, 2) + '\n')
}

export async function ensureDir(dirPath: string): Promise<void> {
  await fs.mkdir(dirPath, { recursive: true })
}

export async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath)
    return true
  } catch {
    return false
  }
}

export async function moveFile(src: string, dest: string): Promise<void> {
  await fs.mkdir(path.dirname(dest), { recursive: true })
  try {
    await fs.rename(src, dest)
  } catch {
    // rename across devices fails; fall back to copy + delete
    await fs.copyFile(src, dest)
    await fs.unlink(src)
  }
}
