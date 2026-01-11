import {
  Body,
  Controller,
  Delete,
  Inject,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CcardService } from './ccard.service';
import { JwtAuthGuard } from 'src/auth/jwt.auth-guard';
import { CreateCardDto } from './dto/create-card.dto';
import { ClientProxy, MessagePattern } from '@nestjs/microservices';
import { type Order } from 'generated/prisma/client';

@UseGuards(JwtAuthGuard)
@Controller('ccard')
export class CcardController {
  constructor(
    private readonly cCardService: CcardService,
    @Inject('STORE_SERVICE') private readonly messageClient: ClientProxy,
  ) {}
  @Post()
  addCard(@Body() cardData: CreateCardDto) {
    console.info(cardData);
    return this.cCardService.addCard(cardData);
  }
  @Delete(':cardId')
  removeCard(cardId: string) {
    return this.cCardService.removeCard(cardId);
  }
  @MessagePattern({ event: 'order_created' })
  public async authorizeCard({ paymentId, id }: Order) {
    await this.cCardService.authorizeCard(paymentId as string);
    this.messageClient.emit({ event: 'payment_authorized' }, id);
  }
  @MessagePattern({ event: 'order_complete' })
  public clearCardAuthorization() {
    // TODO: Dummy Implementation
    this.messageClient.emit({ event: 'payment_processed' }, {});
  }
}
