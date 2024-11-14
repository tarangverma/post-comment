import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Comment } from './entities/comment.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private postRepository: Repository<Post>,
    @InjectRepository(Comment) private commentRepository: Repository<Comment>,
  ) {}

  // Create a new post
  async createPost(createPostDto: CreatePostDto): Promise<Post> {
    const post = this.postRepository.create(createPostDto);
    return this.postRepository.save(post);
  }

  // Retrieve all posts
  async findAllPosts(): Promise<Post[]> {
    return this.postRepository.find({ relations: ['comments'] });
  }

  // Retrieve a single post by ID
  async findOnePost(id: number): Promise<Post> {
    const post = await this.postRepository.findOne({ where: { id }, relations: ['comments'] });
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    return post;
  }

  // Add a comment to a post
  async addComment(postId: number, createCommentDto: CreateCommentDto): Promise<Comment> {
    const post = await this.findOnePost(postId);
    const comment = this.commentRepository.create({ ...createCommentDto, post });
    return this.commentRepository.save(comment);
  }

  // Update a post
  async updatePost(id: number, updatePostDto: CreatePostDto): Promise<Post> {
    const post = await this.findOnePost(id);
    this.postRepository.merge(post, updatePostDto);
    return this.postRepository.save(post);
  }

  // Delete a post
  async deletePost(id: number): Promise<void> {
    const result = await this.postRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Post not found');
    }
  }
}
