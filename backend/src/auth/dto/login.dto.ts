import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'Username for authentication',
    example: 'johndoe',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    description: 'User password',
    example: 'password123',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
