/* eslint-disable prettier/prettier */
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    // console.log('AllExceptionsFilter...');
    // console.log(exception);
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    // console.log((message))
    response.status(status).json({
      code: status,
      message:
        message['message'] && message['message'].indexOf('Unauthorized') >= 0
          ? '请先登录系统！'
          : message['message'] || message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
