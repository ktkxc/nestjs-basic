import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { User } from '../../user/entities/user.entity';
import { UserService } from '../../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(UserService) private readonly userService: UserService,
    @Inject(JwtService) private readonly jwtService: JwtService,
  ) {}

  async createToken(payload: { username: string }): Promise<string> {
    return this.jwtService.sign(payload);
  }

  async validateUser(payload: { username: string }): Promise<User> {
    console.log('validateUser...');
    return await this.userService.findOneByAccount(payload.username);
  }
}
