import { ClientProxy } from '@nestjs/microservices';
import { PublishCommand, SNSClient } from '@aws-sdk/client-sns';
import { ReadPacket, WritePacket } from '@nestjs/microservices/interfaces';
import { fromIni } from '@aws-sdk/credential-providers';

class AWSClientProxy extends ClientProxy {
  private readonly snsClient: SNSClient;
  private readonly snsTopicArn: string;
  constructor() {
    super();
    this.snsClient = new SNSClient({
      credentials: fromIni({ profile: process.env.AWS_PROFILE }),
    });
    this.snsTopicArn = process.env.AWS_SNS_TOPIC_ARN || '';
  }

  async connect() {
    // TODO: Yet to uncover
    return new Promise((resolve) => resolve(null));
  }

  async close() {
    // TODO: Yet to uncover
    return new Promise((resolve) => resolve(null));
  }

  async dispatchEvent({ pattern, data }: ReadPacket<any>): Promise<any> {
    // TODO: Make it more generic
    return await this.snsClient.send(
      new PublishCommand({
        Message: JSON.stringify(data),
        TopicArn: this.snsTopicArn,
        MessageAttributes: {
          event: { DataType: 'String', StringValue: pattern },
        },
      }),
    );
  }

  publish(
    packet: ReadPacket<any>,
    callback: (packet: WritePacket<any>) => void,
  ) {
    console.log('message:', packet);
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
