import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBreedDto } from './dto/create-breed.dto';
import { UpdateBreedDto } from './dto/update-breed.dto';
import { Breed } from './entities/breed.entity';
import { ApiResponse } from 'src/core/interfaces/api-response.interface';
import { PaginationDto } from 'src/core/dto/pagination.dto';
import { PetType } from 'src/core/enums/pettype.enum';

@Injectable()
export class BreedsService {
  constructor(
    @InjectRepository(Breed)
    private breedsRepository: Repository<Breed>,
  ) { }

  async create(createBreedDto: CreateBreedDto): Promise<ApiResponse<Breed>> {
    try {
      const breed = this.breedsRepository.create(createBreedDto);
      const savedBreed = await this.breedsRepository.save(breed);
      return {
        success: true,
        data: savedBreed
      };
    } catch (error) {
      return {
        success: false,
        error: {
          message: 'Failed to create breed',
          code: 'CREATE_BREED_ERROR',
          details: error.message
        }
      };
    }
  }

  async findAll(paginationDto: PaginationDto, petType?: PetType): Promise<ApiResponse<Breed[]>> {
    try {
      const { page = 1, limit = 100, search } = paginationDto;
      const skip = (page - 1) * limit;

      const queryBuilder = this.breedsRepository.createQueryBuilder('breed')
        .skip(skip)
        .take(limit);

      // Filter by pet type if provided
      if (petType) {
        queryBuilder.andWhere('breed.petType = :petType', { petType });
      }

      // Add search condition if search parameter is provided
      if (search) {
        queryBuilder.andWhere(
          '(breed.name ILIKE :search OR breed.description ILIKE :search)',
          { search: `%${search}%` }
        );
      }

      const [breeds, total] = await queryBuilder.getManyAndCount();
      const totalPages = Math.ceil(total / limit);

      return {
        success: true,
        data: breeds,
        pagination: {
          total,
          page,
          limit,
          totalPages
        }
      };
    } catch (error) {
      return {
        success: false,
        error: {
          message: 'Failed to retrieve breeds',
          code: 'FIND_BREEDS_ERROR',
          details: error.message
        }
      };
    }
  }

  async findByPetType(petType: PetType, paginationDto: PaginationDto): Promise<ApiResponse<Breed[]>> {
    return this.findAll(paginationDto, petType);
  }

}