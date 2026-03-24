import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/extension.ts'],
  format: ['cjs'],
  external: ['vscode'],
  outDir: 'dist',
  sourcemap: true,
  clean: true,
  // Bundle whytho and all non-vscode deps into the extension
  noExternal: [/^(?!vscode$).*/],
})
