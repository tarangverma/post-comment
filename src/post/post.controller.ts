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

/**
 * Controller responsible for handling post-related HTTP requests
 * Manages operations for posts and their comments
 */
@Controller('/')
export class PostController {
  constructor(private readonly postService: PostService) {}

  /**
   * Creates a new post for a specific user
   * @param userId - The UUID of the user creating the post
   * @param createPostDto - The data for creating the post
   * @returns Promise containing the created post
   */
  @ApiTags('Posts')
  @ApiOperation({ summary: 'Create a post' })
  @Post('/:userId/posts')
  createPost(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Body() createPostDto: CreatePostDto,
  ): Promise<PostDto> {
    return this.postService.createPost(createPostDto, userId);
  }

  /**
   * Retrieves all posts for a specific user
   * @param userId - The UUID of the user whose posts to retrieve
   * @returns Promise containing an array of posts
   */
  @ApiTags('Posts')
  @ApiOperation({ summary: 'Get all posts' })
  @Get('/:userId/posts')
  findAllPosts(
    @Param('userId', ParseUUIDPipe) userId: string,
  ): Promise<PostDto[]> {
    return this.postService.findAllPosts(userId);
  }

  /**
   * Retrieves a specific post by its ID
   * @param userId - The UUID of the user who owns the post
   * @param id - The UUID of the post to retrieve
   * @returns Promise containing the requested post
   */
  @ApiTags('Posts')
  @ApiOperation({ summary: 'Get a post by id' })
  @Get('/:userId/posts/:id')
  findOnePost(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<PostDto> {
    return this.postService.findOnePost(id, userId);
  }

  /**
   * Updates an existing post
   * @param id - The UUID of the post to update
   * @param updatePostDto - The updated post data
   * @param userId - The UUID of the user who owns the post
   * @returns Promise containing the updated post
   */
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

  /**
   * Deletes a specific post
   * @param userId - The UUID of the user who owns the post
   * @param id - The UUID of the post to delete
   * @returns Promise that resolves when the post is deleted
   */
  @ApiTags('Posts')
  @ApiOperation({ summary: 'Delete a post' })
  @Delete('/:userId/posts/:id')
  deletePost(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    return this.postService.deletePost(id, userId);
  }

  /**
   * Adds a comment to a specific post
   * @param userId - The UUID of the user creating the comment
   * @param postId - The UUID of the post to comment on
   * @param createCommentDto - The data for creating the comment
   * @returns Promise containing the created comment
   */
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

  /**
   * Updates an existing comment
   * @param userId - The UUID of the user who owns the comment
   * @param postId - The UUID of the post containing the comment
   * @param commentId - The UUID of the comment to update
   * @param updateCommentDto - The updated comment data
   * @returns Promise containing the updated comment
   */
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
