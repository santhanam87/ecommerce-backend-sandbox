import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt.auth-guard';
import { InventoryService } from './inventory.service';
import { CreateInventoryDto } from './dto/inventory-create.dto';
import { ClientProxy, MessagePattern } from '@nestjs/microservices';
import { type OrderItem } from 'generated/prisma/browser';

@UseGuards(JwtAuthGuard)
@Controller('inventory')
export class InventoryController {
  constructor(
    private readonly inventoryService: InventoryService,
    @Inject('STORE_SERVICE') private readonly messageClient: ClientProxy,
  ) {}

  @MessagePattern({ event: 'product_created' })
  async createInventory(createInventoryDto: CreateInventoryDto) {
    try {
      const inventroy =
        await this.inventoryService.createInventoryItem(createInventoryDto);
      this.messageClient.emit(
        { event: 'product_inventory_created' },
        { productId: createInventoryDto.productId },
      );
      return inventroy;
    } catch (err) {
      this.messageClient.emit(
        { event: 'product_inventory_creation_failed' },
        { productId: createInventoryDto.productId },
      );
      console.error('Error creating inventory item:', err);
    }
  }
  @Get(':productId')
  getInventory(@Param('productId') productId: string) {
    this.messageClient.emit({ event: 'inventory_failed' }, { productId });
    console.info('emit');
    return this.inventoryService.getInventoryByProductId(productId);
  }

  @Post('adjust-stock')
  adjustStock(@Body() body: { productId: string; quantity: number }) {
    return this.inventoryService.adjustStock(body.productId, body.quantity);
  }

  @MessagePattern({ event: 'order_created' })
  public async processPayment(order: { items: OrderItem[]; id: string }) {
    try {
      const itemPromises = order.items.map(async (item) => {
        return this.inventoryService.adjustStock(
          item.productId as string,
          item.quantity as number,
        );
      });
      await Promise.all(itemPromises);
      this.messageClient.emit({ event: 'stock_reserved' }, order.id);
    } catch (err) {
      this.messageClient.emit({ event: 'stock_reserved_failed' }, order.id);
      throw err;
    }
  }
}
