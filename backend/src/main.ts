import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  // CORS_ORIGIN accepts one or more origins separated by commas, no trailing slashes.
  const origins = (process.env.CORS_ORIGIN || 'http://localhost:3000')
    .split(',').map((s) => s.trim()).filter(Boolean);
  app.enableCors({ origin: origins });
  await app.listen(process.env.PORT || 4000, '0.0.0.0');
}
bootstrap();
