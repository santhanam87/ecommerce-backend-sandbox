import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class RefreshTokenDto {
  @ApiProperty({
    example:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI4ZDc5YzZmZS1mNWI2LTRhNWQtYjdkMC1mN2JlNGM3NGYxZTkiLCJ0eXBlIjoicmVmcmVzaCIsImlhdCI6MTcxMTUyNjQwMCwiZXhwIjoxNzEyMTMxMjAwfQ.signature",
  })
  @IsString()
  @IsNotEmpty()
  refresh_token: string;
}
