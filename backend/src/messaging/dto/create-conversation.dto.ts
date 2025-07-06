import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsArray, IsInt } from 'class-validator';

export class CreateConversationDto {
  @ApiProperty({
    example: [1, 2],
    description: 'Array of user IDs participating in the conversation',
  })
  @IsArray()
  @IsInt({ each: true })
  @IsNotEmpty()
  participantIds: number[];
}
