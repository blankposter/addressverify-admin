"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("../app.module");
const admin_seed_1 = require("../database/seeds/admin.seed");
async function bootstrap() {
    const app = await core_1.NestFactory.createApplicationContext(app_module_1.AppModule);
    const seeder = app.get(admin_seed_1.AdminSeeder);
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
//# sourceMappingURL=seed.command.js.map