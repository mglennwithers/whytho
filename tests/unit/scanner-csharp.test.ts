import { describe, it, expect } from 'vitest'
import { csharpScannerPlugin } from '../../src/core/relationships/scanner-plugins/csharp.js'
import type { BlockRegistry } from '../../src/core/relationships/scanner.js'

function makeRegistry(entries: string[]): BlockRegistry {
  const m = new Map<string, string>()
  for (const e of entries) { m.set(e, e.split('::')[0]) }
  return m
}

describe('csharpScannerPlugin', () => {
  it('emits depends_on for instantiation of a using-imported class', () => {
    const registry = makeRegistry(['src/Models/User.cs::User'])
    const edges = csharpScannerPlugin.scan(
      'src/Services/UserService.cs',
      `using MyApp.Models;\n\npublic class UserService {\n  public User Create() => new User();\n}\n`,
      registry,
    )
    expect(edges).toContainEqual(
      expect.objectContaining({ type: 'depends_on', target: 'src/Models/User.cs::User', source: 'static' }),
    )
  })

  it('emits depends_on for static call on imported class', () => {
    const registry = makeRegistry(['src/Utils/StringHelper.cs::StringHelper'])
    const edges = csharpScannerPlugin.scan(
      'src/Services/MyService.cs',
      `using MyApp.Utils;\n\npublic class MyService {\n  public void Run() { StringHelper.Trim("x"); }\n}\n`,
      registry,
    )
    expect(edges).toContainEqual(
      expect.objectContaining({ type: 'depends_on', target: 'src/Utils/StringHelper.cs::StringHelper', source: 'static' }),
    )
  })

  it('emits tests edge for usage in a test file', () => {
    const registry = makeRegistry(['src/Services/UserService.cs::UserService'])
    const edges = csharpScannerPlugin.scan(
      'src/Tests/UserServiceTests.cs',
      `using MyApp.Services;\n\npublic class UserServiceTests {\n  public void TestCreate() { new UserService().Create(); }\n}\n`,
      registry,
    )
    expect(edges).toContainEqual(
      expect.objectContaining({ type: 'tests', target: 'src/Services/UserService.cs::UserService', source: 'static' }),
    )
  })

  it('emits extends edge for class inheritance', () => {
    const registry = makeRegistry(['src/Base/BaseController.cs::BaseController'])
    const edges = csharpScannerPlugin.scan(
      'src/Controllers/HomeController.cs',
      `using MyApp.Base;\n\npublic class HomeController : BaseController {\n}\n`,
      registry,
    )
    expect(edges).toContainEqual(
      expect.objectContaining({ type: 'extends', target: 'src/Base/BaseController.cs::BaseController', source: 'static' }),
    )
  })

  it('emits implements edge for interface with I-prefix convention', () => {
    const registry = makeRegistry(['src/Interfaces/IRepository.cs::IRepository'])
    const edges = csharpScannerPlugin.scan(
      'src/Repositories/UserRepository.cs',
      `using MyApp.Interfaces;\n\npublic class UserRepository : IRepository {\n}\n`,
      registry,
    )
    expect(edges).toContainEqual(
      expect.objectContaining({ type: 'implements', target: 'src/Interfaces/IRepository.cs::IRepository', source: 'static' }),
    )
  })

  it('emits no edges when the type is not in the registry', () => {
    const registry = makeRegistry([])
    const edges = csharpScannerPlugin.scan(
      'src/Services/MyService.cs',
      `using System.Collections.Generic;\n\npublic class MyService {\n  public List<string> Get() => new List<string>();\n}\n`,
      registry,
    )
    expect(edges).toHaveLength(0)
  })

  it('does not duplicate edges for repeated usage of the same target', () => {
    const registry = makeRegistry(['src/Utils/Logger.cs::Logger'])
    const edges = csharpScannerPlugin.scan(
      'src/Services/MyService.cs',
      `using MyApp.Utils;\n\npublic class MyService {\n  public void A() { Logger.Log("a"); }\n  public void B() { Logger.Log("b"); }\n}\n`,
      registry,
    )
    const matching = edges.filter((e) => e.target === 'src/Utils/Logger.cs::Logger')
    expect(matching).toHaveLength(1)
  })
})
