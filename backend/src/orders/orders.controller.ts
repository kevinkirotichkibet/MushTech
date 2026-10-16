import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto, UpdateStatusDto } from './order.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly svc: OrdersService) {}
  @Post() create(@Body() dto: CreateOrderDto) { return this.svc.create(dto); }
  @Get() findAll() { return this.svc.findAll(); }
  @Patch(':id/status') setStatus(@Param('id') id: string, @Body() dto: UpdateStatusDto) {
    return this.svc.setStatus(id, dto.status);
  }
}
