const GLOBAL_EVENT_PREFIX = 'EV_GLOBAL'
const LOCAL_EVENT_PREFIX = 'EV_LOCAL'

export class BacklogEvent {
  private readonly _eventName: string

  private constructor(eventName: string) {
    this._eventName = eventName
  }

  public static global(eventName: string): BacklogEvent {
    return new BacklogEvent(
      BacklogEvent.__buildEventName(GLOBAL_EVENT_PREFIX, eventName),
    )
  }

  public static local(eventName: string): BacklogEvent {
    return new BacklogEvent(
      BacklogEvent.__buildEventName(LOCAL_EVENT_PREFIX, eventName),
    )
  }

  public get eventName(): string {
    return this._eventName
  }

  public dispatch(): void {
    window.dispatchEvent(new Event(this._eventName))
  }

  private static __buildEventName(prefix: string, eventName: string): string {
    const normalizedEventName = eventName.trim()
    if (!normalizedEventName) {
      throw new Error('Backlog event name cannot be empty.')
    }

    return `${prefix}-${normalizedEventName}`
  }
}
