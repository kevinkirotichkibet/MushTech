import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AdminGuard } from '../common/admin.guard';
import { OrdersService } from './orders.service';
import { CreateOrderDto, UpdateStatusDto } from './order.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly svc: OrdersService) {}
  @Post() create(@Body() dto: CreateOrderDto) { return this.svc.create(dto); }
  @UseGuards(AdminGuard) @Get() findAll() { return this.svc.findAll(); }
  @UseGuards(AdminGuard) @Patch(':id/status') setStatus(@Param('id') id: string, @Body() dto: UpdateStatusDto) {
    return this.svc.setStatus(id, dto.status);
  }
}
