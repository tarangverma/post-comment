import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Comment } from './entities/comment.entity';
import { LogMethod } from '../decorators/log-method.decorator';
import { PostDto } from './dto/post.dto';

/**
 * Service handling all post-related operations including CRUD operations for posts and comments
 */
@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private postRepository: Repository<Post>,
    @InjectRepository(Comment) private commentRepository: Repository<Comment>,
  ) {}

  /**
   * Creates a new post for a specific user
   * @param createPostDto - The data for creating the post
   * @param userId - The ID of the user creating the post
   * @returns A promise that resolves to the created post DTO
   */
  @LogMethod()
  async createPost(
    createPostDto: CreatePostDto,
    userId: string,
  ): Promise<PostDto> {
    const post = this.postRepository.create({
      ...createPostDto,
      userId,
    });
    const savedPost = await this.postRepository.save(post);
    return new PostDto(savedPost);
  }

  /**
   * Retrieves all posts for a specific user
   * @param userId - The ID of the user whose posts to retrieve
   * @returns A promise that resolves to an array of post DTOs
   */
  @LogMethod()
  async findAllPosts(userId: string): Promise<PostDto[]> {
    const posts = await this.postRepository.find({
      where: { userId },
      relations: ['comments'],
      order: {
        createdAt: 'DESC',
        comments: {
          createdAt: 'DESC',
        },
      },
    });
    return posts.map((post) => new PostDto(post));
  }

  /**
   * Retrieves a single post by its ID
   * @param id - The ID of the post to retrieve
   * @param userId - The ID of the user requesting the post
   * @returns A promise that resolves to the found post
   * @throws NotFoundException if the post doesn't exist
   * @throws ForbiddenException if the user doesn't own the post
   */
  @LogMethod()
  async findOnePost(id: string, userId: string): Promise<Post> {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: ['comments'],
      order: {
        createdAt: 'DESC',
        comments: {
          createdAt: 'DESC',
        },
      },
    });
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    if (post.userId !== userId) {
      throw new ForbiddenException('You can only view your own posts');
    }
    return post;
  }

  /**
   * Adds a comment to a specific post
   * @param postId - The ID of the post to comment on
   * @param createCommentDto - The data for creating the comment
   * @param userId - The ID of the user creating the comment
   * @returns A promise that resolves to the created comment
   */
  @LogMethod()
  async addComment(
    postId: string,
    createCommentDto: CreateCommentDto,
    userId: string,
  ): Promise<Comment> {
    const post = await this.findOnePost(postId, userId);
    const comment = this.commentRepository.create({
      ...createCommentDto,
      userId,
      post,
    });
    return this.commentRepository.save(comment);
  }

  /**
   * Updates an existing post
   * @param id - The ID of the post to update
   * @param userId - The ID of the user updating the post
   * @param updatePostDto - The new data for the post
   * @returns A promise that resolves to the updated post DTO
   * @throws ForbiddenException if the user doesn't own the post
   */
  @LogMethod()
  async updatePost(
    id: string,
    userId: string,
    updatePostDto: CreatePostDto,
  ): Promise<PostDto> {
    const post = await this.findOnePost(id, userId);

    if (post.userId !== userId) {
      throw new ForbiddenException('You can only edit your own posts');
    }

    this.postRepository.merge(post, {
      ...updatePostDto,
      isEdited: true,
    });
    const updatedPost = await this.postRepository.save(post);
    return new PostDto(updatedPost);
  }

  /**
   * Deletes a post
   * @param id - The ID of the post to delete
   * @param userId - The ID of the user deleting the post
   * @throws ForbiddenException if the user doesn't own the post
   * @throws NotFoundException if the post doesn't exist
   */
  @LogMethod()
  async deletePost(id: string, userId: string): Promise<void> {
    const post = await this.findOnePost(id, userId);
    if (post.userId !== userId) {
      throw new ForbiddenException('You can only delete your own posts');
    }
    const result = await this.postRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Post not found');
    }
  }

  /**
   * Updates an existing comment
   * @param postId - The ID of the post containing the comment
   * @param commentId - The ID of the comment to update
   * @param userId - The ID of the user updating the comment
   * @param content - The new content for the comment
   * @returns A promise that resolves to the updated comment
   * @throws NotFoundException if the comment doesn't exist
   * @throws ForbiddenException if the user doesn't own the comment
   */
  @LogMethod()
  async updateComment(
    postId: string,
    commentId: string,
    userId: string,
    content: string,
  ): Promise<Comment> {
    const comment = await this.commentRepository.findOne({
      where: { id: commentId, post: { id: postId } },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    if (comment.userId !== userId) {
      throw new ForbiddenException('You can only edit your own comments');
    }

    comment.text = content;
    comment.isEdited = true;

    return this.commentRepository.save(comment);
  }
}
