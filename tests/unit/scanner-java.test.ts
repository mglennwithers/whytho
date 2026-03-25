import { describe, it, expect } from 'vitest'
import { javaScannerPlugin } from '../../src/core/relationships/scanner-plugins/java.js'
import type { BlockRegistry } from '../../src/core/relationships/scanner.js'

function makeRegistry(entries: string[]): BlockRegistry {
  const m = new Map<string, string>()
  for (const e of entries) { m.set(e, e.split('::')[0]) }
  return m
}

describe('javaScannerPlugin', () => {
  it('emits depends_on for static method call on imported class', () => {
    const registry = makeRegistry(['src/utils/StringUtils.java::StringUtils'])
    const edges = javaScannerPlugin.scan(
      'src/service/MyService.java',
      `import com.example.utils.StringUtils;\n\npublic class MyService {\n  public void run() {\n    StringUtils.trim("hello");\n  }\n}\n`,
      registry,
    )
    expect(edges).toContainEqual(
      expect.objectContaining({ type: 'depends_on', target: 'src/utils/StringUtils.java::StringUtils', source: 'static' }),
    )
  })

  it('emits depends_on for instantiation of imported class', () => {
    const registry = makeRegistry(['src/model/User.java::User'])
    const edges = javaScannerPlugin.scan(
      'src/service/UserService.java',
      `import com.example.model.User;\n\npublic class UserService {\n  public User create() {\n    return new User();\n  }\n}\n`,
      registry,
    )
    expect(edges).toContainEqual(
      expect.objectContaining({ type: 'depends_on', target: 'src/model/User.java::User', source: 'static' }),
    )
  })

  it('emits tests edge for usage in test file', () => {
    const registry = makeRegistry(['src/service/UserService.java::UserService'])
    const edges = javaScannerPlugin.scan(
      'src/service/UserServiceTest.java',
      `import com.example.service.UserService;\n\npublic class UserServiceTest {\n  public void testCreate() {\n    new UserService().create();\n  }\n}\n`,
      registry,
    )
    expect(edges).toContainEqual(
      expect.objectContaining({ type: 'tests', target: 'src/service/UserService.java::UserService', source: 'static' }),
    )
  })

  it('emits extends edge for class inheritance', () => {
    const registry = makeRegistry(['src/base/BaseHandler.java::BaseHandler'])
    const edges = javaScannerPlugin.scan(
      'src/handler/MyHandler.java',
      `import com.example.base.BaseHandler;\n\npublic class MyHandler extends BaseHandler {\n}\n`,
      registry,
    )
    expect(edges).toContainEqual(
      expect.objectContaining({ type: 'extends', target: 'src/base/BaseHandler.java::BaseHandler', source: 'static' }),
    )
  })

  it('emits implements edge for interface implementation', () => {
    const registry = makeRegistry(['src/api/Runnable.java::Runnable'])
    const edges = javaScannerPlugin.scan(
      'src/task/MyTask.java',
      `import com.example.api.Runnable;\n\npublic class MyTask implements Runnable {\n}\n`,
      registry,
    )
    expect(edges).toContainEqual(
      expect.objectContaining({ type: 'implements', target: 'src/api/Runnable.java::Runnable', source: 'static' }),
    )
  })

  it('emits no edges when the imported class is not in the registry', () => {
    const registry = makeRegistry([])
    const edges = javaScannerPlugin.scan(
      'src/service/MyService.java',
      `import java.util.List;\n\npublic class MyService {\n  public List<String> get() { return null; }\n}\n`,
      registry,
    )
    expect(edges).toHaveLength(0)
  })

  it('does not duplicate edges for repeated calls to the same target', () => {
    const registry = makeRegistry(['src/utils/StringUtils.java::StringUtils'])
    const edges = javaScannerPlugin.scan(
      'src/service/MyService.java',
      `import com.example.utils.StringUtils;\n\npublic class MyService {\n  public void a() { StringUtils.trim("x"); }\n  public void b() { StringUtils.trim("y"); }\n}\n`,
      registry,
    )
    const matching = edges.filter((e) => e.target === 'src/utils/StringUtils.java::StringUtils')
    expect(matching).toHaveLength(1)
  })
})
