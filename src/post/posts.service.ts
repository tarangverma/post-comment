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
  ): Promise<Post> {
    const post = this.postRepository.create({
      ...createPostDto,
      userId,
    });
    return this.postRepository.save(post);
  }

  // Retrieve all posts
  @LogMethod()
  async findAllPosts(): Promise<Post[]> {
    return this.postRepository.find({ relations: ['comments'] });
  }

  // Retrieve a single post by ID
  @LogMethod()
  async findOnePost(id: string): Promise<Post> {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: ['comments'],
    });
    if (!post) {
      throw new NotFoundException('Post not found');
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
    const post = await this.findOnePost(postId);
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
  ): Promise<Post> {
    const post = await this.findOnePost(id);

    if (post.userId !== userId) {
      throw new ForbiddenException('You can only edit your own posts');
    }

    this.postRepository.merge(post, {
      ...updatePostDto,
      isEdited: true,
    });
    return this.postRepository.save(post);
  }

  // Delete a post
  @LogMethod()
  async deletePost(id: string): Promise<void> {
    const result = await this.postRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Post not found');
    }
  }
}
