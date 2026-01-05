import {
  Body,
  Controller,
  Inject,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/order-create.dto';
import { OrderService } from './order.service';
import { ClientProxy, MessagePattern } from '@nestjs/microservices';
import { type User, type Order } from 'generated/prisma/client';
import { GetUser } from 'src/common/decorator/user.decorator';
import { JwtAuthGuard } from 'src/auth/jwt.auth-guard';
@UseGuards(JwtAuthGuard)
@Controller('order')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    @Inject('STORE_SERVICE') private readonly messageClient: ClientProxy,
  ) {}
  @Post()
  public async createOrder(
    @GetUser() user: User,
    @Body() createOrderPayload: CreateOrderDto,
  ) {
    try {
      const order = await this.orderService.createOrder(
        user,
        createOrderPayload,
      );
      return order;
    } catch (err) {
      console.error('Error creating order:', err);
      throw err;
    }
  }
  @MessagePattern({ event: 'stock_reserved' })
  public processPayment(order: Order) {
    console.info('stock reserved, process payment:', order.id);
    // this.messageClient.emit({ event: 'process_payment' }, order);
  }
  @MessagePattern({ event: 'stock_reserved_failed' })
  public updateOrderStatus(order: Order) {
    console.info('stock reserve failed:', order.id);
  }
}
