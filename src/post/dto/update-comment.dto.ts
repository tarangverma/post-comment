import { IsString, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCommentDto {
  @ApiProperty({
    description: 'The content of the comment',
    minimum: 1,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  text: string;
}
