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
import { CategoryRuleGroupService } from './category-rule-group.service';
import { CreateCategoryRuleGroupDto } from './dto/create-category-rule-group.dto';
import { UpdateCategoryRuleGroupDto } from './dto/update-category-rule-group.dto';
import { CategoryRuleGroup } from './entities/category-rule-group.entity';

@ApiTags('products/category-rule-groups')
@Controller()
export class CategoryRuleGroupController {
  constructor(
    private readonly categoryRuleGroupService: CategoryRuleGroupService,
  ) {}

  @Post()
  @ApiBody({ type: CreateCategoryRuleGroupDto })
  @ApiCreatedResponse({ type: CategoryRuleGroup })
  create(
    @Body() createCategoryRuleGroupDto: CreateCategoryRuleGroupDto,
  ): Promise<CategoryRuleGroup> {
    return this.categoryRuleGroupService.create(createCategoryRuleGroupDto);
  }

  @Get()
  @ApiOkResponse({ type: CategoryRuleGroup, isArray: true })
  findAll(): Promise<CategoryRuleGroup[]> {
    return this.categoryRuleGroupService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ type: CategoryRuleGroup })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<CategoryRuleGroup> {
    return this.categoryRuleGroupService.findOne(id);
  }

  @Patch(':id')
  @ApiBody({ type: UpdateCategoryRuleGroupDto })
  @ApiOkResponse({ type: CategoryRuleGroup })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCategoryRuleGroupDto: UpdateCategoryRuleGroupDto,
  ): Promise<CategoryRuleGroup> {
    return this.categoryRuleGroupService.update(id, updateCategoryRuleGroupDto);
  }

  @Delete(':id')
  @ApiNoContentResponse()
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.categoryRuleGroupService.remove(id);
  }
}
