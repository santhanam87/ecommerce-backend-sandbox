import { ClientProxy } from '@nestjs/microservices';
import { PublishCommand, SNSClient } from '@aws-sdk/client-sns';
import { ReadPacket, WritePacket } from '@nestjs/microservices/interfaces';
class AWSClientProxy extends ClientProxy {
  private readonly snsClient: SNSClient;
  private readonly snsTopicArn: string;
  constructor(snsTopicArn: string) {
    super();
    this.snsClient = new SNSClient({
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
        sessionToken: process.env.AWS_SESSION_TOKEN || '',
      },
    });
    this.snsTopicArn = snsTopicArn;
  }

  async connect() {
    // TODO: Yet to uncover
    return new Promise((resolve) => resolve(null));
  }

  async close() {
    // TODO: Yet to uncover
    return new Promise((resolve) => resolve(null));
  }

  async dispatchEvent({ pattern: event, data }: ReadPacket<any>): Promise<any> {
    // TODO: Make it more generic
    return await this.snsClient.send(
      new PublishCommand({
        Message: JSON.stringify({ ...data, event }),
        TopicArn: this.snsTopicArn,
        MessageAttributes: {
          event: { DataType: 'String', StringValue: event },
        },
      }),
    );
  }

  publish(
    packet: ReadPacket<any>,
    callback: (packet: WritePacket<any>) => void,
  ) {
    setTimeout(
      () =>
        callback({
          response: packet.data,
          isDisposed: true,
        }),
      5000,
    );

    return () => console.log('teardown');
  }

  unwrap<T = never>(): T {
    throw new Error('Method not implemented.');
  }
}

export default AWSClientProxy;
