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

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private postRepository: Repository<Post>,
    @InjectRepository(Comment) private commentRepository: Repository<Comment>,
  ) {}

  // Create a new post
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

  // Retrieve all posts
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

  // Retrieve a single post by ID
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

  // Add a comment to a post
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

  // Update a post
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

  // Delete a post
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

  // New method for editing comments
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
