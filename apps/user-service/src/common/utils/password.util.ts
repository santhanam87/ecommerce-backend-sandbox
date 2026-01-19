import * as bcrypt from 'bcryptjs';

export class PasswordUtil {
  static hashPassword(password: string): string {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
  }
  static comparePasswords(
    plainPassword: string,
    hashedPassword: string,
  ): boolean {
    return bcrypt.compareSync(plainPassword, hashedPassword);
  }
}
