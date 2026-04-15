import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CheckPermission } from '../common/decorator/check-permission.decorator';
import {
  PERMISSION_KEYS,
  PERMISSION_SCOPE_BY_KEY,
} from '../common/constants/permission.constants';
import { JwtAuthGuard } from '../auth/jwt.auth-guard';
import { PermissionGuard } from '../auth/permission.guard';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';

@ApiTags('products/categories')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionGuard)
@Controller()
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @CheckPermission({
    key: PERMISSION_KEYS.CATEGORY,
    scope: PERMISSION_SCOPE_BY_KEY[PERMISSION_KEYS.CATEGORY].CREATE,
  })
  @ApiBody({ type: CreateCategoryDto })
  @ApiCreatedResponse({ type: Category })
  create(@Body() createCategoryDto: CreateCategoryDto): Promise<Category> {
    return this.categoryService.create(createCategoryDto);
  }

  @Get()
  @CheckPermission({
    key: PERMISSION_KEYS.CATEGORY,
    scope: PERMISSION_SCOPE_BY_KEY[PERMISSION_KEYS.CATEGORY].READ,
  })
  @ApiOkResponse({ type: Category, isArray: true })
  findAll(): Promise<Category[]> {
    return this.categoryService.findAll();
  }

  @Get(':id')
  @CheckPermission({
    key: PERMISSION_KEYS.CATEGORY,
    scope: PERMISSION_SCOPE_BY_KEY[PERMISSION_KEYS.CATEGORY].READ,
  })
  @ApiOkResponse({ type: Category })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Category> {
    return this.categoryService.findOne(id);
  }

  @Patch(':id')
  @CheckPermission({
    key: PERMISSION_KEYS.CATEGORY,
    scope: PERMISSION_SCOPE_BY_KEY[PERMISSION_KEYS.CATEGORY].UPDATE,
  })
  @ApiBody({ type: UpdateCategoryDto })
  @ApiOkResponse({ type: Category })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    return this.categoryService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @CheckPermission({
    key: PERMISSION_KEYS.CATEGORY,
    scope: PERMISSION_SCOPE_BY_KEY[PERMISSION_KEYS.CATEGORY].DELETE,
  })
  @ApiNoContentResponse()
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.categoryService.remove(id);
  }
}
