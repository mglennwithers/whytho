import { describe, it, expect } from 'vitest'
import { javaPlugin } from '../../src/core/parser/plugins/java.js'

const SAMPLE_SOURCE = `
package com.example;

import java.util.List;

public class UserService {

    private final UserRepository repo;

    public UserService(UserRepository repo) {
        this.repo = repo;
    }

    public User findById(String id) {
        return repo.findById(id).orElseThrow();
    }

    protected List<User> findAll() {
        return repo.findAll();
    }

    private void validateUser(User user) {
        if (user == null) throw new IllegalArgumentException("user is null");
    }

    static String normalize(String name) {
        return name.trim().toLowerCase();
    }
}

public interface UserRepository {
    java.util.Optional<User> findById(String id);
    List<User> findAll();
}

public enum Role {
    ADMIN, USER, GUEST
}
`.trim()

describe('javaPlugin', () => {
  it('has correct name and extensions', () => {
    expect(javaPlugin.name).toBe('java')
    expect(javaPlugin.extensions).toContain('.java')
  })

  it('detects class declaration', () => {
    const blocks = javaPlugin.parse(SAMPLE_SOURCE, 'UserService.java')
    const cls = blocks.find((b) => b.name === 'UserService')
    expect(cls).toBeDefined()
    expect(cls!.kind).toBe('class')
  })

  it('detects constructor', () => {
    const blocks = javaPlugin.parse(SAMPLE_SOURCE, 'UserService.java')
    const ctor = blocks.find((b) => b.kind === 'constructor')
    expect(ctor).toBeDefined()
    expect(ctor!.name).toBe('UserService')
    expect(ctor!.parameters).toContain('UserRepository')
  })

  it('detects public methods', () => {
    const blocks = javaPlugin.parse(SAMPLE_SOURCE, 'UserService.java')
    const method = blocks.find((b) => b.name === 'findById')
    expect(method).toBeDefined()
    expect(method!.kind).toBe('method')
    expect(method!.parameters).toContain('String id')
  })

  it('detects protected methods', () => {
    const blocks = javaPlugin.parse(SAMPLE_SOURCE, 'UserService.java')
    expect(blocks.find((b) => b.name === 'findAll')).toBeDefined()
  })

  it('detects private methods', () => {
    const blocks = javaPlugin.parse(SAMPLE_SOURCE, 'UserService.java')
    expect(blocks.find((b) => b.name === 'validateUser')).toBeDefined()
  })

  it('detects static methods', () => {
    const blocks = javaPlugin.parse(SAMPLE_SOURCE, 'UserService.java')
    expect(blocks.find((b) => b.name === 'normalize')).toBeDefined()
  })

  it('detects interface declaration', () => {
    const blocks = javaPlugin.parse(SAMPLE_SOURCE, 'UserService.java')
    const iface = blocks.find((b) => b.name === 'UserRepository')
    expect(iface).toBeDefined()
    expect(iface!.kind).toBe('interface')
  })

  it('detects enum declaration', () => {
    const blocks = javaPlugin.parse(SAMPLE_SOURCE, 'UserService.java')
    const en = blocks.find((b) => b.name === 'Role')
    expect(en).toBeDefined()
  })

  it('assigns line numbers', () => {
    const blocks = javaPlugin.parse(SAMPLE_SOURCE, 'UserService.java')
    for (const block of blocks) {
      expect(block.startLine).toBeGreaterThan(0)
      expect(block.endLine).toBeGreaterThanOrEqual(block.startLine)
    }
  })

  it('returns empty array for empty source', () => {
    expect(javaPlugin.parse('', 'Empty.java')).toEqual([])
  })

  it('does not produce blocks for comment-only source', () => {
    const source = '// This is a comment\n/* Block comment */\n'
    expect(javaPlugin.parse(source, 'Comment.java')).toEqual([])
  })
})
