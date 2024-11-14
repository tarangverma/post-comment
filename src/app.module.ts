import { Module } from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import { PostModule } from './post/posts.module';

@Module({
  imports: [PostModule, TypeOrmModule.forRoot({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'pass123',
    database: 'postgres',
    autoLoadEntities: true,
    synchronize: true
  }),
  PostModule,
],
  
})
export class AppModule {}
