import { Exclude, Expose, Type } from 'class-transformer';
import { CommentDto } from './comment.dto';
import { ApiProperty } from '@nestjs/swagger';

@Exclude()
export class PostDto {
  @Expose()
  @ApiProperty({ description: 'Unique identifier of the post' })
  id: string;

  @Expose()
  @ApiProperty({ description: 'Title of the post' })
  title: string;

  @Expose()
  @ApiProperty({ description: 'Main content of the post' })
  content: string;

  @Expose()
  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;

  @Expose()
  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt: Date;

  @Expose()
  @ApiProperty({ description: 'ID of the user who created the post' })
  userId: string;

  @Expose()
  @ApiProperty({ description: 'Indicates if the post has been edited' })
  isEdited: boolean;

  @Expose()
  @Type(() => CommentDto)
  @ApiProperty({
    description: 'Array of comments on this post',
    type: [CommentDto],
  })
  comments: CommentDto[];

  constructor(partial: Partial<PostDto>) {
    Object.assign(this, partial);
  }
}
