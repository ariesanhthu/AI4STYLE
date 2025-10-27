import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { existsSync, mkdirSync, writeFileSync } from 'fs';

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
  //enable shutting
  app.enableShutdownHooks();

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
    prefix: 'shop/v',
  });

  // const configService = app.get(ConfigService);
  const host = process.env.HOST || 'localhost';
  const port = process.env.PORT || 3001;
  const apiKey = process.env.API_KEY || 'mysecretapikey';

  // setup global filters and interceptors
  // app.useGlobalFilters(new GlobalExceptionFilter());
  // app.useGlobalInterceptors(new ResponseInterceptor());

  // setup validate
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // setup swagger
  const config = new DocumentBuilder()
    .setTitle('Restaurant API')
    .setDescription('API for restaurant project.')
    .setVersion('1.0')
    .addBearerAuth()
    .addApiKey(
      {
        type: 'apiKey',
        name: 'x-api-key',
        in: 'header',
        description: `API key for public endpoints. Current value: ${apiKey}`,
      },
      'x-api-key',
    )
    .addServer(`http://${host}:${port}`)
    .build();

  const document = SwaggerModule.createDocument(app, config);

  const swaggerCustomOptions = {
    swaggerOptions: {
      docExpansion: 'none',
      persistAuthorization: true,
      tagsSorter: 'alpha',        // <-- sắp xếp tags theo alphabet
      operationSorter: 'alpha',   // <-- sắp xếp API trong mỗi tag theo alphabet
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

  // writeFileSync('./swagger-spec.json', JSON.stringify(document, null, 2));

  // if (!existsSync('./uploads')) {
  //   mkdirSync('./uploads');
  // }
  // if (!existsSync('uploads/images')) {
  //   mkdirSync('uploads/images');
  // }
  // if (!existsSync('uploads/excels')) {
  //   mkdirSync('uploads/excels');
  // }
  // if (!existsSync('uploads/pdf')) {
  //   mkdirSync('uploads/pdf');
  // }

  await app.listen(port, () => {
    console.log(`server running on port: ${port}`);
    console.log(`swagger: http://${host}:${port}/swagger`);
  });
}
bootstrap();
