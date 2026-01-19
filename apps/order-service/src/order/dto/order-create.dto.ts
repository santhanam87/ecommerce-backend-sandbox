import { IsArray } from 'class-validator';
import { CreateOrderProductDto } from './order-product-create.dto';
import { ShippingAddressDto } from './shipping-address.dto';

export class CreateOrderDto {
  @IsArray()
  items: CreateOrderProductDto[];
  shippingAddress: ShippingAddressDto;
  paymentId: string;
}
