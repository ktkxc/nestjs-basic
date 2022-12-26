/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { MulterModule } from '@nestjs/platform-express';
import { ResourceHandlerModule } from '../common/resource-handler/resource-handler.module';
import { FileConfigService } from './file.providers';
@Module({
  imports: [
    MulterModule.registerAsync({
      imports: [FileModule],
      useClass: FileConfigService,
      inject: [FileService],
    }),
    ResourceHandlerModule,
  ],
  controllers: [FileController],
  providers: [FileService],
  exports: [FileService],
})
export class FileModule {}
