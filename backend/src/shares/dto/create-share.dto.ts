import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsInt } from 'class-validator';

export class CreateShareDto {
  @ApiProperty({ example: 1, description: 'The ID of the post being shared' })
  @IsInt()
  @IsNotEmpty()
  postId: number;
}
