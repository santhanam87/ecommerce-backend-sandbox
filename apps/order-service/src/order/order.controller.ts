import { Body, Controller, Inject, Post, UseGuards } from '@nestjs/common';
import { CreateOrderDto } from './dto/order-create.dto';
import { OrderService, type User } from './order.service';
import { ClientProxy, EventPattern } from '@nestjs/microservices';
import { OrderStatus } from 'generated/prisma/client';
import { GetUser } from 'src/common/decorator/user.decorator';
import { JwtAuthGuard } from 'src/auth/jwt.auth-guard';
import { Patterns } from 'src/common/messaging/event.pattern';
@UseGuards(JwtAuthGuard)
@Controller('order')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    @Inject('ORDER_MESSAGE_CLIENT')
    private readonly orderMessageClient: ClientProxy,
  ) {}
  @Post()
  public async createOrder(
    @GetUser() user: User,
    @Body() createOrderPayload: CreateOrderDto,
  ) {
    const order = await this.orderService.createOrder(user, createOrderPayload);
    this.orderMessageClient.emit(Patterns.OrderCreated, order);
    return order;
  }
  @EventPattern(Patterns.InventoryReserved)
  public async processPayment({ id: orderId }: { id: string }) {
    console.info('stock reserved for order:', orderId);
    await this.orderService.updateOrderStockStatus(orderId, true);
    const isOrderComplete =
      await this.orderService.checkOrderCompletion(orderId);
    if (isOrderComplete) {
      console.info('order complete from stock reserved');
      // this.messageClient.emit({ event: 'order_complete' }, orderId);
    }
  }
  @EventPattern(Patterns.InventoryReserveFailed)
  public async updateOrderStatus({ id: orderId }: { id: string }) {
    console.error('stock reservation failed for order:', orderId);
    await this.orderService.updateOrderStockStatus(orderId, false);
    await this.orderService.updateOrderStatus(orderId, OrderStatus.FAILED);
  }
  @EventPattern(Patterns.PaymentAuthorized)
  public async confirmOrderPayment(order) {
    console.info('payment authorized.....', order);
    await this.orderService.updateOrderPaymentStatus(order.orderId, true);
    const isOrderComplete = await this.orderService.checkOrderCompletion(
      order.orderId,
    );
    if (isOrderComplete) {
      console.info('order complete from payment authorized');
      // this.messageClient.emit({ event: 'order_complete' }, orderId);
    }
  }
  @EventPattern(Patterns.PaymentAuthorizationFailed)
  public async failOrderPayment({ orderId }: { orderId: string }) {
    await this.orderService.updateOrderPaymentStatus(orderId, false);
    await this.orderService.updateOrderStatus(orderId, OrderStatus.FAILED);
  }
}
