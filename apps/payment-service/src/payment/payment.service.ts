import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

export type User = {
  id: string;
  name: string;
};

@Injectable()
export class PaymentService {
  constructor(private readonly prisma: PrismaService) {}
  async addPayment(userId: string) {
    return await this.prisma.payment.create({
      data: {
        userId,
      },
    });
  }
  async removePayment(id: string) {
    return await this.prisma.payment.delete({
      where: { id },
    });
  }
}
