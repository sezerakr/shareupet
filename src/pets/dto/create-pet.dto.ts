import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsNotEmpty, IsOptional } from 'class-validator';
import { Breed } from "src/breeds/entities/breed.entity";

export class CreatePetDto {
    @ApiProperty({ example: 'Buddy', description: 'The name of the pet' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ example: 'Friendly and energetic dog', description: 'Description of the pet' })
    @IsString()
    @IsNotEmpty()
    description: string;

    @ApiProperty({ example: 3, description: 'Age of the pet in years' })
    @IsNumber()
    age: number;

    @ApiProperty({ description: 'Breed of the pet' })
    breed: Breed;

    @ApiProperty({ example: 'Brown', description: 'Color of the pet' })
    @IsString()
    color: string;

    @ApiProperty({ required: false, description: 'URL to pet image' })
    @IsString()
    @IsOptional()
    image: string;
}