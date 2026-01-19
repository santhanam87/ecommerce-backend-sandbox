import { randomUUID } from 'crypto';
import { EventEnvelope, EventTarget } from './event-envelope';

interface CreateEventOptions<T> {
  pattern: string;
  source: string;
  data: T;
  correlationId?: string;
}

export function createEvent<T>(
  options: CreateEventOptions<T>,
): EventEnvelope<T> {
  return {
    id: randomUUID(),
    pattern: options.pattern,
    source: options.source,
    timestamp: new Date().toISOString(),
    correlationId: options.correlationId,
    data: options.data,
  };
}
