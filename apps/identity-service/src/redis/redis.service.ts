import { Inject, Injectable, Logger, OnModuleDestroy } from "@nestjs/common";
import Redis from "ioredis";
import { REDIS_CLIENT } from "./redis.constants";

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);

  constructor(@Inject(REDIS_CLIENT) private readonly client: Redis) {}

  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await this.client.get(key);
      if (!value) {
        return null;
      }

      return JSON.parse(value) as T;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.warn(`Redis GET failed for key '${key}': ${message}`);
      return null;
    }
  }

  async set(key: string, value: unknown, ttlSeconds?: number): Promise<void> {
    try {
      const payload = JSON.stringify(value);
      if (ttlSeconds && ttlSeconds > 0) {
        await this.client.set(key, payload, "EX", ttlSeconds);
        return;
      }

      await this.client.set(key, payload);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.warn(`Redis SET failed for key '${key}': ${message}`);
    }
  }

  async del(...keys: string[]): Promise<number> {
    if (!keys.length) {
      return 0;
    }

    try {
      return await this.client.del(...keys);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.warn(`Redis DEL failed: ${message}`);
      return 0;
    }
  }

  async deleteByPattern(pattern: string): Promise<number> {
    let cursor = "0";
    let deleted = 0;

    try {
      do {
        const [nextCursor, keys] = await this.client.scan(
          cursor,
          "MATCH",
          pattern,
          "COUNT",
          "100",
        );
        cursor = nextCursor;

        if (keys.length) {
          deleted += await this.client.del(...keys);
        }
      } while (cursor !== "0");
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.warn(`Redis delete by pattern failed: ${message}`);
    }

    return deleted;
  }

  async onModuleDestroy(): Promise<void> {
    try {
      await this.client.quit();
    } catch {
      // noop
    }
  }
}
