import { Body, Controller, Delete, Param, Post } from '@nestjs/common';
import { PaymentService, type User } from './payment.service';
import { GetUser } from 'src/common/decorator/user.decorator';

@Controller('payment')
export class PaymentController {
  constructor(private paymentService: PaymentService) {}
  @Post()
  addPayment(@GetUser() { id }: User) {
    return this.paymentService.addPayment(id);
  }
  @Delete(':id')
  deletePayment(@Param('id') id: string) {
    return this.paymentService.removePayment(id);
  }
}
