"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: process.env.CORS_ORIGIN || 'http://localhost:3001',
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe());
    const port = process.env.PORT || 4000;
    await app.listen(port);
    console.log(`🚀 Admin server is running on: http://localhost:${port}`);
    console.log(`📊 Frontend dev server: http://localhost:3001`);
}
bootstrap();
//# sourceMappingURL=main.js.map