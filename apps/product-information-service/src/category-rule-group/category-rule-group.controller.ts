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
import { CategoryRuleGroupService } from './category-rule-group.service';
import { CreateCategoryRuleGroupDto } from './dto/create-category-rule-group.dto';
import { UpdateCategoryRuleGroupDto } from './dto/update-category-rule-group.dto';
import { CategoryRuleGroup } from './entities/category-rule-group.entity';

@ApiTags('products/category-rule-groups')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionGuard)
@Controller()
export class CategoryRuleGroupController {
  constructor(
    private readonly categoryRuleGroupService: CategoryRuleGroupService,
  ) {}

  @Post()
  @CheckPermission({
    key: PERMISSION_KEYS.CATEGORY_RULE_GROUP,
    scope: PERMISSION_SCOPE_BY_KEY[PERMISSION_KEYS.CATEGORY_RULE_GROUP].CREATE,
  })
  @ApiBody({ type: CreateCategoryRuleGroupDto })
  @ApiCreatedResponse({ type: CategoryRuleGroup })
  create(
    @Body() createCategoryRuleGroupDto: CreateCategoryRuleGroupDto,
  ): Promise<CategoryRuleGroup> {
    return this.categoryRuleGroupService.create(createCategoryRuleGroupDto);
  }

  @Get()
  @CheckPermission({
    key: PERMISSION_KEYS.CATEGORY_RULE_GROUP,
    scope: PERMISSION_SCOPE_BY_KEY[PERMISSION_KEYS.CATEGORY_RULE_GROUP].READ,
  })
  @ApiOkResponse({ type: CategoryRuleGroup, isArray: true })
  findAll(): Promise<CategoryRuleGroup[]> {
    return this.categoryRuleGroupService.findAll();
  }

  @Get(':id')
  @CheckPermission({
    key: PERMISSION_KEYS.CATEGORY_RULE_GROUP,
    scope: PERMISSION_SCOPE_BY_KEY[PERMISSION_KEYS.CATEGORY_RULE_GROUP].READ,
  })
  @ApiOkResponse({ type: CategoryRuleGroup })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<CategoryRuleGroup> {
    return this.categoryRuleGroupService.findOne(id);
  }

  @Patch(':id')
  @CheckPermission({
    key: PERMISSION_KEYS.CATEGORY_RULE_GROUP,
    scope: PERMISSION_SCOPE_BY_KEY[PERMISSION_KEYS.CATEGORY_RULE_GROUP].UPDATE,
  })
  @ApiBody({ type: UpdateCategoryRuleGroupDto })
  @ApiOkResponse({ type: CategoryRuleGroup })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCategoryRuleGroupDto: UpdateCategoryRuleGroupDto,
  ): Promise<CategoryRuleGroup> {
    return this.categoryRuleGroupService.update(id, updateCategoryRuleGroupDto);
  }

  @Delete(':id')
  @CheckPermission({
    key: PERMISSION_KEYS.CATEGORY_RULE_GROUP,
    scope: PERMISSION_SCOPE_BY_KEY[PERMISSION_KEYS.CATEGORY_RULE_GROUP].DELETE,
  })
  @ApiNoContentResponse()
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.categoryRuleGroupService.remove(id);
  }
}
