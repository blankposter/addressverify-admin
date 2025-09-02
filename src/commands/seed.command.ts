import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { AdminSeeder } from '../database/seeds/admin.seed';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  
  const seeder = app.get(AdminSeeder);
  
  const command = process.argv[2];
  
  switch (command) {
    case 'seed':
      await seeder.seed();
      break;
    case 'clear':
      await seeder.clear();
      break;
    case 'refresh':
      await seeder.clear();
      await seeder.seed();
      break;
    default:
      console.log('Available commands: seed, clear, refresh');
  }
  
  await app.close();
}

bootstrap();