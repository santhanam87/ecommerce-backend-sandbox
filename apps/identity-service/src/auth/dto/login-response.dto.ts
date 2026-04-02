import { ApiProperty } from "@nestjs/swagger";

export class LoginResponseDto {
  @ApiProperty({
    description:
      "JWT access token. Its payload includes id, email, tenant_id, is_active, and roles with nested permissions.",
    example:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjhkNzljNmZlLWY1YjYtNGE1ZC1iN2QwLWY3YmU0Yzc0ZjFlOSIsImVtYWlsIjoidXNlckBleGFtcGxlLmNvbSIsInRlbmFudF9pZCI6IjdjN2Y1MmZmLTRiOTAtNGI4Ny04YmY5LTRjMjM1ZGI2MzBmOCIsImlzX2FjdGl2ZSI6dHJ1ZSwicm9sZXMiOlt7ImlkIjoiZjkwYzVkN2ItYzFkMi00NTY4LWE0ZGQtN2JlNDQ3NDg0N2RhIiwibmFtZSI6ImFkbWluIiwicGVybWlzc2lvbnMiOlt7ImtleSI6InByb2R1Y3QuY3JlYXRlIiwidmFsdWUiOnsiYWxsb3ciOnRydWUsInNjb3BlcyI6WyJhbGwiXX19XX1dLCJpYXQiOjE3MTE1MjY0MDAsImV4cCI6MTcxMTYxMjgwMH0.signature",
  })
  access_token: string;

  @ApiProperty({
    description:
      "JWT refresh token. Its payload contains the user id in sub and the token type refresh.",
    example:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI4ZDc5YzZmZS1mNWI2LTRhNWQtYjdkMC1mN2JlNGM3NGYxZTkiLCJ0eXBlIjoicmVmcmVzaCIsImlhdCI6MTcxMTUyNjQwMCwiZXhwIjoxNzEyMTMxMjAwfQ.signature",
  })
  refresh_token: string;
}
