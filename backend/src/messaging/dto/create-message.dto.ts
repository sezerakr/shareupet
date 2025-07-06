import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsInt } from 'class-validator';

export class CreateMessageDto {
  @ApiProperty({
    example: 'Hello, how are you?',
    description: 'The content of the message',
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    example: 1,
    description: 'The ID of the conversation the message belongs to',
  })
  @IsInt()
  @IsNotEmpty()
  conversationId: number;
}
