import { Injectable } from '@nestjs/common';
import { ReceiveMessageCommand, SQSClient } from '@aws-sdk/client-sqs';
import { fromIni } from '@aws-sdk/credential-providers';
@Injectable()
export class AppService {
  private readonly sqsClient: SQSClient;
  constructor() {
    this.sqsClient = new SQSClient({
      region: 'us-east-1',
      credentials: fromIni({ profile: 'AdministratorAccess-782251713126' }),
    });
  }
  async longPoolSQSQueue() {
    const command = new ReceiveMessageCommand({
      MaxNumberOfMessages: 1,
      MessageAttributeNames: ['All'],
      QueueUrl:
        'https://sqs.us-east-1.amazonaws.com/782251713126/order-inventory-processing',
      WaitTimeSeconds: 20,
    });
    const response = await this.sqsClient.send(command);
    return JSON.parse(
      response.Messages && response.Messages[0]
        ? response?.Messages[0].Body || '{}'
        : '{}',
    );
  }
}
