/* eslint-disable prettier/prettier */
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisCacheService } from './redis-cache.service';
import { CacheModule, Module } from '@nestjs/common';
import { redisStore } from 'cache-manager-redis-store';

@Module({
  imports: [
    //内存方式
    // CacheModule.register(
    //     {
    //         store: 'memory',
    //         ttl: 10000,
    //     },
    // ),
    //redis方式
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return [
          {
            store: redisStore,
            host: configService.get('REDIS_HOST'),
            port: configService.get('REDIS_PORT'),
            // db: 0, //目标库,
            auth_pass: configService.get('REDIS_PASSPORT'),
            // 密码,没有可以不写
          },
        ];
      },
    }),
  ],
  providers: [RedisCacheService],
  exports: [RedisCacheService],
})
export class RedisCacheModule {}
