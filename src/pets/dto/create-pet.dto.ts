import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsNotEmpty, IsOptional, IsEnum, IsInt } from 'class-validator';
import { PetType } from 'src/core/enums/pettype.enum';

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

    @ApiProperty({
        enum: PetType,
        example: PetType.CAT,
        description: 'Type of pet (cat, dog, etc.)'
    })
    @IsEnum(PetType)
    @IsNotEmpty()
    type: PetType;

    @ApiProperty({ example: 1, description: 'ID of the breed' })
    @IsInt()
    @IsNotEmpty()
    breedId: number;

    @ApiProperty({ example: 'Brown', description: 'Color of the pet' })
    @IsString()
    color: string;

    @ApiProperty({ required: false, description: 'URL to pet image' })
    @IsString()
    @IsOptional()
    image: string;
}