import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { AllExceptionsFilter } from './common/any-exception.filter';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
async function bootstrap() {
  // const app = await NestFactory.create(AppModule, {
  //   logger: false,
  // });
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: false,
  });
  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('开发项目 example')
    .setDescription('这是项目 API description')
    .setVersion('1.0')
    .addTag('项目标签')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-doc', app, document);
  app.useStaticAssets(join(__dirname, '..', 'public'));
  // 配置模板引擎
  // app.setBaseViewsDir(join(__dirname,'..','views'));
  // app.setViewEngine('ejs');

  //跨源资源共享（CORS）是一种允许从另一个域请求资源的机制
  app.enableCors();
  const nestWinston = app.get(WINSTON_MODULE_NEST_PROVIDER);
  //全局的logger
  app.useLogger(nestWinston);
  app.useGlobalFilters(new AllExceptionsFilter());
  await app.listen(process.env.PORT);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
