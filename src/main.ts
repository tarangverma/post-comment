import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder } from '@nestjs/swagger';
import { SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';
import { Logger } from 'nestjs-pino';
import { ClassSerializerInterceptor } from '@nestjs/common';

/**
 * Bootstrap function to initialize and configure the NestJS application
 */
async function bootstrap() {
  // Create NestJS application instance with console logger
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: console,
  });

  // Set global prefix for all routes
  app.setGlobalPrefix('api/');

  // Initialize global middleware (helmet, cors, logger)
  initGlobalMiddleware(app);

  // Configure global validation pipe for DTO validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip properties that don't have decorators
      forbidNonWhitelisted: true, // Throw errors if non-whitelisted properties are present
      transform: true, // Transform payloads to be objects typed according to their DTO classes
    }),
  );

  // Configure class serializer interceptor for response transformation
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  // Configure Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Post comments service')
    .setVersion('0.0.1')
    .build();
  const document = SwaggerModule.createDocument(app, config);

  // Set up Swagger UI at root path
  SwaggerModule.setup('/', app, document);

  // Start the application
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

/**
 * Initialize global middleware for the application
 * @param app - NestJS Express application instance
 */
function initGlobalMiddleware(app: NestExpressApplication) {
  // Set up Pino logger
  app.useLogger(app.get(Logger));

  // Configure Helmet middleware for security headers, added csp options to allow swagger to work
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: [`'self'`],
          styleSrc: [`'self'`, `'unsafe-inline'`],
          imgSrc: [`'self'`, 'data:', 'validator.swagger.io'],
          scriptSrc: [`'self'`, `https: 'unsafe-inline'`],
        },
      },
    }),
  );

  // Configure CORS settings from environment variables
  const corsUrisString = process.env.CORS_URIS;
  const corsUris = [];
  if (corsUrisString) {
    corsUrisString.split(',').forEach((url) => {
      corsUris.push(url);
    });
  }
  app.enableCors({ origin: corsUris, credentials: true });
}
