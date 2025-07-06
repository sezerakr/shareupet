import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsInt } from 'class-validator';

export class CreateLikeDto {
  @ApiProperty({ example: 1, description: 'The ID of the post being liked' })
  @IsInt()
  @IsNotEmpty()
  postId: number;
}
