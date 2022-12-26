/* eslint-disable prettier/prettier */
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  NotFoundException,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable, from, switchMap } from 'rxjs';
import { ResourceHandler } from './resource-handler/resource-handler';

@Injectable()
export class FileExistInterceptor implements NestInterceptor {
  constructor(private resourceHandler: ResourceHandler) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const {
      params: { fileId },
    } = context.switchToHttp().getRequest() as Request;
    // console.log("FileExistInterceptor......")
    return from(this.resourceHandler.getFileByFileId(fileId)).pipe(
      switchMap((filePath) => {
        // console.log("FileExistInterceptor...filePath...")
        // console.log(filePath)
        if (!filePath) throw new NotFoundException('文件不存在!');
        return next.handle();
      }),
    );
  }
}
