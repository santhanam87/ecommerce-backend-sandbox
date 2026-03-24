import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryRuleConditionDto } from './dto/create-category-rule-condition.dto';
import { UpdateCategoryRuleConditionDto } from './dto/update-category-rule-condition.dto';
import { CategoryRuleCondition } from './entities/category-rule-condition.entity';

@Injectable()
export class CategoryRuleConditionService {
  constructor(
    @Inject('CATEGORY_RULE_CONDITION_REPOSITORY')
    private readonly categoryRuleConditionRepository: typeof CategoryRuleCondition,
  ) {}

  create(
    createCategoryRuleConditionDto: CreateCategoryRuleConditionDto,
  ): Promise<CategoryRuleCondition> {
    return this.categoryRuleConditionRepository.create({
      group_id: createCategoryRuleConditionDto.group_id,
      property_id: createCategoryRuleConditionDto.property_id,
      operator: createCategoryRuleConditionDto.operator,
      value: createCategoryRuleConditionDto.value,
    });
  }

  findAll(): Promise<CategoryRuleCondition[]> {
    return this.categoryRuleConditionRepository.findAll();
  }

  async findOne(id: string): Promise<CategoryRuleCondition> {
    const categoryRuleCondition =
      await this.categoryRuleConditionRepository.findByPk(id);

    if (!categoryRuleCondition) {
      throw new NotFoundException(
        `Category rule condition with id ${id} not found`,
      );
    }

    return categoryRuleCondition;
  }

  async update(
    id: string,
    updateCategoryRuleConditionDto: UpdateCategoryRuleConditionDto,
  ): Promise<CategoryRuleCondition> {
    const categoryRuleCondition = await this.findOne(id);

    await categoryRuleCondition.update(updateCategoryRuleConditionDto);
    return categoryRuleCondition;
  }

  async remove(id: string): Promise<void> {
    const categoryRuleCondition = await this.findOne(id);
    await categoryRuleCondition.destroy();
  }
}
