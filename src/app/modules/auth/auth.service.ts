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
    const payload = { email: user.email };

    const getUser = await this.userService.getUserAfterLogin(user.email);
    return {
      accessToken: this.jwtService.sign(payload),
      user: getUser,
    };
  }
}
