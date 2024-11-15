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
import { UpdateCommentDto } from './dto/update-comment.dto';
import { PostDto } from './dto/post.dto';
import { CommentDto } from './dto/comment.dto';

@Controller('/')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @ApiTags('Posts')
  @ApiOperation({ summary: 'Create a post' })
  @Post('/:userId/posts')
  createPost(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Body() createPostDto: CreatePostDto,
  ): Promise<PostDto> {
    return this.postService.createPost(createPostDto, userId);
  }

  @ApiTags('Posts')
  @ApiOperation({ summary: 'Get all posts' })
  @Get('/:userId/posts')
  findAllPosts(
    @Param('userId', ParseUUIDPipe) userId: string,
  ): Promise<PostDto[]> {
    return this.postService.findAllPosts(userId);
  }

  @ApiTags('Posts')
  @ApiOperation({ summary: 'Get a post by id' })
  @Get('/:userId/posts/:id')
  findOnePost(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<PostDto> {
    return this.postService.findOnePost(id, userId);
  }

  @ApiTags('Posts')
  @ApiOperation({ summary: 'Update a post' })
  @Put('/:userId/posts/:id')
  updatePost(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePostDto: CreatePostDto,
    @Param('userId', ParseUUIDPipe) userId: string,
  ): Promise<PostDto> {
    return this.postService.updatePost(id, userId, updatePostDto);
  }

  @ApiTags('Posts')
  @ApiOperation({ summary: 'Delete a post' })
  @Delete('/:userId/posts/:id')
  deletePost(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    return this.postService.deletePost(id, userId);
  }

  @ApiTags('Comments')
  @ApiOperation({ summary: 'Add a comment to a post' })
  @Post('/:userId/posts/:postId/comments')
  addComment(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Param('postId', ParseUUIDPipe) postId: string,
    @Body() createCommentDto: CreateCommentDto,
  ): Promise<CommentDto> {
    return this.postService.addComment(postId, createCommentDto, userId);
  }

  @ApiTags('Comments')
  @ApiOperation({ summary: 'Edit a comment' })
  @Put('/:userId/posts/:postId/comments/:commentId')
  updateComment(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Param('postId', ParseUUIDPipe) postId: string,
    @Param('commentId', ParseUUIDPipe) commentId: string,
    @Body() updateCommentDto: UpdateCommentDto,
  ): Promise<CommentDto> {
    return this.postService.updateComment(
      postId,
      commentId,
      userId,
      updateCommentDto.text,
    );
  }
}
