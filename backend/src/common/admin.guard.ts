import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { timingSafeEqual } from 'crypto';

// Protects admin-only routes. Send the secret in the "x-admin-key" header.
// If ADMIN_API_KEY is not set, every guarded route is refused (fails closed).
@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(ctx: ExecutionContext): boolean {
    const expected = process.env.ADMIN_API_KEY;
    const given = ctx.switchToHttp().getRequest().headers['x-admin-key'];
    if (!expected || typeof given !== 'string') throw new UnauthorizedException();
    const a = Buffer.from(given);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) throw new UnauthorizedException();
    return true;
  }
}
