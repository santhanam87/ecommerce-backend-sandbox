import { Global, Logger, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import Redis from "ioredis";
import { REDIS_CLIENT } from "./redis.constants";
import { RedisService } from "./redis.service";

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: REDIS_CLIENT,
      useFactory: (configService: ConfigService) => {
        const logger = new Logger("RedisClient");

        const host = configService.get<string>("REDIS_HOST") || "localhost";
        const port = Number(configService.get<string>("REDIS_PORT") || "6379");
        const password =
          configService.get<string>("REDIS_PASSWORD") || undefined;

        const client = new Redis({
          host,
          port,
          password,
          maxRetriesPerRequest: 1,
          enableReadyCheck: true,
        });

        client.on("error", (error) => {
          logger.error(`Redis error: ${error.message}`);
        });

        return client;
      },
      inject: [ConfigService],
    },
    RedisService,
  ],
  exports: [REDIS_CLIENT, RedisService],
})
export class RedisModule {}
