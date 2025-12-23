import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { JwtAuthGuard } from 'src/auth/jwt.auth-guard';

@UseGuards(JwtAuthGuard)
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  async createCategory(@Body() { name }: { name: string }) {
    return this.categoryService.createCategory(name);
  }

  @Get()
  async getCategories() {
    return this.categoryService.getCategories();
  }

  @Get(':name')
  async getCategoryByName(@Param('name') name: string) {
    return this.categoryService.getCategoryByName(name);
  }

  @Delete(':name')
  async deleteCategory(@Param('name') name: string) {
    return this.categoryService.deleteCategory(name);
  }
}
