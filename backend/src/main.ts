import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Render sits behind a proxy; this makes rate limiting use the real client IP
  app.getHttpAdapter().getInstance().set('trust proxy', 1);
  app.use(helmet());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  // CORS_ORIGIN: one or more website origins separated by commas, no trailing slash
  const origins = (process.env.CORS_ORIGIN || 'http://localhost:3000')
    .split(',').map((s) => s.trim()).filter(Boolean);
  app.enableCors({ origin: origins });
  await app.listen(process.env.PORT || 4000, '0.0.0.0');
}
bootstrap();
