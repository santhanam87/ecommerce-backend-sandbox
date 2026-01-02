import { Body, Controller, Inject, Post } from '@nestjs/common';
import { CreateOrderDto } from './dto/order-create.dto';
import { OrderService } from './order.service';
import { ClientProxy, MessagePattern } from '@nestjs/microservices';
import { type Order } from 'generated/prisma/client';

@Controller('order')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    @Inject('STORE_SERVICE') private readonly messageClient: ClientProxy,
  ) {}
  @Post()
  public async createOrder(@Body() createOrderPayload: CreateOrderDto) {
    const order = await this.orderService.createOrder(createOrderPayload);
    this.messageClient.emit({ event: 'order_created' }, order);
    return order;
  }
  @MessagePattern({ event: 'stock_reserved' })
  public processPayment(order: Order) {
    console.info('stock reserved, process payment:', order.id);
    this.messageClient.emit({ event: 'process_payment' }, order);
  }
  @MessagePattern({ event: 'stock_reserved_failed' })
  public updateOrderStatus(order: Order) {
    console.info('stock reserve failed:', order.id);
  }
}
