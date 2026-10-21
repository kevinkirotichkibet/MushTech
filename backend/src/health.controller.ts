import { Controller, Get } from '@nestjs/common';
import { VERSION } from './version';

@Controller('health')
export class HealthController {
  // the version lets you confirm which build is running on the host
  @Get() check() { return { ok: true, version: VERSION }; }
}
