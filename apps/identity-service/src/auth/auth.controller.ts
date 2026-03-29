import { Body, Controller, Post } from "@nestjs/common";
import {
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { Public } from "src/common/decorator/public.decorator";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { LoginResponseDto } from "./dto/login-response.dto";
import { RefreshTokenDto } from "./dto/refresh-token.dto";

@ApiTags("Auth")
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @ApiOperation({
    summary: "Login active user",
    description:
      "Returns an access token and refresh token. The access token payload contains the active user context, assigned roles, and each role's permissions.",
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
      "Accepts a refresh token and returns a new access token and refresh token pair. The new access token payload includes the user's current roles and permissions.",
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
}
