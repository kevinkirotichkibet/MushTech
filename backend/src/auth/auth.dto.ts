import { Transform } from 'class-transformer';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

const normEmail = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim().toLowerCase() : value;

export class RegisterDto {
  @IsString() @MinLength(2) @MaxLength(80) name: string;
  @Transform(normEmail) @IsEmail() @MaxLength(254) email: string;
  // bcrypt only uses the first 72 bytes, so cap the length
  @IsString() @MinLength(8) @MaxLength(72) password: string;
}

export class LoginDto {
  @Transform(normEmail) @IsEmail() email: string;
  @IsString() @MaxLength(72) password: string;
}
