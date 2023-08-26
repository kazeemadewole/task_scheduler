import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import * as Express from 'express';
import { ExpressAdapter } from '@nestjs/platform-express';
import { TransformInterceptor } from './base/response.interceptor';
import { TrimPipe } from './base/request.interceptor';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { RolesService } from './roles/roles.service';
// import compression from 'compression';

const server = Express();
async function bootstrap() {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server), {
    // bodyParser: true,
    bufferLogs: true,
  });
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalPipes(new TrimPipe());
  const config = app.get(ConfigService);
  const swaggerConfig = new DocumentBuilder()
    .addServer(config.get<string>('SWAGGER_SERVER_URL'))
    .setTitle('task Scheduler')
    .setDescription(' this service used for prospect data')
    .setVersion('2.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        in: 'header',
      },
      'AUTHORIZATION TOKEN',
    )
    .addTag('task scheduler')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  const environment = config.get<string>('NODE_ENV');
  if (!(environment === 'production')) {
    SwaggerModule.setup('documentationView', app, document);
  }
  app.useGlobalPipes(new ValidationPipe());
  // todo: add logic to only accept specific headers
  app.enableCors();

  const roleSeeder = app.get(RolesService);
  await roleSeeder.seed();
  app.use(Express.text({ limit: '20mb', type: 'text/plain' }));
  app.use(Express.urlencoded({ limit: '50mb', extended: true }));
  app.use(Express.json({ limit: '50mb' }));
  // app.use(compression());

  await app.listen(config.get('PORT'));
  console.log(`dev started on localhost:${config.get('PORT')}`);
}
bootstrap();
