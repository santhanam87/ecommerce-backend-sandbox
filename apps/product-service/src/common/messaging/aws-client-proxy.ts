import { ClientProxy } from '@nestjs/microservices';
import { PublishCommand, SNSClient } from '@aws-sdk/client-sns';
import { ReadPacket, WritePacket } from '@nestjs/microservices/interfaces';
import { EventEnvelope } from './event-envelope';
// import { fromIni } from '@aws-sdk/credential-providers';

class AWSClientProxy extends ClientProxy {
  private readonly snsClient: SNSClient;
  private readonly snsTopicArn: string;
  constructor(topicArn: string) {
    super();
    this.snsClient = new SNSClient();
    this.snsTopicArn = topicArn;
  }

  async connect() {
    // TODO: Yet to uncover
    return new Promise((resolve) => resolve(null));
  }

  async close() {
    // TODO: Yet to uncover
    return new Promise((resolve) => resolve(null));
  }

  async dispatchEvent({
    pattern,
    data,
  }: ReadPacket<EventEnvelope<any>>): Promise<any> {
    try {
      const publishResponse = await this.snsClient.send(
        new PublishCommand({
          Message: JSON.stringify({ ...data, pattern }),
          TopicArn: this.snsTopicArn,
        }),
      );
      console.info(publishResponse.MessageId);
      return publishResponse.MessageId;
    } catch (error) {
      console.error('Error publishing SNS message:', error);
      throw error;
    }
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
