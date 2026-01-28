import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { PaymentService, type User } from './payment.service';
import { GetUser } from 'src/common/decorator/user.decorator';
import { JwtAuthGuard } from 'src/auth/jwt.auth-guard';
import { ClientProxy, EventPattern } from '@nestjs/microservices';
import { Patterns } from 'src/common/messaging/event.pattern';

@UseGuards(JwtAuthGuard)
@Controller('payment')
export class PaymentController {
  constructor(
    private paymentService: PaymentService,
    @Inject('PAYMENT_MESSAGE_CLIENT')
    private readonly paymentMessageClient: ClientProxy,
  ) {}
  @Post()
  addPayment(@GetUser() { id }: User) {
    return this.paymentService.addPayment(id);
  }
  @Get()
  getPaymentsByUserId(@GetUser() { id }: User) {
    return this.paymentService.getPaymentsByUserId(id);
  }
  @Delete(':id')
  deletePayment(@Param('id') id: string) {
    return this.paymentService.removePayment(id);
  }
  @EventPattern(Patterns.OrderCreated)
  async authroziePayment({ paymentId, id }: { paymentId: string; id: string }) {
    console.info('order created', paymentId);
    try {
      await this.paymentService.getPaymentsByUserId(paymentId);
      console.info({ id });
      this.paymentMessageClient.emit(Patterns.PaymentAuthorized, {
        orderId: id,
      });
      console.info('after emit');
    } catch (e) {
      console.info(e);
      this.paymentMessageClient.emit(Patterns.PaymentAutorizationFailed, {
        orderId: id,
      });
      throw e;
    }
  }
}
