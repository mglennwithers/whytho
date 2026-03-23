/**
 * The synthetic EventBus codebase used as context for all benchmark tasks.
 * Deliberately incomplete: unsubscribe() and once() are stubs, and emit()
 * has no error handling — these are the subjects of the benchmark tasks.
 */
export const EVENTBUS_SOURCE = `\
// EventBus — a synchronous publish/subscribe event bus
export type EventHandler<T = unknown> = (data: T) => void

export class EventBus {
  private readonly subs = new Map<string, Map<symbol, EventHandler>>()
  private readonly tokenIndex = new Map<symbol, string>()

  /**
   * Subscribe to an event. Returns an opaque token for unsubscription.
   */
  subscribe<T = unknown>(event: string, handler: EventHandler<T>): symbol {
    if (!this.subs.has(event)) this.subs.set(event, new Map())
    const token = Symbol(event)
    this.subs.get(event)!.set(token, handler as EventHandler)
    this.tokenIndex.set(token, event)
    return token
  }

  /**
   * Unsubscribe using a token returned by subscribe().
   * Returns true if the token was found and removed, false otherwise.
   */
  unsubscribe(token: symbol): boolean {
    // TODO: not yet implemented
    throw new Error('Not implemented')
  }

  /**
   * Emit an event, calling all subscribed handlers with the given data.
   */
  emit(event: string, data?: unknown): void {
    const handlers = this.subs.get(event)
    if (!handlers) return
    for (const handler of handlers.values()) {
      handler(data)
    }
  }

  /**
   * Subscribe for exactly one emission of an event, then auto-unsubscribe.
   * Returns a token that can be passed to unsubscribe() to cancel early.
   */
  once<T = unknown>(event: string, handler: EventHandler<T>): symbol {
    // TODO: not yet implemented
    throw new Error('Not implemented')
  }
}
`
