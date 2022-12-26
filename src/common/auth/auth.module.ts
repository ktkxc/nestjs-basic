import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { secretKEY } from '../common.constant';
import { UserModule } from '../../user/user.module';
import { AuthService } from './auth.service';
import { AuthStrategy } from './auth.strategy';

@Module({
  imports: [
    JwtModule.register({
      // 24h 60s, "2 days", "10h", "7d". A numeric value is
      secret: secretKEY,
      signOptions: { expiresIn: '1h' },
    }),
    forwardRef(() => UserModule), // 处理模块间的循环依赖
  ],
  providers: [AuthService, AuthStrategy],
  exports: [AuthService], // 导出 AuthServie 供 UserModule 使用
})
export class AuthModule {}
