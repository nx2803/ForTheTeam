import { otraceSDK } from './tracing';
// NestJS 앱 시작 전 트레이싱 수집기 시작
otraceSDK.start();

import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import compression from 'compression';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 응답 압축 활성화
  app.use(compression());

  // CORS 설정 - 프론트엔드와 통신을 위해 필요
  app.enableCors({
    origin: 'http://localhost:3000', // Next.js 개발 서버
    credentials: true,
  });

  // Swagger 설정
  const config = new DocumentBuilder()
    .setTitle('NeuProject API')
    .setDescription('스포츠 리그 일정 통합 API')
    .setVersion('1.0')
    .addTag('football', '축구 4대 리그 (EPL, 분데스리가, 라리가, 세리에A)')
    .addTag('pandascore', 'e스포츠 (LCK)')
    .addTag('espn', '미국 스포츠 (NFL, NHL, NBA, MLB)')
    .addTag('KBO', '한국 프로야구')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(process.env.PORT ?? 3001);
  console.log(`Application is running on: http://localhost:3001`);
  console.log(`Swagger docs: http://localhost:3001/api-docs`);
}
bootstrap();
