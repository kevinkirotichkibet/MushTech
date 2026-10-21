import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User, UserDocument } from '../users/user.schema';
import { LoginDto, RegisterDto } from './auth.dto';

// used so a wrong email takes as long as a wrong password
const DUMMY_HASH = bcrypt.hashSync('not-a-real-password', 10);

@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private users: Model<UserDocument>, private jwt: JwtService) {}

  private publicUser(u: UserDocument) {
    return { id: u.id, name: u.name, email: u.email, role: u.role };
  }
  private issue(u: UserDocument) {
    const accessToken = this.jwt.sign({ sub: u.id, email: u.email, role: u.role });
    return { accessToken, user: this.publicUser(u) };
  }

  async register(dto: RegisterDto) {
    const passwordHash = await bcrypt.hash(dto.password, 10);
    try {
      // role is always "customer" here; admins are created with the seed script
      const u = await this.users.create({ name: dto.name.trim(), email: dto.email, passwordHash, role: 'customer' });
      return this.issue(u);
    } catch (e: any) {
      if (e?.code === 11000) throw new ConflictException('That email is already registered');
      throw e;
    }
  }

  async login(dto: LoginDto) {
    const u = await this.users.findOne({ email: dto.email }).select('+passwordHash');
    const ok = await bcrypt.compare(dto.password, u?.passwordHash ?? DUMMY_HASH);
    if (!u || !ok) throw new UnauthorizedException('Invalid email or password');
    return this.issue(u);
  }

  async me(id: string) {
    const u = await this.users.findById(id);
    if (!u) throw new UnauthorizedException();
    return this.publicUser(u);
  }
}
