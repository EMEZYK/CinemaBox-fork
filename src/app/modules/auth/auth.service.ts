import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UserService } from '../user/User.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<boolean> {
    const user = await this.userService.getUserByEmail(email);

    return user && user.password === password;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id };

    const getUser = await this.userService.getUserByEmail(user.email);
    return {
      accessToken: this.jwtService.sign(payload),
      user: getUser,
    };
  }
}
