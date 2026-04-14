import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Request } from "express";
import { createHash } from "node:crypto";
import { RedisService } from "src/redis/redis.service";
import { AccessTokenPayload } from "../types/token-payload.type";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly redisService: RedisService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>("JWT_SECRET") || "",
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: AccessTokenPayload) {
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    if (!token) {
      throw new UnauthorizedException("Missing access token");
    }

    const revoked = await this.redisService.get<boolean>(
      this.getAccessTokenRevokedKey(token),
    );
    if (revoked) {
      throw new UnauthorizedException("Access token revoked");
    }

    return {
      id: payload.id,
      email: payload.email,
      tenant_id: payload.tenant_id,
      is_active: payload.is_active,
    };
  }

  private getAccessTokenRevokedKey(token: string): string {
    const tokenHash = createHash("sha256").update(token).digest("hex");
    return `auth:access-token:revoked:${tokenHash}`;
  }
}
