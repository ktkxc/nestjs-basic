import { Module, Dependencies } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { APP_INTERCEPTOR, APP_FILTER } from '@nestjs/core';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import DailyRotateFile = require('winston-daily-rotate-file');
const format = winston.format;
import { CommInterceptor } from './common/comm.interceptor';
import { ConfigModule } from '@nestjs/config';
import { CommonModule } from './common/common.module';
const envFilePath = ['.env'];
export const IS_DEV = process.env.RUNNING_ENV !== 'prod';
if (IS_DEV) {
  envFilePath.unshift('.env.dev');
} else {
  envFilePath.unshift('.env.prod');
}
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { AllExceptionsFilter } from './common/any-exception.filter';
import { FileModule } from './file/file.module';
import { ResourceHandlerModule } from './common/resource-handler/resource-handler.module';
// import { ScheduleModule } from '@nestjs/schedule';
// import { TasksModule } from './common/tasks/tasks.module';
import { TestModule } from './modules/test/test.module';
@Dependencies(DataSource)
@Module({
  imports: [
    CommonModule,
    UserModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: envFilePath,
    }),
    WinstonModule.forRoot({
      exitOnError: false,
      format: format.combine(
        format.colorize(),
        format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss',
        }),
        format.splat(),
        format.printf((info) => {
          return `${info.timestamp} ${info.level}: ${info.message}`;
        }),
      ),
      transports: [
        new winston.transports.Console({
          level: 'http',
        }),
        new DailyRotateFile({
          filename: 'logs/error-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '14d',
          level: 'error',
        }),
        new DailyRotateFile({
          filename: 'logs/info-%DATE%.log',
          datePattern: 'YYYY-MM-DD-HH',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '14d',
          level: 'info',
        }),
        new DailyRotateFile({
          filename: 'logs/http-%DATE%.log',
          datePattern: 'YYYY-MM-DD-HH',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '14d',
          level: 'http',
        }),
      ],
    }),
    TypeOrmModule.forRoot({
      // name:'default',
      type: 'postgres',
      host: process.env.postgresHOST || '127.0.0.1',
      port: Number(process.env.postgresPORT),
      username: process.env.postgresUSERNAME || 'postgres',
      password: process.env.postgresPASSWORD || 'postgres',
      database: process.env.postgresDATABASE || 'zgsy',
      entities: [
        __dirname + '/**/**/*.entity{.ts,.js}',
        __dirname + '/**/**/**/*.entity{.ts,.js}',
      ],
      // autoLoadEntities: true,
      // synchronize: true,
    }),
    FileModule,
    ResourceHandlerModule,
    TestModule,
    //定时任务
    // ScheduleModule.forRoot(),
    // TasksModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: CommInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    AppService,
  ],
})
export class AppModule {}
