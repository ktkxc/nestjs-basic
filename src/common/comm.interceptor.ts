import {
  CallHandler,
  Inject,
  ExecutionContext,
  HttpException,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Logger } from 'winston';

@Injectable()
export class CommInterceptor implements NestInterceptor {
  constructor(@Inject('winston') private readonly logger: Logger) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.getArgByIndex(1).req;
    // this.logger.info("Interceptor before....");
    return next
      .handle()
      .pipe(
        map((data): any => {
          // console.log("map-Interceptor...after.")
          // console.log(data)
          const objlog = {
            method: req.method,
            originalUrl: req.originalUrl,
            url: req.url,
            referrer: req.referrer,
            useragent: req.headers['user-agent'],
            ip: req.ip,
          };
          this.logger.log('http', JSON.stringify(objlog));
          console.log(data);
          return Promise.resolve({
            code: 0,
            message: `OK`,
            data,
          });
        }),
      )
      .pipe(
        catchError((error): any => {
          if (error instanceof HttpException) {
            this.logger.error({
              message: [
                'Param:' + JSON.stringify(req.Param || req.query || {}),
                'url:' + req.url,
                'ip:' + req.ip,
                error.getResponse(),
                error.stack,
              ].join('\n'),
            });
            return Promise.resolve({
              code: error.getStatus(),
              message: error.getResponse(),
            });
          }
          return Promise.resolve({
            code: 500,
            message: `出现了意外错误：${error.toString()}`,
          });
        }),
      );
  }
}
