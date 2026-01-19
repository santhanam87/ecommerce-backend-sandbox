import { Module } from '@nestjs/common';
import { CcardController } from './ccard.controller';
import { CcardService } from './ccard.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'STORE_SERVICE',
        transport: Transport.TCP,
      },
    ]),
    PrismaModule,
  ],
  controllers: [CcardController],
  providers: [CcardService],
})
export class CcardModule {}
