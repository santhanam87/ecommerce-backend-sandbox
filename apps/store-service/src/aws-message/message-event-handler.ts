export interface MessageEventHandler {
  eventType: string;
  handleEvent(payload: unknown): Promise<void>;
}
