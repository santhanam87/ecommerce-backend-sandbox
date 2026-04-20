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
import { CategoryRuleConditionService } from './category-rule-condition.service';
import { CreateCategoryRuleConditionDto } from './dto/create-category-rule-condition.dto';
import { UpdateCategoryRuleConditionDto } from './dto/update-category-rule-condition.dto';
import { CategoryRuleCondition } from './entities/category-rule-condition.entity';

@ApiTags('products/category-rule-conditions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionGuard)
@Controller()
export class CategoryRuleConditionController {
  constructor(
    private readonly categoryRuleConditionService: CategoryRuleConditionService,
  ) {}

  @Post()
  @CheckPermission({
    key: PERMISSION_KEYS.CATEGORY_RULE_CONDITION,
    scope: PERMISSION_SCOPE_BY_KEY[PERMISSION_KEYS.CATEGORY_RULE_CONDITION].CREATE,
  })
  @ApiBody({ type: CreateCategoryRuleConditionDto })
  @ApiCreatedResponse({ type: CategoryRuleCondition })
  create(
    @Body() createCategoryRuleConditionDto: CreateCategoryRuleConditionDto,
  ): Promise<CategoryRuleCondition> {
    return this.categoryRuleConditionService.create(
      createCategoryRuleConditionDto,
    );
  }

  @Get()
  @CheckPermission({
    key: PERMISSION_KEYS.CATEGORY_RULE_CONDITION,
    scope: PERMISSION_SCOPE_BY_KEY[PERMISSION_KEYS.CATEGORY_RULE_CONDITION].READ,
  })
  @ApiOkResponse({ type: CategoryRuleCondition, isArray: true })
  findAll(): Promise<CategoryRuleCondition[]> {
    return this.categoryRuleConditionService.findAll();
  }

  @Get(':id')
  @CheckPermission({
    key: PERMISSION_KEYS.CATEGORY_RULE_CONDITION,
    scope: PERMISSION_SCOPE_BY_KEY[PERMISSION_KEYS.CATEGORY_RULE_CONDITION].READ,
  })
  @ApiOkResponse({ type: CategoryRuleCondition })
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<CategoryRuleCondition> {
    return this.categoryRuleConditionService.findOne(id);
  }

  @Patch(':id')
  @CheckPermission({
    key: PERMISSION_KEYS.CATEGORY_RULE_CONDITION,
    scope: PERMISSION_SCOPE_BY_KEY[PERMISSION_KEYS.CATEGORY_RULE_CONDITION].UPDATE,
  })
  @ApiBody({ type: UpdateCategoryRuleConditionDto })
  @ApiOkResponse({ type: CategoryRuleCondition })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCategoryRuleConditionDto: UpdateCategoryRuleConditionDto,
  ): Promise<CategoryRuleCondition> {
    return this.categoryRuleConditionService.update(
      id,
      updateCategoryRuleConditionDto,
    );
  }

  @Delete(':id')
  @CheckPermission({
    key: PERMISSION_KEYS.CATEGORY_RULE_CONDITION,
    scope: PERMISSION_SCOPE_BY_KEY[PERMISSION_KEYS.CATEGORY_RULE_CONDITION].DELETE,
  })
  @ApiNoContentResponse()
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.categoryRuleConditionService.remove(id);
  }
}
