import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOrderDto } from './dto/order-create.dto';

@Injectable()
export class OrderService {
  constructor(private readonly prisma: PrismaService) {}
  public async createOrder({ userId, orderItems }: CreateOrderDto) {
    const order = await this.prisma.$transaction(async (transaction) => {
      const status = 'CREATED';
      const totalAmount = orderItems.reduce((sum, { price, quantity }) => {
        sum += price * quantity;
        return sum;
      }, 0);
      const orderTransaction = await transaction.order.create({
        data: { userId, status, totalAmount },
      });
      await transaction.orderItem.createMany({
        data: orderItems.map((orderItem) => ({
          ...orderItem,
          orderId: orderTransaction.id,
        })),
      });
      return orderTransaction;
    });
    return await this.prisma.order.findMany({
      where: { id: order.id },
      select: { items: true, id: true, userId: true, status: true },
    });
  }
}
