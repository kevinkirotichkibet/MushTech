import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsEnum, IsMongoId, IsNumber, IsString, Min, ValidateNested } from 'class-validator';

class OrderItemDto {
  @IsMongoId() productId: string;
  @IsNumber() @Min(0.1) qtyKg: number;
}
export class CreateOrderDto {
  @IsString() customerName: string;
  @IsString() phone: string;
  @IsString() address: string;
  @IsArray() @ArrayMinSize(1) @ValidateNested({ each: true }) @Type(() => OrderItemDto)
  items: OrderItemDto[];
}
export class UpdateStatusDto {
  @IsEnum(['pending', 'confirmed', 'delivered', 'cancelled']) status: string;
}
