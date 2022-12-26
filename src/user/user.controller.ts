import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

import { Roles } from '../common/decorators/roles.decorator';
import { AuthService } from '../common/auth/auth.service';
import { RolesGuard } from '../common/guards/roles.guard';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

@ApiBearerAuth()
@ApiTags('用户管理')
@Controller('user')
export class UserController {
  constructor(
    @Inject(AuthService) private readonly authService: AuthService,
    @Inject(UserService) private readonly userService: UserService,
  ) {}

  /**
     * 用户登录成功后，返回的 data 是授权令牌；
     * 在调用有 @UseGuards(AuthGuard()) 装饰的路由时，会检查当前请求头中是否包含 Authorization: Bearer xxx 授权令牌，
     * 其中 Authorization 是用于告诉服务端本次请求有令牌，并且令牌前缀是 Bearer，而令牌的具体内容是登录之后返回的 data(accessToken)。
     curl http://localhost:3000/profile -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2Vybm..."
    */
  @Post('login')
  async login(@Body() body: { username: string; pwd: string }) {
    console.log('login...');
    console.log(body);
    await this.userService.login(body.username, body.pwd);
    const accessToken = await this.authService.createToken({
      username: body.username,
    });
    // console.log(accessToken);
    return accessToken;
  }

  @Post('register')
  async register(@Body() user: User) {
    await this.userService.register(user);
    return '注册成功';
  }

  @Delete(':id')
  @Roles('-1')
  @UseGuards(AuthGuard(), RolesGuard)
  async remove(@Param() id: number) {
    await this.userService.remove(id);
    return '删除用户成功';
  }

  @Put(':id')
  @Roles('-1')
  @UseGuards(AuthGuard(), RolesGuard)
  async update(@Param('id') id: number, @Body() body: User) {
    console.log('update:' + id);
    console.log(body);
    await this.userService.update(id, body);
    return '更新用户成功';
  }

  @Get(':id')
  async findOne(@Param('id') id, @Request() req) {
    await this.userService.login('admin', '111111');
    const accessToken = await this.authService.createToken({
      username: 'admin',
    });
    console.log(accessToken);
    return { data: accessToken };

    const data = await this.userService.findOneById(id);
    return data;
  }

  @Get()
  @Roles('-1')
  @UseGuards(AuthGuard(), RolesGuard)
  async findAll() {
    console.log('findAll...');
    const data = await this.userService.findAll();
    console.log(data);
    return data;
  }
}
