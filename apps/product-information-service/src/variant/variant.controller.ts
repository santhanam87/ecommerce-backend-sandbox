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
import { CreateVariantDto } from './dto/create-variant.dto';
import { UpdateVariantDto } from './dto/update-variant.dto';
import { Variant } from './entities/variant.entity';
import { VariantService } from './variant.service';

@Controller('variants')
export class VariantController {
  constructor(private readonly variantService: VariantService) {}

  @Post()
  create(@Body() createVariantDto: CreateVariantDto): Promise<Variant> {
    return this.variantService.create(createVariantDto);
  }

  @Get()
  findAll(): Promise<Variant[]> {
    return this.variantService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Variant> {
    return this.variantService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateVariantDto: UpdateVariantDto,
  ): Promise<Variant> {
    return this.variantService.update(id, updateVariantDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.variantService.remove(id);
  }
}
