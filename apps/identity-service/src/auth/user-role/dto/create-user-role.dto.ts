import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsUUID } from "class-validator";

export class CreateUserRoleDto {
  @ApiProperty({ example: "8d79c6fe-f5b6-4a5d-b7d0-f7be4c74f1e9" })
  @IsUUID()
  @IsNotEmpty()
  user_id: string;

  @ApiProperty({ example: "f90c5d7b-c1d2-4568-a4dd-7be4474847da" })
  @IsUUID()
  @IsNotEmpty()
  role_id: string;
}
