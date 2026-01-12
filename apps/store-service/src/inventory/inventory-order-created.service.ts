import { Order } from 'generated/prisma/browser';
import { MessageEventHandler } from 'src/aws-message/message-event-handler';

export class OrderCreatedHandler implements MessageEventHandler {
  eventType = 'OrderCreated';

  handleEvent(payload: Order) {
    console.log('Reserve inventory for order', payload.id);
    return Promise.resolve();
  }
}
