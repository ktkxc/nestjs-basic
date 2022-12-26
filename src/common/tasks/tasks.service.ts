import { Injectable, Inject } from '@nestjs/common';
import { Cron, Interval, Timeout } from '@nestjs/schedule';
import { MyLogger } from '../utils/mylogger';

@Injectable()
export class TasksService {
  constructor(@Inject(MyLogger) private readonly mylogger: MyLogger) {}
  @Cron('45 * * * * *')
  handleCron() {
    this.mylogger.info('Called when the second is 45');
  }

  @Interval(10000)
  handleInterval() {
    this.mylogger.info('Called every 10 seconds');
  }

  @Timeout(5000)
  handleTimeout() {
    this.mylogger.info('Called once after 5 seconds');
  }
}
