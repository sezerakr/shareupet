import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsInt } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({
    example: 'This is a great post!',
    description: 'The content of the comment',
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    example: 1,
    description: 'The ID of the post the comment belongs to',
  })
  @IsInt()
  @IsNotEmpty()
  postId: number;
}
