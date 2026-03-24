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
import { CategoryRuleGroupService } from './category-rule-group.service';
import { CreateCategoryRuleGroupDto } from './dto/create-category-rule-group.dto';
import { UpdateCategoryRuleGroupDto } from './dto/update-category-rule-group.dto';
import { CategoryRuleGroup } from './entities/category-rule-group.entity';

@Controller('category-rule-groups')
export class CategoryRuleGroupController {
  constructor(
    private readonly categoryRuleGroupService: CategoryRuleGroupService,
  ) {}

  @Post()
  create(
    @Body() createCategoryRuleGroupDto: CreateCategoryRuleGroupDto,
  ): Promise<CategoryRuleGroup> {
    return this.categoryRuleGroupService.create(createCategoryRuleGroupDto);
  }

  @Get()
  findAll(): Promise<CategoryRuleGroup[]> {
    return this.categoryRuleGroupService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<CategoryRuleGroup> {
    return this.categoryRuleGroupService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCategoryRuleGroupDto: UpdateCategoryRuleGroupDto,
  ): Promise<CategoryRuleGroup> {
    return this.categoryRuleGroupService.update(id, updateCategoryRuleGroupDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.categoryRuleGroupService.remove(id);
  }
}
