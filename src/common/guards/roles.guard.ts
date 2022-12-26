import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { User } from '../../user/entities/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(@Inject(Reflector) private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    console.log('canActivate....');
    // 通过反射获取请求路由是否添加了 @Roles() 装饰器，如果没有添加，则代表不需要进行认证
    const roles = this.reflector.get<string>('roles', context.getHandler());
    // console.log("roles....")
    // console.log(roles);
    if (!roles) {
      return true;
    }

    // 在请求对象中获取 user 对象，此 user 对象是 AuthStrategy 中 validate 方法成功执行后的返回值
    const request = context.switchToHttp().getRequest();
    const user: User = request.user;
    // console.log(user);
    // 判断当前请求用户的角色是否为管理员
    const hasRole = () => user.roletype === -1;
    // var a=user && hasRole();
    // console.log(a)
    return user && hasRole();
  }
  handleRequest(err, user, info) {
    // 可以抛出一个基于info或者err参数的异常
    console.log('handleRequest...');
    console.log(err);
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
