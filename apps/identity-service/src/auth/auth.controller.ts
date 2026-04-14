import {
  Body,
  Controller,
  Get,
  Headers,
  Post,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { Public } from "src/common/decorator/public.decorator";
import { GetUser } from "src/common/decorator/user.decorator";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { LoginResponseDto } from "./dto/login-response.dto";
import { LogoutResponseDto } from "./dto/logout-response.dto";
import { MeRolePermissionsResponseDto } from "./dto/me-role-permissions-response.dto";
import { RefreshTokenDto } from "./dto/refresh-token.dto";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import type { AccessTokenPayload } from "./types/token-payload.type";

@ApiTags("Auth")
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @ApiOperation({
    summary: "Login active user",
    description:
      "Returns an access token and refresh token. The session uses the user's active role for permission validation.",
  })
  @ApiOkResponse({
    description: "Access and refresh tokens generated successfully",
    type: LoginResponseDto,
  })
  @ApiUnauthorizedResponse({ description: "Invalid credentials" })
  @Post("login")
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Public()
  @ApiOperation({
    summary: "Refresh access token",
    description:
      "Accepts a refresh token and returns a new access token and refresh token pair. Permission validation continues to use the user's current active role.",
  })
  @ApiOkResponse({
    description: "Access and refresh tokens generated successfully",
    type: LoginResponseDto,
  })
  @ApiUnauthorizedResponse({ description: "Invalid refresh token" })
  @Post("refresh")
  refresh(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refresh(refreshTokenDto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: "Get current user active role and permissions",
    description:
      "Uses user_id and tenant_id from the access token to fetch the current user's active role with associated permissions.",
  })
  @ApiOkResponse({
    description: "Active role and permissions retrieved successfully",
    type: MeRolePermissionsResponseDto,
  })
  @ApiUnauthorizedResponse({ description: "Missing or invalid access token" })
  @Get("me/role-permissions")
  getMyRolePermissions(@GetUser() user: AccessTokenPayload) {
    return this.authService.getMyRolePermissions(user);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: "Logout current user",
    description:
      "Clears role-permission cache entry and revokes both the provided refresh token and current access token for the current user.",
  })
  @ApiOkResponse({
    description: "Logout completed successfully",
    type: LogoutResponseDto,
  })
  @ApiUnauthorizedResponse({ description: "Missing or invalid access token" })
  @Post("logout")
  logout(
    @GetUser("id") userId: string,
    @Headers("authorization") authorization: string | undefined,
    @Body() refreshTokenDto: RefreshTokenDto,
  ) {
    return this.authService.logout(userId, authorization, refreshTokenDto);
  }
}
