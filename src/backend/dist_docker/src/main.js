"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const swagger_1 = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        abortOnError: false,
        logger: ['error', 'warn', 'debug', 'log'],
    });
    const httpServer = app.getHttpServer();
    httpServer.keepAliveTimeout = 65000;
    httpServer.headersTimeout = 66000;
    app.enableCors({
        Credentials: true,
    });
    app.enableVersioning({
        type: common_1.VersioningType.URI,
        defaultVersion: '1',
        prefix: 'shop/v',
    });
    const HOST = process.env.HOST || 'localhost';
    const PORT = process.env.PORT || 3001;
    const API_KEY = process.env.API_KEY || 'mysecretapikey';
    const config = new swagger_1.DocumentBuilder()
        .setTitle('AI4STYLE API')
        .setDescription('API for AI4STYLE project.')
        .setVersion('1.0')
        .addBearerAuth()
        .addApiKey({
        type: 'apiKey',
        name: 'x-api-key',
        in: 'header',
        description: `API key for public endpoints. Current value: ${API_KEY}`,
    }, 'x-api-key')
        .addServer(`http://${HOST}:${PORT}`)
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    const swaggerCustomOptions = {
        swaggerOptions: {
            docExpansion: 'none',
            persistAuthorization: true,
            tagsSorter: 'alpha',
            operationSorter: 'alpha',
            security: [
                {
                    'x-api-key': [],
                },
            ],
        },
    };
    swagger_1.SwaggerModule.setup('swagger', app, document, swaggerCustomOptions);
    app.getHttpAdapter().get('/swagger-json', (req, res) => {
        res.json(document);
    });
    await app.listen(PORT, () => {
        console.log(`server running on port: ${PORT}`);
        console.log(`swagger: http://${HOST}:${PORT}/swagger`);
    });
}
bootstrap();
//# sourceMappingURL=main.js.map