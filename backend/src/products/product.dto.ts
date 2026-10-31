import { Transform } from 'class-transformer';
import { IsBoolean, IsNumber, IsOptional, IsString, MaxLength, MinLength, Min } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateProductDto {
  @IsString() name: string;
  @Transform(({ value }) => (typeof value === 'string' ? value.trim().toLowerCase() : value))
  @IsString() @MinLength(2) @MaxLength(40) variety: string;
  @IsOptional() @IsString() description?: string;
  @IsNumber() @Min(0) pricePerKg: number;
  @IsNumber() @Min(0) stockKg: number;
  @IsOptional() @IsString() @MaxLength(300) imageUrl?: string;
  @IsOptional() @IsBoolean() active?: boolean;
  @IsOptional() @IsBoolean() comingSoon?: boolean;
}
export class UpdateProductDto extends PartialType(CreateProductDto) {}
