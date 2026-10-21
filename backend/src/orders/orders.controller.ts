import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto, UpdateStatusDto } from './order.dto';
import { AdminGuard, JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('orders')
export class OrdersController {
  constructor(private readonly svc: OrdersService) {}

  // any logged-in customer can place an order and see their own
  @UseGuards(JwtAuthGuard) @Post()
  create(@Body() dto: CreateOrderDto, @Req() req: any) { return this.svc.create(dto, req.user.sub); }

  @UseGuards(JwtAuthGuard) @Get('mine')
  mine(@Req() req: any) { return this.svc.mine(req.user.sub); }

  // admin only
  @UseGuards(AdminGuard) @Get()
  findAll() { return this.svc.findAll(); }

  @UseGuards(AdminGuard) @Patch(':id/status')
  setStatus(@Param('id') id: string, @Body() dto: UpdateStatusDto) { return this.svc.setStatus(id, dto.status); }
}
