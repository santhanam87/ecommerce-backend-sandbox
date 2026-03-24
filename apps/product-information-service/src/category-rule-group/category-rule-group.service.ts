import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryRuleGroupDto } from './dto/create-category-rule-group.dto';
import { UpdateCategoryRuleGroupDto } from './dto/update-category-rule-group.dto';
import { CategoryRuleGroup } from './entities/category-rule-group.entity';

@Injectable()
export class CategoryRuleGroupService {
  constructor(
    @Inject('CATEGORY_RULE_GROUP_REPOSITORY')
    private readonly categoryRuleGroupRepository: typeof CategoryRuleGroup,
  ) {}

  create(
    createCategoryRuleGroupDto: CreateCategoryRuleGroupDto,
  ): Promise<CategoryRuleGroup> {
    return this.categoryRuleGroupRepository.create({
      category_id: createCategoryRuleGroupDto.category_id,
      parent_group_id: createCategoryRuleGroupDto.parent_group_id ?? null,
      operator: createCategoryRuleGroupDto.operator,
    });
  }

  findAll(): Promise<CategoryRuleGroup[]> {
    return this.categoryRuleGroupRepository.findAll();
  }

  async findOne(id: string): Promise<CategoryRuleGroup> {
    const categoryRuleGroup =
      await this.categoryRuleGroupRepository.findByPk(id);

    if (!categoryRuleGroup) {
      throw new NotFoundException(
        `Category rule group with id ${id} not found`,
      );
    }

    return categoryRuleGroup;
  }

  async update(
    id: string,
    updateCategoryRuleGroupDto: UpdateCategoryRuleGroupDto,
  ): Promise<CategoryRuleGroup> {
    const categoryRuleGroup = await this.findOne(id);

    await categoryRuleGroup.update(updateCategoryRuleGroupDto);
    return categoryRuleGroup;
  }

  async remove(id: string): Promise<void> {
    const categoryRuleGroup = await this.findOne(id);
    await categoryRuleGroup.destroy();
  }
}
