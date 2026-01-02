import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ClientsModule, Transport } from '@nestjs/microservices';

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
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
