import { Controller, Get, UseGuards } from '@nestjs/common';
import { AdminGuard } from '../auth/jwt-auth.guard';
import { AdminService } from './admin.service';

@UseGuards(AdminGuard)
@Controller('admin')
export class AdminController {
  constructor(private readonly svc: AdminService) {}
  @Get('stats') stats() { return this.svc.stats(); }
  @Get('customers') customers() { return this.svc.customers(); }
}
