import { describe, it, expect } from 'vitest'
import { pythonPlugin } from '../../src/core/parser/plugins/python.js'

const SAMPLE_SOURCE = `
def greet(name):
    return f"Hello, {name}"

async def fetch_data(url, timeout=30):
    pass

class UserService:
    def __init__(self, db):
        self.db = db

    def get_user(self, user_id):
        return self.db.find(user_id)

    async def update_user(self, user_id, data):
        return self.db.update(user_id, data)

class AdminService(UserService):
    def delete_user(self, user_id):
        self.db.delete(user_id)
`.trim()

describe('pythonPlugin', () => {
  it('has correct name and extensions', () => {
    expect(pythonPlugin.name).toBe('python')
    expect(pythonPlugin.extensions).toContain('.py')
    expect(pythonPlugin.extensions).toContain('.pyw')
    expect(pythonPlugin.extensions).toContain('.pyi')
  })

  it('detects module-level functions', () => {
    const blocks = pythonPlugin.parse(SAMPLE_SOURCE, 'sample.py')
    const fns = blocks.filter((b) => b.kind === 'function')
    const names = fns.map((b) => b.name)
    expect(names).toContain('greet')
    expect(names).toContain('fetch_data')
  })

  it('detects async functions', () => {
    const blocks = pythonPlugin.parse(SAMPLE_SOURCE, 'sample.py')
    const asyncFn = blocks.find((b) => b.name === 'fetch_data')
    expect(asyncFn).toBeDefined()
    expect(asyncFn!.kind).toBe('function')
    expect(asyncFn!.parentScope).toBe('module')
  })

  it('detects classes', () => {
    const blocks = pythonPlugin.parse(SAMPLE_SOURCE, 'sample.py')
    const classes = blocks.filter((b) => b.kind === 'class')
    const names = classes.map((b) => b.name)
    expect(names).toContain('UserService')
    expect(names).toContain('AdminService')
  })

  it('detects methods inside classes with correct kind', () => {
    const blocks = pythonPlugin.parse(SAMPLE_SOURCE, 'sample.py')
    const methods = blocks.filter((b) => b.kind === 'method')
    const names = methods.map((b) => b.name)
    expect(names).toContain('__init__')
    expect(names).toContain('get_user')
    expect(names).toContain('update_user')
    expect(names).toContain('delete_user')
  })

  it('assigns parentScope to enclosing class for methods', () => {
    const blocks = pythonPlugin.parse(SAMPLE_SOURCE, 'sample.py')
    const getUserBlock = blocks.find((b) => b.name === 'get_user')
    expect(getUserBlock).toBeDefined()
    expect(getUserBlock!.parentScope).toBe('UserService')
  })

  it('assigns parentScope=module for top-level functions', () => {
    const blocks = pythonPlugin.parse(SAMPLE_SOURCE, 'sample.py')
    const greet = blocks.find((b) => b.name === 'greet')
    expect(greet).toBeDefined()
    expect(greet!.parentScope).toBe('module')
  })

  it('captures parameters', () => {
    const blocks = pythonPlugin.parse(SAMPLE_SOURCE, 'sample.py')
    const greet = blocks.find((b) => b.name === 'greet')
    expect(greet).toBeDefined()
    expect(greet!.parameters).toContain('name')
  })

  it('assigns 1-indexed startLine', () => {
    const blocks = pythonPlugin.parse(SAMPLE_SOURCE, 'sample.py')
    for (const block of blocks) {
      expect(block.startLine).toBeGreaterThan(0)
    }
  })

  it('assigns indexInParent for same-kind blocks', () => {
    const blocks = pythonPlugin.parse(SAMPLE_SOURCE, 'sample.py')
    const classes = blocks.filter((b) => b.kind === 'class')
    expect(classes[0].indexInParent).toBe(0)
    expect(classes[1].indexInParent).toBe(1)
  })

  it('block content includes the definition', () => {
    const blocks = pythonPlugin.parse(SAMPLE_SOURCE, 'sample.py')
    const greet = blocks.find((b) => b.name === 'greet')
    expect(greet!.content).toContain('def greet')
    expect(greet!.content).toContain('Hello')
  })

  it('returns empty array for empty source', () => {
    const blocks = pythonPlugin.parse('', 'empty.py')
    expect(blocks).toEqual([])
  })

  it('handles source with only comments', () => {
    const source = '# This is a comment\n# Another comment\n'
    const blocks = pythonPlugin.parse(source, 'comments.py')
    expect(blocks).toEqual([])
  })
})
