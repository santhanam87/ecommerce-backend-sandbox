import {
  SQSClient,
  ReceiveMessageCommand,
  DeleteMessageCommand,
} from '@aws-sdk/client-sqs';
import { Server, CustomTransportStrategy } from '@nestjs/microservices';
export interface SqsTransporterOptions {
  region?: string;
  queueUrl: string;
  waitTimeSeconds?: number;
  visibilityTimeout?: number;
  maxNumberOfMessages?: number;
  pollingIntervalMs?: number; // fallback polling when no messages
  sqsClient?: SQSClient;
}

export class AWSTransporter extends Server implements CustomTransportStrategy {
  private readonly client: SQSClient;
  private readonly queueUrl: string;
  private readonly waitTimeSeconds: number;
  private readonly visibilityTimeout?: number;
  private readonly maxNumberOfMessages: number;
  private readonly pollingIntervalMs: number;
  private active = false;
  private poller?: Promise<void>;

  constructor(private readonly options: SqsTransporterOptions) {
    super();
    this.client = options.sqsClient ?? new SQSClient();
    this.queueUrl = options.queueUrl;
    this.waitTimeSeconds = options.waitTimeSeconds ?? 20;
    this.visibilityTimeout = options.visibilityTimeout;
    this.maxNumberOfMessages = options.maxNumberOfMessages ?? 10;
    this.pollingIntervalMs = options.pollingIntervalMs ?? 1000;
  }
  unwrap<T = never>(): T {
    throw new Error('Method not implemented.');
  }
  on(_event: string, _callback: Function) {
    console.info(_event, _callback);
    throw new Error('Method not implemented.');
  }
  listen(callback: () => void) {
    this.active = true;
    // notify Nest that transport is ready
    callback();
    this.poller = this.pollLoop();
  }

  async close() {
    this.active = false;
    // wait for poller to exit
    if (this.poller) {
      await this.poller;
    }
  }

  private async pollLoop() {
    while (this.active) {
      try {
        const resp = await this.client.send(
          new ReceiveMessageCommand({
            QueueUrl: this.queueUrl,
            WaitTimeSeconds: this.waitTimeSeconds,
            MaxNumberOfMessages: this.maxNumberOfMessages,
            MessageAttributeNames: ['All'],
            AttributeNames: ['All'],
            VisibilityTimeout: this.visibilityTimeout,
          }),
        );

        const messages = resp.Messages ?? [];
        console.info(messages);
        if (messages.length === 0) {
          // nothing to do, lightweight wait to avoid tight loop
          await this.sleep(this.pollingIntervalMs);
          continue;
        }

        // process messages concurrently, but limit concurrency if desired
        await Promise.all(
          messages.map((m) => this.handleMessage(m.Body, m.ReceiptHandle)),
        );
      } catch (err) {
        // keep running on errors
        console.error('SqsTransporter poll error', err);
        await this.sleep(this.pollingIntervalMs);
      }
    }
  }

  private async handleMessage(
    body: string | undefined,
    receiptHandle: string | undefined,
  ) {
    if (!body || !receiptHandle) {
      return;
    }

    let packet: any;
    try {
      packet = JSON.parse(body);
    } catch (err) {
      console.info(err);
      await this.deleteMessage(receiptHandle);
      return;
    }
    const { pattern, ...data } = JSON.parse(packet.Message);
    console.info(pattern);
    if (!pattern) {
      await this.deleteMessage(receiptHandle);
      return;
    }
    const handler = this.getHandlerByPattern(pattern as string);
    if (!handler) {
      await this.deleteMessage(receiptHandle);
      return;
    }

    try {
      await handler(data);
      await this.deleteMessage(receiptHandle);
    } catch (err) {
      console.error('SqsTransporter handler error:', err);
      await this.deleteMessage(receiptHandle);
    }
  }

  private async deleteMessage(receiptHandle: string) {
    try {
      await this.client.send(
        new DeleteMessageCommand({
          QueueUrl: this.queueUrl,
          ReceiptHandle: receiptHandle,
        }),
      );
    } catch (err) {
      console.error('SqsTransporter deleteMessage error', err);
    }
  }

  private sleep(ms: number) {
    return new Promise((res) => setTimeout(res, ms));
  }
}
