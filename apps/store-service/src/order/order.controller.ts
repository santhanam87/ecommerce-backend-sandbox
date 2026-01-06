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
import { OrderStatus, type User } from 'generated/prisma/client';
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
    const order = await this.orderService.createOrder(user, createOrderPayload);
    this.messageClient.emit({ event: 'order_created' }, order);
    return order;
  }
  @MessagePattern({ event: 'stock_reserved' })
  public async processPayment(orderId: string) {
    await this.orderService.updateOrderStockStatus(orderId, true);
  }
  @MessagePattern({ event: 'stock_reserved_failed' })
  public async updateOrderStatus(orderId: string) {
    await this.orderService.updateOrderStockStatus(orderId, false);
    await this.orderService.updateOrderStatus(orderId, OrderStatus.FAILED);
  }
}
