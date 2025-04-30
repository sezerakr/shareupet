import { IsString, IsNotEmpty, MinLength, IsEmail, IsDate, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { Role } from 'src/core/enums/role.enum';

export class GetUserDto {
    username: string;
    email: string;
    role: Role;
    displayName: string;
    avatar: string;
    birthdate: Date;
}