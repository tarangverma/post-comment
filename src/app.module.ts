import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostModule } from './post/posts.module';
import { typeOrmConfig } from './database/database.source';
import { LoggerModule } from 'nestjs-pino';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    LoggerModule.forRoot({
      pinoHttp: {
        level: 'info',
        timestamp: () => `,"time":"${new Date().toISOString()}Z"`,
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
        autoLogging: {
          ignore: (req) => {
            return ['/health'].some((e) => req.url.includes(e));
          },
        },
      },
    }),
    PostModule,
  ],
})
export class AppModule {}
