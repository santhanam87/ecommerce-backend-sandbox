import { User } from '../entity/user.entity';

export class UserResponseDto {
  userName: string | null;
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  constructor({ userName, email, name, createdAt, id }: User) {
    Object.assign(this, { userName, email, name, createdAt, id });
  }
}
