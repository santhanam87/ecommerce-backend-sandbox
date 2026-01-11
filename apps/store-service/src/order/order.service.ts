import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOrderDto } from './dto/order-create.dto';
import { OrderStatus, User } from 'generated/prisma/client';

@Injectable()
export class OrderService {
  constructor(private readonly prisma: PrismaService) {}
  public async createOrder(
    { id: userId, name: fullName }: User,
    { items, shippingAddress, paymentId }: CreateOrderDto,
  ) {
    const order = await this.prisma.$transaction(async (transaction) => {
      const totalAmount = items.reduce((sum, { price, quantity }) => {
        sum += price * quantity;
        return sum;
      }, 0);
      const orderTransaction = await transaction.order.create({
        data: { userId, totalAmount, paymentId },
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
    return await this.prisma.order.findUnique({
      where: { id: order.id },
      select: {
        items: true,
        id: true,
        userId: true,
        status: true,
        totalAmount: true,
        createdAt: true,
        shippingAddress: true,
        paymentId: true,
      },
    });
  }
  public async updateOrderStockStatus(id: string, isStockReserved: boolean) {
    return await this.prisma.order.update({
      where: { id },
      data: { isStockReserved },
    });
  }
  public async updateOrderPaymentStatus(
    orderId: string,
    isPaymentAuthorized: boolean,
  ) {
    return await this.prisma.order.update({
      where: { id: orderId },
      data: { isPaymentAuthorized },
    });
  }
  public async updateOrderStatus(orderId: string, status: OrderStatus) {
    return await this.prisma.order.update({
      where: { id: orderId },
      data: { status },
    });
  }
  public async checkOrderCompletion(orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });
    if (order?.isStockReserved && order?.isPaymentAuthorized) {
      await this.updateOrderStatus(orderId, OrderStatus.CONFIRMED);
      return true;
    }
    return false;
  }
}
