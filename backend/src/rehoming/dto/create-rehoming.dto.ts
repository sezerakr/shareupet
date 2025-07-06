import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsInt } from 'class-validator';

export class CreateRehomingDto {
  @ApiProperty({
    example: 1,
    description: 'The ID of the post related to the rehoming request',
  })
  @IsInt()
  @IsNotEmpty()
  postId: number;
}
