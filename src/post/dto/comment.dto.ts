import { Exclude, Expose, Type } from 'class-transformer';
import { Post } from '../entities/post.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

@Exclude()
export class CommentDto {
  @Expose()
  @ApiProperty({ description: 'Unique identifier of the comment' })
  id: string;

  @Expose()
  @ApiProperty({ description: 'Content of the comment' })
  text: string;

  @Expose()
  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;

  @Expose()
  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt: Date;

  @Expose()
  @ApiProperty({ description: 'ID of the user who created the comment' })
  userId: string;

  @Expose()
  @ApiProperty({ description: 'Indicates if the comment has been edited' })
  isEdited: boolean;

  @Expose()
  @ApiProperty({ description: 'ID of the post this comment belongs to' })
  postId: string;

  @Type(() => Post)
  @ApiPropertyOptional({
    description: 'The related post object',
    type: () => Post,
  })
  post?: Post;

  constructor(partial: Partial<CommentDto>) {
    Object.assign(this, partial);
  }
}
