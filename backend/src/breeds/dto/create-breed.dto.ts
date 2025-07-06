import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { PetType } from 'src/core/enums/pettype.enum';

export class CreateBreedDto {
  @ApiProperty({
    example: 'Labrador Retriever',
    description: 'The name of the breed',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'Friendly and energetic breed',
    description: 'Description of the breed',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    enum: PetType,
    example: PetType.DOG,
    description: 'Type of pet this breed belongs to',
  })
  @IsEnum(PetType)
  @IsNotEmpty()
  petType: PetType;
}
