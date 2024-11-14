import { Controller, Get, Post, Body, Param, ParseIntPipe, Put, Delete } from '@nestjs/common';
import { PostService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { CreateCommentDto } from './dto/create-comment.dto';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  createPost(@Body() createPostDto: CreatePostDto) {
    return this.postService.createPost(createPostDto);
  }

  @Get()
  findAllPosts() {
    return this.postService.findAllPosts();
  }

  @Get(':id')
  findOnePost(@Param('id', ParseIntPipe) id: number) {
    return this.postService.findOnePost(id);
  }

  @Post(':postId/comments')
  addComment(
    @Param('postId', ParseIntPipe) postId: number,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return this.postService.addComment(postId, createCommentDto);
  }

  @Put(':id')
  updatePost(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePostDto: CreatePostDto,
  ) {
    return this.postService.updatePost(id, updatePostDto);
  }

  @Delete(':id')
  deletePost(@Param('id', ParseIntPipe) id: number) {
    return this.postService.deletePost(id);
  }
}
