import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostController } from './post.controller';
import { PostService } from './posts.service';
import { Post } from './entities/post.entity';
import { Comment } from './entities/comment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post, Comment]), // Register the Post and Comment entities
  ],
  controllers: [PostController], // Register the controller
  providers: [PostService], // Register the service
})
export class PostModule {}
