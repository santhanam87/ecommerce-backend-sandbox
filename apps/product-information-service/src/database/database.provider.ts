import { ConfigModule, ConfigService } from '@nestjs/config';
import { Sequelize } from 'sequelize-typescript';
import { Product } from '../product/entities/product.entity';
import { Variant } from '../variant/entities/variant.entity';

export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: async (configService: ConfigService) => {
      const sequelize = new Sequelize({
        dialect: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        models: [Product, Variant],
      });
      await sequelize.sync();
      console.info('Database connected successfully');
      return sequelize;
    },
  },
];
