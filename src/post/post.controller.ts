import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  Put,
  Delete,
} from '@nestjs/common';
import { PostService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { CreateCommentDto } from './dto/create-comment.dto';

@Controller('user/:userId/posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  createPost(
    @Param('userId', ParseIntPipe) userId: string,
    @Body() createPostDto: CreatePostDto,
  ) {
    return this.postService.createPost(createPostDto, userId);
  }

  @Get()
  findAllPosts() {
    return this.postService.findAllPosts();
  }

  @Get(':id')
  findOnePost(@Param('id', ParseIntPipe) id: string) {
    return this.postService.findOnePost(id);
  }

  @Post(':postId/comments')
  addComment(
    @Param('userId', ParseIntPipe) userId: string,
    @Param('postId', ParseIntPipe) postId: string,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return this.postService.addComment(postId, createCommentDto, userId);
  }

  @Put(':id')
  updatePost(
    @Param('id', ParseIntPipe) id: string,
    @Body() updatePostDto: CreatePostDto,
    @Param('userId', ParseIntPipe) userId: string,
  ) {
    return this.postService.updatePost(id, userId, updatePostDto);
  }

  @Delete(':id')
  deletePost(@Param('id', ParseIntPipe) id: string) {
    return this.postService.deletePost(id);
  }
}
