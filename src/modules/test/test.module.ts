import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { TestService } from './test.service';
import { TestController } from './test.controller';
import { ZgsyNest } from './entities/test.entity';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    TypeOrmModule.forFeature([ZgsyNest]),
  ],
  providers: [TestService],
  controllers: [TestController],
})
export class TestModule {}
