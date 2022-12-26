import {
  HttpException,
  Inject,
  Injectable,
  OnModuleInit,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CryptoUtil } from '../common/utils/crypto.util';
import { User } from './entities/user.entity';
import { randomUUID } from 'crypto';

@Injectable()
export class UserService implements OnModuleInit {
  async onModuleInit() {
    if (await this.findOneByAccount('admin')) return;
    // 初始化系统管理员
    const admin = new User();
    admin.username = 'admin';
    admin.userkey = randomUUID();
    admin.pwd = this.cryptoUtil.encryptPassword('111111');
    admin.truename = '系统管理员';
    admin.roletype = -1;
    admin.mids = '-1';
    admin.rbuttons = '-1';
    admin.sids = '-1';
    await this.userRepo.save(admin);
  }

  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @Inject(CryptoUtil) private readonly cryptoUtil: CryptoUtil,
  ) {}

  /**
   * 用户登录
   *
   * @param username 登录账号
   * @param password 登录密码
   */
  async login(username: string, pwd: string): Promise<void> {
    const user = await this.findOneByAccount(username);
    if (!user) throw new HttpException('登录账号有误', 406);
    if (!this.cryptoUtil.checkPassword(pwd, user.pwd))
      throw new HttpException('登录密码有误', 406);
  }

  /**
   * 用户注册
   *
   * @param user 用户信息
   */
  async register(user: User): Promise<void> {
    const existing = await this.findOneByAccount(user.username);
    if (existing) throw new HttpException('账号已存在', 409);
    user.pwd = this.cryptoUtil.encryptPassword(user.pwd);
    await this.userRepo.save(this.userRepo.create(user));
  }

  /**
   * 删除用户
   *
   * @param id 用户ID
   */
  async remove(id: number): Promise<void> {
    const existing = await this.userRepo.findOneBy({ id: id });
    if (!existing)
      throw new HttpException(`删除失败，ID 为 '${id}' 的用户不存在`, 404);
    await this.userRepo.remove(existing);
  }

  /**
   * 更新用户
   *
   * @param id 用户ID
   * @param updateInput updateInput
   */
  async update(id: number, updateInput: User) {
    const existing = await this.userRepo.findOneBy({ id: id });
    if (!existing)
      throw new HttpException(`更新失败，ID 为 '${id}' 的用户不存在`, 404);
    if (updateInput.username) existing.username = updateInput.username;
    if (updateInput.pwd)
      existing.pwd = this.cryptoUtil.encryptPassword(updateInput.pwd);
    if (updateInput.truename) existing.truename = updateInput.truename;
    await this.userRepo.save(existing);
  }

  /**
   * 通过登录账号查询用户
   *
   * @param username 登录账号
   */
  async findOneByAccount(username: string): Promise<User> {
    // var d=await this.userRepo.findOneBy({ username:username });
    console.log('findOneByAccount...' + username);
    // console.log(d);
    // return d;
    return await this.userRepo.findOneBy({ username: username });
  }

  /**
   * 查询用户及其帖子的信息
   *
   * @param id 用户ID
   */
  async findOneById(id: number): Promise<User> {
    const data = await this.userRepo.findOneBy({ id: id });
    return data;
  }

  /**
   * 查询所有用户
   */
  async findAll(): Promise<User[]> {
    return await this.userRepo.find();
  }
}
