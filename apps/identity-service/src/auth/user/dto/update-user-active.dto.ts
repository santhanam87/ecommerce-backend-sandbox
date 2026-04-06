import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean } from "class-validator";

export class UpdateUserActiveDto {
  @ApiProperty({ example: true })
  @IsBoolean()
  is_active: boolean;
}
