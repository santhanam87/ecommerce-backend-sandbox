import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CategoryRuleConditionService } from './category-rule-condition.service';
import { CreateCategoryRuleConditionDto } from './dto/create-category-rule-condition.dto';
import { UpdateCategoryRuleConditionDto } from './dto/update-category-rule-condition.dto';
import { CategoryRuleCondition } from './entities/category-rule-condition.entity';

@ApiTags('products/category-rule-conditions')
@Controller()
export class CategoryRuleConditionController {
  constructor(
    private readonly categoryRuleConditionService: CategoryRuleConditionService,
  ) {}

  @Post()
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
  @ApiOkResponse({ type: CategoryRuleCondition, isArray: true })
  findAll(): Promise<CategoryRuleCondition[]> {
    return this.categoryRuleConditionService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ type: CategoryRuleCondition })
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<CategoryRuleCondition> {
    return this.categoryRuleConditionService.findOne(id);
  }

  @Patch(':id')
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
  @ApiNoContentResponse()
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.categoryRuleConditionService.remove(id);
  }
}
