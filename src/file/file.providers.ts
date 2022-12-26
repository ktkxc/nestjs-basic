/* eslint-disable prettier/prettier */
import { FileService } from './file.service';
import { Injectable } from '@nestjs/common';
import {
  MulterOptionsFactory,
  MulterModuleOptions,
} from '@nestjs/platform-express';
import * as multer from 'multer';

@Injectable()
export class FileConfigService implements MulterOptionsFactory {
  constructor(private readonly fileService: FileService) {}
  createMulterOptions(): MulterModuleOptions {
    return {
      storage: multer.diskStorage({
        destination: this.fileService.completeFileDestinationHandler.bind(
          this.fileService,
        ),
        filename: this.fileService.completeFileNameHandler.bind(
          this.fileService,
        ),
      }),
    };
  }
}
