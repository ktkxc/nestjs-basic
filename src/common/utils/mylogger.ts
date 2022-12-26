import { Injectable, Inject } from '@nestjs/common';
import { Logger } from 'winston';
import { Request } from 'express';

@Injectable()
export class MyLogger {
  constructor(@Inject('winston') private readonly logger: Logger) {}
  info(message: string, req?: Request) {
    const objlog = req
      ? {
          method: req.method,
          url: req.url,
          ip: req.ip,
          useragent: req.headers['user-agent'],
        }
      : {};
    this.logger.info(message + ',' + JSON.stringify(objlog));
  }
  error(message: string, req?: Request) {
    const objlog = req
      ? {
          method: req.method,
          url: req.url,
          ip: req.ip,
          useragent: req.headers['user-agent'],
        }
      : {};
    this.logger.error(message + ',' + JSON.stringify(objlog));
  }
  log(level: string, message: string, req?: Request) {
    const objlog = req
      ? {
          method: req.method,
          url: req.url,
          ip: req.ip,
          useragent: req.headers['user-agent'],
        }
      : {};
    this.logger.log(level, message + ',' + JSON.stringify(objlog));
  }
}
