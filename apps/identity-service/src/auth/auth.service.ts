import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";
import { LoginDto } from "./dto/login.dto";
import { RefreshTokenDto } from "./dto/refresh-token.dto";
import { User } from "./user/entities/user.entity";
import { UserService } from "./user/user.service";
import {
  AccessTokenPayload,
  RefreshTokenPayload,
} from "./types/token-payload.type";

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login(
    loginDto: LoginDto,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const user = await this.userService.findActiveByEmail(loginDto.email);

    if (!user || !(await bcrypt.compare(loginDto.password, user.password))) {
      throw new UnauthorizedException("Invalid credentials");
    }

    return this.signTokens(this.buildAccessPayload(user));
  }

  async refresh(
    refreshTokenDto: RefreshTokenDto,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const refreshSecret = this.getRefreshSecret();

    let payload: RefreshTokenPayload;
    try {
      payload = await this.jwtService.verifyAsync(
        refreshTokenDto.refresh_token,
        {
          secret: refreshSecret,
        },
      );
    } catch {
      throw new UnauthorizedException("Invalid refresh token");
    }

    if (payload.type !== "refresh") {
      throw new UnauthorizedException("Invalid refresh token");
    }

    const user = await this.userService.findActiveById(payload.sub);
    if (!user) {
      throw new UnauthorizedException("Invalid refresh token");
    }

    return this.signTokens(this.buildAccessPayload(user));
  }

  private async signTokens(
    payload: AccessTokenPayload,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const access_token = await this.jwtService.signAsync(payload);
    const refresh_token = await this.jwtService.signAsync(
      {
        sub: payload.id,
        type: "refresh",
      },
      {
        secret: this.getRefreshSecret(),
        expiresIn: "7d",
      },
    );

    return { access_token, refresh_token };
  }

  private buildAccessPayload(user: User): AccessTokenPayload {
    return {
      id: user.id,
      email: user.email,
      tenant_id: user.tenant_id,
      is_active: user.is_active,
    };
  }

  private getRefreshSecret(): string {
    return (
      this.configService.get<string>("JWT_REFRESH_SECRET") ||
      this.configService.get<string>("JWT_SECRET") ||
      ""
    );
  }
}
