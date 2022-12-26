<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).

**************************
下面是从零开始学习积累的过程，该代码是使用nestjs开发的基础代码，可在此基础上开始项目，下面所需要的依赖包已经在package.json里了

一。新环境需要初始化安装Nest CLI

  使用 Nest CLI 创建新项目

  $ npm i -g @nestjs/cli

  $ nest new project-name

  或者，使用 Git 安装采用 TypeScript 开发的 starter 项目：

  $ git clone https://github.com/nestjs/typescript-starter.git project

  cd project

  cnpm install

  通过 npm （或 yarn）来安装的核心和支撑文

  cnpm i --save @nestjs/core @nestjs/common rxjs reflect-metadata

  cnpm install --save @nestjs/swagger swagger-ui-express

  其他

    cnpm i --save @nestjs/config  nest-winston winston winston-daily-rotate-file 

二.运行

  npm run start

  或npm run start:dev 监视改变下运行

  发布 npm run build

  发布后运行 node dist/main.js

  pm2方式启动生产环境

  pm2 start --name 名称 dist/main.js

    pm2 l 
    pm2 save
    pm2 start app.js -i 4 

      # 后台运行pm2，启动4个app.js 
      # 也可以把'max' 参数传递给 start
      # 正确的进程数目依赖于Cpu的核心数目

    pm2 stop 名称
    pm2 delete 名称
    pm2 reload 名称
    pm2 restart 名称
    pm2 monit              # 监视所有进程

三.配置

  cnpm i --save @nestjs/config

  根目录下加文件.env,.env.dev,.env.prod 
    其他地方使用 如 process.env.HOST

四。日志

  在对应模块的Service里

    import { MyLogger } from '../common/utils/mylogger';

  Service {内部加

    constructor(
          @Inject(MyLogger) private readonly mylogger: MyLogger
      ) { }

  写日志

    方法参数abc = async (id: number,req:Request) => {

    this.mylogger.info("内容",req);

五。nest-cli.json有修改,

  "compilerOptions": {
      "plugins": [{
        "name": "@nestjs/swagger",
        "options": {
            "classValidatorShim": false,
            "introspectComments": true
        }
    }]
  }

六.数据库

  cnpm install --save @nestjs/typeorm typeorm pg 

  cnpm install class-transformer moment
  -- cnpm install typeorm@0.2
   

七。守卫

  cnpm install --save @nestjs/passport passport passport-local

  cnpm install --save @nestjs/jwt passport-jwt

七，定时任务

   cnpm install --save  @nestjs/schedule

   app.module.ts

    import { ScheduleModule } from '@nestjs/schedule';

    import { TasksModule } from './common/tasks/tasks.module';

    imports:[
      ScheduleModule.forRoot(), TasksModule,
    ]

  队列

    cnpm install --save  @nestjs/bull bull 

    cnpm install --save-dev @types/bull

    任务可以包括附加选项。在Quene.add()方法的job参数之后传递选项对象。任务选项属性有： 
      priority: number-选项优先级值。范围从 1（最高优先）到 MAX_INT（最低优先）。注意使用属性对性能有轻微影响，因此要小心使用。
      delay: number- 任务执行前等待的时间（毫秒）。注意，为了精确延时，服务端和客户端时钟应该同步。
      attempts: number-任务结束前总的尝试次数。
      repeat: RepeatOpts-按照定时设置重复任务记录，查看RepeatOpts。
      backoff: number | BackoffOpts- 如果任务失败，自动重试闪避设置，查看BackoffOpts。
      lifo: boolean-如果为true，从队列右端添加任务以替代从左边添加（默认为 false)。
      timeout: number-任务超时失败的毫秒数。
      jobId: number | string- 覆盖任务 ID-默认地，任务 ID 是唯一的整数，但你可以使用该参数覆盖它。如果你使用这个选项，你需要保证jobId是唯一的。如果你尝试添加一个包含已有 id 的任务，它不会被添加。
      removeOnComplete: boolean | number-如果为true，当任务完成时移除任务。一个数字用来指定要保存的任务数。默认行为是将完成的工作保存在已完成的设置中。
      removeOnFail: boolean | number-如果为true，当所有尝试失败时移除任务。一个数字用来指定要保存的任务数。默认行为是将失败的任务保存在已失败的设置中。
      stackTraceLimit: number-限制在stacktrace中保存的堆栈跟踪线。

九。缓存

  cnpm install --save cache-manager

  cnpm install -D @types/cache-manager

  cnpm install --save cache-manager-redis-store

  相关模块引入

    import { RedisCacheModule } from '../common/redis/redis-cache.module';
    imports: [
      RedisCacheModule
    ],

    controller或service

    import { RedisCacheService } from '../common/redis/redis-cache.service';
    constructor(
        private readonly redisCacheService: RedisCacheService,
    ) {}

    调用方法 10000是10s

      await this.redisCacheService.cacheSet('id',id,10000);
      var data= await this.redisCacheService.cacheGet('id');

十。redis

  redis-cli -v

  redis-server 启动

十一。创建命令

  nest g module modules/[name] --no-spec

  nest g service modules/[name] --no-spec

  nest g controller modules/[name] --no-spec

十二。文件 

    cnpm i -D @types/multer

    cnpm install --save class-validator mime jimp 
    
     cnpm install --save multer 

    cnpm install --save  @nestjs/serve-static
  
