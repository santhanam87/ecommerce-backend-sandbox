import { Injectable, OnModuleInit } from '@nestjs/common';
import {
  DeleteMessageCommand,
  ReceiveMessageCommand,
  SQSClient,
} from '@aws-sdk/client-sqs';
import { MessageEventHandler } from './message-event-handler';
@Injectable()
export class AWSSQSService implements OnModuleInit {
  private readonly client = new SQSClient({ region: process.env.AWS_REGION });
  constructor(private readonly handlers: MessageEventHandler[]) {}
  async onModuleInit() {
    await this.poolMessages();
  }
  private async poolMessages() {
    while (true) {
      try {
        const result = await this.client.send(
          new ReceiveMessageCommand({
            QueueUrl: process.env.SQS_QUEUE_URL,
            MaxNumberOfMessages: 10,
            WaitTimeSeconds: 20,
          }),
        );
        for (const msg of result.Messages ?? []) {
          await this.processMessage(msg);
        }
      } catch (err) {
        console.error('Error receiving messages from SQS:', err);
      }
    }
  }
  private async processMessage(message: any) {
    const snsEnvelope = JSON.parse(message.Body as string);
    const event = JSON.parse(snsEnvelope.Message as string);
    const handler = this.handlers.find((h) => h.eventType === event.eventType);
    if (!handler) {
      return;
    }
    await handler.handleEvent(event.data);
    await this.client.send(
      new DeleteMessageCommand({
        QueueUrl: process.env.SQS_QUEUE_URL!,
        ReceiptHandle: message.ReceiptHandle,
      }),
    );
  }
}
