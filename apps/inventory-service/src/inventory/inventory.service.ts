import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateInventoryDto } from './dto/inventory-create.dto';

@Injectable()
export class InventoryService {
  constructor(private readonly prisma: PrismaService) {}
  async createInventoryItem(data: CreateInventoryDto) {
    return await this.prisma.inventory.create({
      data: { ...data, availableQuantity: 0 },
    });
  }
  async getInventoryByProductId(productId: string) {
    const inventory = await this.prisma.inventory.findUnique({
      where: { productId },
    });
    return inventory;
  }
  async adjustStock(productId: string, quantity: number) {
    await this.prisma.$transaction(async (transaction) => {
      const inventory = await transaction.inventory.findUnique({
        where: { productId },
      });
      if (!inventory) {
        throw new Error('Inventory item not found');
      }
      if (inventory.availableQuantity - quantity < 0) {
        throw new Error('Insufficient stock');
      }
      await transaction.inventory.update({
        where: { productId },
        data: {
          availableQuantity: { decrement: quantity },
          reservedQuantity: { increment: quantity },
        },
      });
    });
    return this.getInventoryByProductId(productId);
  }
}
