import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS for frontend
  app.enableCors({
    origin: '*',
    credentials: true,
  });
  
  // Enable validation pipes
  app.useGlobalPipes(new ValidationPipe());
  
  const port = process.env.PORT || 8000;
  await app.listen(port);
  
  console.log(`🚀 Admin server is running on: http://localhost:${port}`);
  console.log(`📊 Frontend dev server: http://localhost:8001`);
}
bootstrap();
