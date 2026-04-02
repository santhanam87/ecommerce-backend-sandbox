import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";
import type { AccessTokenPayload } from "src/auth/types/token-payload.type";
import { GetUser } from "src/common/decorator/user.decorator";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";
import { CreateUserDto } from "./dto/create-user.dto";
import { User } from "./entities/user.entity";
import { UserService } from "./user.service";

@ApiTags("Users")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: "Create user" })
  @ApiCreatedResponse({
    description: "User created successfully",
    type: User,
  })
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @ApiOperation({ summary: "List users" })
  @ApiOkResponse({
    description: "Users retrieved successfully",
    type: User,
    isArray: true,
  })
  @Get()
  findAll(@GetUser() user: AccessTokenPayload) {
    console.log("Authenticated user payload:", user);
    return this.userService.findAll();
  }
}
