import { describe, it, expect } from 'vitest'
import { goPlugin } from '../../src/core/parser/plugins/go.js'

const SAMPLE_SOURCE = `
package main

import "fmt"

type UserService struct {
    db Database
}

type UserRepository interface {
    FindByID(id string) (*User, error)
    Save(user *User) error
}

type UserID = string

func NewUserService(db Database) *UserService {
    return &UserService{db: db}
}

func (s *UserService) GetUser(id string) (*User, error) {
    return s.db.Find(id)
}

func (s *UserService) CreateUser(name string, email string) (*User, error) {
    u := &User{Name: name, Email: email}
    return u, s.db.Save(u)
}

func helper() string {
    return fmt.Sprintf("helper")
}
`.trim()

describe('goPlugin', () => {
  it('has correct name and extensions', () => {
    expect(goPlugin.name).toBe('go')
    expect(goPlugin.extensions).toContain('.go')
  })

  it('detects struct types as class', () => {
    const blocks = goPlugin.parse(SAMPLE_SOURCE, 'sample.go')
    const structs = blocks.filter((b) => b.kind === 'class')
    expect(structs.length).toBeGreaterThan(0)
    expect(structs.map((b) => b.name)).toContain('UserService')
  })

  it('detects interface types', () => {
    const blocks = goPlugin.parse(SAMPLE_SOURCE, 'sample.go')
    const ifaces = blocks.filter((b) => b.kind === 'interface')
    expect(ifaces.length).toBeGreaterThan(0)
    expect(ifaces.map((b) => b.name)).toContain('UserRepository')
  })

  it('detects type aliases', () => {
    const blocks = goPlugin.parse(SAMPLE_SOURCE, 'sample.go')
    const types = blocks.filter((b) => b.kind === 'type')
    expect(types.map((b) => b.name)).toContain('UserID')
  })

  it('detects regular functions', () => {
    const blocks = goPlugin.parse(SAMPLE_SOURCE, 'sample.go')
    const fns = blocks.filter((b) => b.kind === 'function')
    const names = fns.map((b) => b.name)
    expect(names).toContain('NewUserService')
    expect(names).toContain('helper')
  })

  it('detects methods with receiver', () => {
    const blocks = goPlugin.parse(SAMPLE_SOURCE, 'sample.go')
    const methods = blocks.filter((b) => b.kind === 'method')
    const names = methods.map((b) => b.name)
    expect(names).toContain('GetUser')
    expect(names).toContain('CreateUser')
  })

  it('assigns receiver type as parentScope for methods', () => {
    const blocks = goPlugin.parse(SAMPLE_SOURCE, 'sample.go')
    const getUser = blocks.find((b) => b.name === 'GetUser')
    expect(getUser).toBeDefined()
    expect(getUser!.parentScope).toBe('UserService')
  })

  it('assigns parentScope=package for top-level functions', () => {
    const blocks = goPlugin.parse(SAMPLE_SOURCE, 'sample.go')
    const fn = blocks.find((b) => b.name === 'NewUserService')
    expect(fn).toBeDefined()
    expect(fn!.parentScope).toBe('package')
  })

  it('captures parameters for functions', () => {
    const blocks = goPlugin.parse(SAMPLE_SOURCE, 'sample.go')
    const fn = blocks.find((b) => b.name === 'NewUserService')
    expect(fn).toBeDefined()
    expect(fn!.parameters).toContain('db')
  })

  it('assigns 1-indexed startLine', () => {
    const blocks = goPlugin.parse(SAMPLE_SOURCE, 'sample.go')
    for (const block of blocks) {
      expect(block.startLine).toBeGreaterThan(0)
    }
  })

  it('block content includes the definition', () => {
    const blocks = goPlugin.parse(SAMPLE_SOURCE, 'sample.go')
    const fn = blocks.find((b) => b.name === 'GetUser')
    expect(fn!.content).toContain('func (s *UserService) GetUser')
  })

  it('returns empty array for empty source', () => {
    const blocks = goPlugin.parse('', 'empty.go')
    expect(blocks).toEqual([])
  })

  it('assigns indexInParent sequentially per kind', () => {
    const blocks = goPlugin.parse(SAMPLE_SOURCE, 'sample.go')
    const methods = blocks.filter((b) => b.kind === 'method')
    expect(methods[0].indexInParent).toBe(0)
    expect(methods[1].indexInParent).toBe(1)
  })
})
