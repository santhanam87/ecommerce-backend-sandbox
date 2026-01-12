import { Module } from '@nestjs/common';
import { MessageEventHandler } from './message-event-handler';
import { AWSSnSService } from './aws-sns.service';
import { AWSSQSService } from './aws-sqs.service';

@Module({})
export class AwsMessageModule {
  static register(handlers: MessageEventHandler[]) {
    return {
      module: AwsMessageModule,
      providers: [
        AWSSnSService,
        AWSSQSService,
        {
          provide: 'MESSAGE_EVENT_HANDLERS',
          useValue: handlers,
        },
        {
          provide: AWSSQSService,
          useFactory: (handlerList: MessageEventHandler[]) => {
            return new AWSSQSService(handlerList);
          },
          inject: ['MESSAGE_EVENT_HANDLERS'],
        },
      ],
      exports: [AWSSnSService],
    };
  }
}
