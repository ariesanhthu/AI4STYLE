import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { VersioningType } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    abortOnError: false,
    logger: ['error', 'warn', 'debug', 'log'],
  });

  // Cấu hình server timeout
  const httpServer = app.getHttpServer();
  httpServer.keepAliveTimeout = 65000;
  httpServer.headersTimeout = 66000;

  // app.use(cookieParser());

  // enable cors
  app.enableCors({
    Credentials: true,
  });

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
    prefix: 'shop/v',
  });

  // const configService = app.get(ConfigService);
  const HOST = process.env.HOST || 'localhost';
  const PORT = process.env.PORT || 3001;
  const API_KEY = process.env.API_KEY || 'mysecretapikey';

  // setup swagger
  const config = new DocumentBuilder()
    .setTitle('AI4STYLE API')
    .setDescription('API for AI4STYLE project.')
    .setVersion('1.0')
    .addBearerAuth()
    .addApiKey(
      {
        type: 'apiKey',
        name: 'x-api-key',
        in: 'header',
        description: `API key for public endpoints. Current value: ${API_KEY}`,
      },
      'x-api-key',
    )
    .addServer(`http://${HOST}:${PORT}`)
    .build();

  const document = SwaggerModule.createDocument(app, config);

  const swaggerCustomOptions = {
    swaggerOptions: {
      docExpansion: 'none',
      persistAuthorization: true,
      tagsSorter: 'alpha', // <-- sắp xếp tags theo alphabet
      operationSorter: 'alpha', // <-- sắp xếp API trong mỗi tag theo alphabet
      security: [
        {
          'x-api-key': [],
        },
      ],
    },
  };

  SwaggerModule.setup('swagger', app, document, swaggerCustomOptions);

  app.getHttpAdapter().get('/swagger-json', (req, res) => {
    res.json(document);
  });

  await app.listen(PORT, () => {
    console.log(`server running on port: ${PORT}`);
    console.log(`swagger: http://${HOST}:${PORT}/swagger`);
  });
}
bootstrap();
