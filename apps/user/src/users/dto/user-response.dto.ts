import { User } from '@prisma/client';

export class UserResponseDto {
  userName: string;
  email: string;
  name: string;
  createdAt: Date;
  constructor({ userName, email, name, createdAt }: User) {
    Object.assign(this, { userName, email, name, createdAt });
  }
}
