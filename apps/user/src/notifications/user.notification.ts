import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { type UserEventPayload } from 'src/events/user.event';

@Injectable()
export class UsersNotification {
  @OnEvent('user.created')
  notifyUserCreation(payload: UserEventPayload) {
    console.log(`Notification sent to ${payload.email} for user creation.`);
  }
}
