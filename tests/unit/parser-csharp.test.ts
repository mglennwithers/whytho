import { describe, it, expect } from 'vitest'
import { csharpPlugin } from '../../src/core/parser/plugins/csharp.js'

const SAMPLE_SOURCE = `
using System;
using System.Collections.Generic;

namespace Example
{
    public class UserService
    {
        private readonly IUserRepository _repo;

        public UserService(IUserRepository repo)
        {
            _repo = repo;
        }

        public User GetById(string id)
        {
            return _repo.FindById(id) ?? throw new Exception("not found");
        }

        protected virtual List<User> GetAll()
        {
            return _repo.FindAll();
        }

        private static string Normalize(string name)
        {
            return name.Trim().ToLower();
        }

        public string Name { get; set; }

        public async Task<User> GetByIdAsync(string id)
        {
            return await _repo.FindByIdAsync(id);
        }
    }

    public interface IUserRepository
    {
        User? FindById(string id);
        List<User> FindAll();
    }

    public struct Point
    {
        public double X { get; init; }
        public double Y { get; init; }
    }

    public record UserRecord(string Id, string Name);

    public enum Role { Admin, User, Guest }
}
`.trim()

describe('csharpPlugin', () => {
  it('has correct name and extensions', () => {
    expect(csharpPlugin.name).toBe('csharp')
    expect(csharpPlugin.extensions).toContain('.cs')
  })

  it('detects class declaration', () => {
    const blocks = csharpPlugin.parse(SAMPLE_SOURCE, 'UserService.cs')
    const cls = blocks.find((b) => b.name === 'UserService')
    expect(cls).toBeDefined()
    expect(cls!.kind).toBe('class')
  })

  it('detects constructor', () => {
    const blocks = csharpPlugin.parse(SAMPLE_SOURCE, 'UserService.cs')
    const ctor = blocks.find((b) => b.kind === 'constructor')
    expect(ctor).toBeDefined()
    expect(ctor!.name).toBe('UserService')
  })

  it('detects public methods', () => {
    const blocks = csharpPlugin.parse(SAMPLE_SOURCE, 'UserService.cs')
    const method = blocks.find((b) => b.name === 'GetById')
    expect(method).toBeDefined()
    expect(method!.kind).toBe('method')
  })

  it('detects protected virtual methods', () => {
    const blocks = csharpPlugin.parse(SAMPLE_SOURCE, 'UserService.cs')
    expect(blocks.find((b) => b.name === 'GetAll')).toBeDefined()
  })

  it('detects private static methods', () => {
    const blocks = csharpPlugin.parse(SAMPLE_SOURCE, 'UserService.cs')
    expect(blocks.find((b) => b.name === 'Normalize')).toBeDefined()
  })

  it('detects async methods', () => {
    const blocks = csharpPlugin.parse(SAMPLE_SOURCE, 'UserService.cs')
    expect(blocks.find((b) => b.name === 'GetByIdAsync')).toBeDefined()
  })

  it('detects interface declaration', () => {
    const blocks = csharpPlugin.parse(SAMPLE_SOURCE, 'UserService.cs')
    const iface = blocks.find((b) => b.name === 'IUserRepository')
    expect(iface).toBeDefined()
    expect(iface!.kind).toBe('interface')
  })

  it('detects struct declaration', () => {
    const blocks = csharpPlugin.parse(SAMPLE_SOURCE, 'UserService.cs')
    const st = blocks.find((b) => b.name === 'Point')
    expect(st).toBeDefined()
  })

  it('detects record declaration', () => {
    const blocks = csharpPlugin.parse(SAMPLE_SOURCE, 'UserService.cs')
    expect(blocks.find((b) => b.name === 'UserRecord')).toBeDefined()
  })

  it('assigns line numbers', () => {
    const blocks = csharpPlugin.parse(SAMPLE_SOURCE, 'UserService.cs')
    for (const block of blocks) {
      expect(block.startLine).toBeGreaterThan(0)
      expect(block.endLine).toBeGreaterThanOrEqual(block.startLine)
    }
  })

  it('returns empty array for empty source', () => {
    expect(csharpPlugin.parse('', 'Empty.cs')).toEqual([])
  })
})
