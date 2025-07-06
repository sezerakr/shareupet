import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsInt } from 'class-validator';
export class CreatePostDto {
  @ApiProperty({
    example: 'My new puppy!',
    description: 'The title of the post',
  })
  @IsString()
  @IsNotEmpty()
  title: string;
  @ApiProperty({
    example: "Just got this little guy, isn't he cute?",
    description: 'The content of the post',
  })
  @IsString()
  @IsNotEmpty()
  content: string;
  @ApiProperty({ required: false, description: 'URL to an image for the post' })
  @IsString()
  @IsOptional()
  imageUrl?: string;
  @ApiProperty({
    required: false,
    description: 'ID of the pet this post is about',
  })
  @IsInt()
  @IsOptional()
  petId?: number;
}
