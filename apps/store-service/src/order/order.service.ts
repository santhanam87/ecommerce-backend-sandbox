import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOrderDto } from './dto/order-create.dto';
import { User } from 'generated/prisma/client';

@Injectable()
export class OrderService {
  constructor(private readonly prisma: PrismaService) {}
  public async createOrder(
    { id: userId, name: fullName }: User,
    { items, shippingAddress }: CreateOrderDto,
  ) {
    try {
      console.info(userId, fullName);
      const order = await this.prisma.$transaction(async (transaction) => {
        const totalAmount = items.reduce((sum, { price, quantity }) => {
          sum += price * quantity;
          return sum;
        }, 0);
        const orderTransaction = await transaction.order.create({
          data: { userId, totalAmount },
        });
        await transaction.shippingAddress.create({
          data: {
            ...shippingAddress,
            orderId: orderTransaction.id,
            fullName,
          },
        });
        await transaction.orderItem.createMany({
          data: items.map((orderItem) => ({
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
    } catch (err) {
      console.error('Transaction failed:', err);
      throw err;
    }
  }
}
