import { User } from '../entity/user.entity';

export class UserResponseDto {
  userName: string | null;
  email: string;
  name: string;
  createdAt: Date;
  constructor({ userName, email, name, createdAt }: User) {
    Object.assign(this, { userName, email, name, createdAt });
  }
}
