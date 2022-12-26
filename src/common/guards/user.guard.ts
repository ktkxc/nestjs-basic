import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { User } from '../../user/entities/user.entity';

@Injectable()
export class UserGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user: User = request.user;
    console.log('UserGuard....');
    // console.log(user)
    if (!user || !user.id) {
      throw new ForbiddenException('没有权限进行此操作', 'UserGuard');
    }
    return true;
  }
}
