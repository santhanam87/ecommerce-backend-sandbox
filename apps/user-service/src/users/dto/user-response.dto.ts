import { User } from '../../../generated/prisma/client';

export class UserResponseDto {
  email: string;
  name: string;
  createdAt: Date;
  constructor({ email, name, createdAt }: User) {
    Object.assign(this, { email, name, createdAt });
  }
}
