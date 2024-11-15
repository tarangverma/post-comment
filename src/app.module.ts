import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostModule } from './post/posts.module';
import { typeOrmConfig } from './database/database.source';
import { LoggerModule } from 'nestjs-pino';

/**
 * Root module of the NestJS application
 * Configures TypeORM database connection and Pino logging
 */
@Module({
  imports: [
    // Configure TypeORM with database connection settings
    TypeOrmModule.forRoot(typeOrmConfig),

    // Configure Pino logger with custom settings
    LoggerModule.forRoot({
      pinoHttp: {
        // Set logging level to 'info'
        level: 'info',
        // Add ISO timestamp to each log entry
        timestamp: () => `,"time":"${new Date().toISOString()}Z"`,
        // Custom serializers for request and response logging
        serializers: {
          req: (req) => {
            return {
              startTime: req.raw['startTime'],
              userAgent: req.headers['user-agent'],
              host: req.headers['host'],
              method: req.method,
              url: req.url,
              body: req.raw.body,
              pathParams: req.raw.pathParams,
              queryParams: req.raw.queryParams,
            };
          },
          res: (res) => {
            return {
              statusCode: res.statusCode,
              outResponse: res.data,
            };
          },
        },
        formatters: {
          level: (label) => ({ level: label.toUpperCase() }),
        },
      },
    }),
    PostModule,
  ],
})
export class AppModule {}
