import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { AdminGuard } from '../common/admin.guard';
import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto } from './product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly svc: ProductsService) {}
  @Get() findAll(@Query('variety') variety?: string) { return this.svc.findAll(variety); }
  @Get(':id') findOne(@Param('id') id: string) { return this.svc.findOne(id); }
  @UseGuards(AdminGuard) @Post() create(@Body() dto: CreateProductDto) { return this.svc.create(dto); }
  @UseGuards(AdminGuard) @Patch(':id') update(@Param('id') id: string, @Body() dto: UpdateProductDto) { return this.svc.update(id, dto); }
  @UseGuards(AdminGuard) @Delete(':id') remove(@Param('id') id: string) { return this.svc.remove(id); }
}
