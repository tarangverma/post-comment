import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import { PostService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('user/:userId/posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @ApiTags('Posts')
  @ApiOperation({ summary: 'Create a post' })
  @Post()
  createPost(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Body() createPostDto: CreatePostDto,
  ) {
    return this.postService.createPost(createPostDto, userId);
  }

  @ApiTags('Posts')
  @ApiOperation({ summary: 'Get all posts' })
  @Get()
  findAllPosts() {
    return this.postService.findAllPosts();
  }

  @ApiTags('Posts')
  @ApiOperation({ summary: 'Get a post by id' })
  @Get(':id')
  findOnePost(@Param('id', ParseUUIDPipe) id: string) {
    return this.postService.findOnePost(id);
  }

  @ApiTags('Posts')
  @ApiOperation({ summary: 'Update a post' })
  @Put(':id')
  updatePost(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePostDto: CreatePostDto,
    @Param('userId', ParseUUIDPipe) userId: string,
  ) {
    return this.postService.updatePost(id, userId, updatePostDto);
  }

  @ApiTags('Posts')
  @ApiOperation({ summary: 'Delete a post' })
  @Delete(':id')
  deletePost(@Param('id', ParseUUIDPipe) id: string) {
    return this.postService.deletePost(id);
  }

  @ApiTags('Comments')
  @ApiOperation({ summary: 'Add a comment to a post' })
  @Post(':postId/comments')
  addComment(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Param('postId', ParseUUIDPipe) postId: string,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return this.postService.addComment(postId, createCommentDto, userId);
  }
}
