import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { AdminSeeder } from './database/seeds/admin.seed';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS for frontend
  app.enableCors({
    origin: '*',
    credentials: true,
  });
  
  // Enable validation pipes
  app.useGlobalPipes(new ValidationPipe());
  
  // Run admin seeder on startup
  try {
    console.log('🌱 Running admin seeder...');
    const adminSeeder = app.get(AdminSeeder);
    await adminSeeder.seed();
  } catch (error) {
    console.error('❌ Failed to run admin seeder:', error.message);
  }
  
  const port = process.env.PORT || 8000;
  await app.listen(port);
  
  console.log(`🚀 Admin server is running on: http://localhost:${port}`);
  console.log(`📊 Frontend dev server: http://localhost:8001`);
}
bootstrap();
