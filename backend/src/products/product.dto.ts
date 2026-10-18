import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateProductDto {
  @IsString() name: string;
  @IsEnum(['pink', 'blue', 'grey', 'golden', 'king']) variety: string;
  @IsOptional() @IsString() description?: string;
  @IsNumber() @Min(0) pricePerKg: number;
  @IsNumber() @Min(0) stockKg: number;
  @IsOptional() @IsString() imageUrl?: string;
  @IsOptional() @IsBoolean() active?: boolean;
}
export class UpdateProductDto extends PartialType(CreateProductDto) {}
