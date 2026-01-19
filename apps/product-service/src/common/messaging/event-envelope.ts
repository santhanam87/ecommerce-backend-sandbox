export type EventTarget = string;
// e.g. 'payment' | 'inventory' | 'order'

export interface EventEnvelope<T = unknown> {
  /** Unique event id (uuid) */
  id: string;

  /** Logical routing key */
  pattern: string;

  /** Who published this event */
  source: string;

  /** ISO timestamp */
  timestamp: string;

  /** Saga / business correlation (orderId, etc.) */
  correlationId?: string;

  /** Business payload */
  data: T;
}
