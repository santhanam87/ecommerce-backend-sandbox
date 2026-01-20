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
import { ClientProxy, EventPattern } from '@nestjs/microservices';
import { Patterns } from 'src/common/messaging/event.pattern';

type OrderItem = {
  productId: string;
  quantity: number;
};

@UseGuards(JwtAuthGuard)
@Controller('inventory')
export class InventoryController {
  constructor(
    private readonly inventoryService: InventoryService,
    @Inject('INVENTORY_MESSAGE_CLIENT')
    private readonly inventoryMessageClient: ClientProxy,
  ) {}

  @EventPattern(Patterns.ProductCreated)
  async createInventory(createInventoryDto: CreateInventoryDto) {
    console.info('create inventory', createInventoryDto);
    try {
      const inventory =
        await this.inventoryService.createInventoryItem(createInventoryDto);
      this.inventoryMessageClient.emit(Patterns.InventoryCreateSuccess, {
        productId: createInventoryDto.productId,
      });
      return inventory;
    } catch (err) {
      this.inventoryMessageClient.emit(Patterns.InventoryCreateFailed, {
        productId: createInventoryDto.productId,
      });
      console.error('Error creating inventory item:', err);
    }
  }

  @Get(':productId')
  getInventory(@Param('productId') productId: string) {
    return this.inventoryService.getInventoryByProductId(productId);
  }

  @Post('adjust-stock')
  adjustStock(@Body() body: { productId: string; quantity: number }) {
    return this.inventoryService.adjustStock(body.productId, body.quantity);
  }

  @EventPattern(Patterns.OrderCreated)
  public async processPayment(order: { items: OrderItem[]; id: string }) {
    console.info('order created received in inventory:', order.id);
    try {
      const itemPromises = order.items.map(async (item) => {
        return this.inventoryService.adjustStock(item.productId, item.quantity);
      });
      await Promise.all(itemPromises);
      this.inventoryMessageClient.emit(Patterns.InventoryReserved, {
        id: order.id,
      });
    } catch (err) {
      this.inventoryMessageClient.emit(Patterns.InventoryReservedFailed, {
        id: order.id,
      });
      throw err;
    }
  }
}
