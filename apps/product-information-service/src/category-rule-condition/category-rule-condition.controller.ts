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
import { CategoryRuleConditionService } from './category-rule-condition.service';
import { CreateCategoryRuleConditionDto } from './dto/create-category-rule-condition.dto';
import { UpdateCategoryRuleConditionDto } from './dto/update-category-rule-condition.dto';
import { CategoryRuleCondition } from './entities/category-rule-condition.entity';

@Controller('category-rule-conditions')
export class CategoryRuleConditionController {
  constructor(
    private readonly categoryRuleConditionService: CategoryRuleConditionService,
  ) {}

  @Post()
  create(
    @Body() createCategoryRuleConditionDto: CreateCategoryRuleConditionDto,
  ): Promise<CategoryRuleCondition> {
    return this.categoryRuleConditionService.create(
      createCategoryRuleConditionDto,
    );
  }

  @Get()
  findAll(): Promise<CategoryRuleCondition[]> {
    return this.categoryRuleConditionService.findAll();
  }

  @Get(':id')
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<CategoryRuleCondition> {
    return this.categoryRuleConditionService.findOne(id);
  }

  @Patch(':id')
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
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.categoryRuleConditionService.remove(id);
  }
}
