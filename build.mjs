/** ESM host-only build for dsh-custom-header. */
import { build } from 'esbuild'
import { mkdirSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { createRequire } from 'node:module'

mkdirSync('lib', { recursive: true })

const require = createRequire(import.meta.url)
const dshExternal = ['@deepseek-ai/cordis', '@deepseek-ai/schemastery', '@deepseek-ai/dsh-*']

await build({
  entryPoints: ['src/host.ts'],
  outfile: 'lib/index.js',
  bundle: true,
  format: 'esm',
  platform: 'node',
  target: ['node22'],
  sourcemap: true,
  external: dshExternal,
  logLevel: 'info',
})

// Typecheck + emit declarations (PATH-independent, cross-platform).
execFileSync(process.execPath, [require.resolve('typescript/lib/tsc.js'), '-p', 'tsconfig.json'], { stdio: 'inherit' })