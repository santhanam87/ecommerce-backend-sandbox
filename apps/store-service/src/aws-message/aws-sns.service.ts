import { Injectable } from '@nestjs/common';
import { PublishCommand, SNSClient } from '@aws-sdk/client-sns';
import { randomUUID } from 'crypto';

@Injectable()
export class AWSSnSService {
  private readonly snsClient = new SNSClient({
    region: process.env.AWS_REGION,
  });
  async publishMessage(eventType: string, payload: unknown) {
    const event = {
      eventId: randomUUID(),
      eventType,
      occurredAt: new Date().toISOString(),
      data: payload,
    };
    const params = {
      TopicArn: process.env.AWS_SNS_TOPIC_ARN!,
      Message: JSON.stringify(event),
    };
    await this.snsClient.send(new PublishCommand(params));
  }
}
