import { Module, Global } from '@nestjs/common';

import { CryptoUtil } from './utils/crypto.util';
import { MyLogger } from './utils/mylogger';
/**
 * 公共模块，向 nest 容器提供单例的公共模块，其他模块使用公共模块导出的 provider 时，只需导入 CommonModule
 */
@Global()
@Module({
  providers: [CryptoUtil, MyLogger],
  exports: [CryptoUtil, MyLogger],
})
export class CommonModule {}
