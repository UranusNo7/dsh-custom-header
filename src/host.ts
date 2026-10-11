/** Pure host plugin: Codex identity headers for GPT model requests only. */
import type { Context } from '@deepseek-ai/cordis'
import type { GenerateOptions, StreamChunk } from '@deepseek-ai/dsh-llm'
import z from '@deepseek-ai/schemastery'
import { AsyncLocalStorage } from 'node:async_hooks'
import { registerFetchMiddleware } from './fetch-pipeline.ts'

export const name = 'dsh-custom-header'
export const inject: string[] = []
export interface Config {
  codexVersion?: string
}
export const Config = z.object({
  codexVersion: z.string().default('0.147.0'),
})

export function apply(ctx: Context, config: Config = {}): void {
  const version = config.codexVersion?.trim() || '0.147.0'
  const modelContext = new AsyncLocalStorage<string>()

  ctx.effect(() => registerFetchMiddleware({
    name: 'dsh-custom-header-header-inject',
    priority: 7,
    middleware: async ({ input, init, next }) => {
      const model = modelContext.getStore()
      if (!model || !/gpt/i.test(model)) return next(input, init)
      const headers = new Headers(init?.headers ?? (input instanceof Request ? input.headers : undefined))
      headers.set('User-Agent', `codex_cli_rs/${version} (Windows 10.0.19045; x86_64) WindowsTerminal`)
      headers.set('Originator', 'codex_cli_rs')
      return next(input, { ...init, headers })
    },
  }), 'dsh-custom-header: Codex headers')

  ctx.on('llm/stream', (options: GenerateOptions, next: () => AsyncIterable<StreamChunk>) => {
    const model = options.model
    const iterator = modelContext.run(model, () => next()[Symbol.asyncIterator]())
    const done = (): IteratorResult<StreamChunk> => ({ done: true, value: undefined })
    return {
      [Symbol.asyncIterator]() {
        return {
          next: () => modelContext.run(model, () => iterator.next()),
          return: () => modelContext.run(model, () => iterator.return?.() ?? Promise.resolve(done())),
          throw: (error: unknown) => modelContext.run(model, () => {
            if (iterator.throw) return iterator.throw(error)
            return Promise.reject(error)
          }),
        }
      },
    }
  })
  ctx.logger.info('[dsh-custom-header] Codex headers enabled only for model names containing gpt')
}

export default apply
