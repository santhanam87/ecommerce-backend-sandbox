import { Body, Controller, Post } from '@nestjs/common';
import { CreateOrderDto } from './dto/order-create.dto';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}
  @Post()
  public createOrder(@Body() createOrderPayload: CreateOrderDto) {
    console.info(createOrderPayload);
    return this.orderService.createOrder(createOrderPayload);
  }
}
