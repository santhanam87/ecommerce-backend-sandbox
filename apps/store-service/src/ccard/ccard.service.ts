import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCardDto } from './dto/create-card.dto';

@Injectable()
export class CcardService {
  constructor(private readonly prisma: PrismaService) {}
  async addCard(cardData: CreateCardDto) {
    console.info('Adding card for user:', cardData.userId);
    try {
      const card = await this.prisma.creditCard.create({
        data: {
          userId: cardData.userId,
          cvv: cardData.cvv,
          cardNumber: cardData.cardNumber,
          exp: cardData.exp,
          cardHolderName: cardData.cardHolderName,
        },
      });
      return card;
    } catch (error) {
      console.error('Error adding card:', error);
      throw error;
    }
  }
  removeCard(cardId: string) {
    return this.prisma.creditCard.delete({
      where: {
        id: cardId,
      },
    });
  }
  authorizeCard(cardId: string) {
    return this.prisma.creditCard.findUnique({
      where: {
        id: cardId,
      },
    });
  }
}
