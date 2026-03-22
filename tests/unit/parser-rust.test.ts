import { describe, it, expect } from 'vitest'
import { rustPlugin } from '../../src/core/parser/plugins/rust.js'

const SAMPLE_SOURCE = `
use std::fmt;

pub struct UserService {
    db: Database,
}

pub trait Repository {
    fn find(&self, id: &str) -> Option<User>;
    fn save(&self, user: User) -> Result<(), Error>;
}

pub enum UserStatus {
    Active,
    Inactive,
    Banned,
}

pub type UserID = String;

pub const MAX_USERS: usize = 1000;

pub fn create_service(db: Database) -> UserService {
    UserService { db }
}

impl UserService {
    pub fn new(db: Database) -> Self {
        Self { db }
    }

    pub fn get_user(&self, id: &str) -> Option<User> {
        self.db.find(id)
    }

    pub async fn update_user(&mut self, id: &str, data: UserData) -> Result<(), Error> {
        self.db.update(id, data)
    }
}

impl fmt::Display for UserService {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "UserService")
    }
}
`.trim()

describe('rustPlugin', () => {
  it('has correct name and extensions', () => {
    expect(rustPlugin.name).toBe('rust')
    expect(rustPlugin.extensions).toContain('.rs')
  })

  it('detects struct declarations as class', () => {
    const blocks = rustPlugin.parse(SAMPLE_SOURCE, 'sample.rs')
    const structs = blocks.filter((b) => b.kind === 'class')
    expect(structs.map((b) => b.name)).toContain('UserService')
  })

  it('detects trait declarations as interface', () => {
    const blocks = rustPlugin.parse(SAMPLE_SOURCE, 'sample.rs')
    const traits = blocks.filter((b) => b.kind === 'interface')
    expect(traits.map((b) => b.name)).toContain('Repository')
  })

  it('detects enum declarations as type', () => {
    const blocks = rustPlugin.parse(SAMPLE_SOURCE, 'sample.rs')
    const enums = blocks.filter((b) => b.kind === 'type')
    expect(enums.map((b) => b.name)).toContain('UserStatus')
  })

  it('detects type aliases as type', () => {
    const blocks = rustPlugin.parse(SAMPLE_SOURCE, 'sample.rs')
    const types = blocks.filter((b) => b.kind === 'type')
    expect(types.map((b) => b.name)).toContain('UserID')
  })

  it('detects const declarations', () => {
    const blocks = rustPlugin.parse(SAMPLE_SOURCE, 'sample.rs')
    const consts = blocks.filter((b) => b.kind === 'const')
    expect(consts.map((b) => b.name)).toContain('MAX_USERS')
  })

  it('detects module-level functions', () => {
    const blocks = rustPlugin.parse(SAMPLE_SOURCE, 'sample.rs')
    const fns = blocks.filter((b) => b.kind === 'function')
    expect(fns.map((b) => b.name)).toContain('create_service')
  })

  it('detects impl methods', () => {
    const blocks = rustPlugin.parse(SAMPLE_SOURCE, 'sample.rs')
    const methods = blocks.filter((b) => b.kind === 'method')
    const names = methods.map((b) => b.name)
    expect(names).toContain('new')
    expect(names).toContain('get_user')
    expect(names).toContain('update_user')
  })

  it('assigns impl type as parentScope for methods', () => {
    const blocks = rustPlugin.parse(SAMPLE_SOURCE, 'sample.rs')
    const newMethod = blocks.find((b) => b.name === 'new' && b.kind === 'method')
    expect(newMethod).toBeDefined()
    expect(newMethod!.parentScope).toBe('UserService')
  })

  it('assigns parentScope=module for top-level functions', () => {
    const blocks = rustPlugin.parse(SAMPLE_SOURCE, 'sample.rs')
    const fn = blocks.find((b) => b.name === 'create_service')
    expect(fn).toBeDefined()
    expect(fn!.parentScope).toBe('module')
  })

  it('handles async fn methods', () => {
    const blocks = rustPlugin.parse(SAMPLE_SOURCE, 'sample.rs')
    const asyncMethod = blocks.find((b) => b.name === 'update_user')
    expect(asyncMethod).toBeDefined()
    expect(asyncMethod!.kind).toBe('method')
  })

  it('handles pub visibility modifier', () => {
    const blocks = rustPlugin.parse(SAMPLE_SOURCE, 'sample.rs')
    // All items are pub — they should all be detected
    expect(blocks.length).toBeGreaterThan(5)
  })

  it('assigns 1-indexed startLine', () => {
    const blocks = rustPlugin.parse(SAMPLE_SOURCE, 'sample.rs')
    for (const block of blocks) {
      expect(block.startLine).toBeGreaterThan(0)
    }
  })

  it('block content includes the definition', () => {
    const blocks = rustPlugin.parse(SAMPLE_SOURCE, 'sample.rs')
    const struct = blocks.find((b) => b.name === 'UserService' && b.kind === 'class')
    expect(struct!.content).toContain('struct UserService')
  })

  it('returns empty array for empty source', () => {
    const blocks = rustPlugin.parse('', 'empty.rs')
    expect(blocks).toEqual([])
  })

  it('detects impl for trait (e.g. fmt::Display)', () => {
    const blocks = rustPlugin.parse(SAMPLE_SOURCE, 'sample.rs')
    // fmt method from impl fmt::Display for UserService
    const fmtMethod = blocks.find((b) => b.name === 'fmt' && b.kind === 'method')
    expect(fmtMethod).toBeDefined()
    expect(fmtMethod!.parentScope).toBe('UserService')
  })
})
