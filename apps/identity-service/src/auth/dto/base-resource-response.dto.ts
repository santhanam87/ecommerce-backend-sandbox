import { ApiProperty } from "@nestjs/swagger";

export class BaseResourceResponseDto {
  @ApiProperty({ example: "7c7f52ff-4b90-4b87-8bf9-4c235db630f8" })
  id: string;

  @ApiProperty({ example: "2026-03-27T09:30:00.000Z" })
  createdAt: Date;

  @ApiProperty({ example: "2026-03-27T09:30:00.000Z" })
  updatedAt: Date;
}
