import { Injectable } from '@nestjs/common';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { Pet } from './entities/pet.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ApiResponse } from 'src/core/interfaces/api-response.interface';
import { PaginationDto } from 'src/core/dto/pagination.dto';

@Injectable()
export class PetsService {
  constructor(
    @InjectRepository(Pet)
    private petsRepository: Repository<Pet>,
  ) {}
  async create(
    createPetDto: CreatePetDto,
    userId: number,
  ): Promise<ApiResponse<Pet>> {
    try {
      const { breedId, ...petData } = createPetDto;
      if (!breedId) {
        return {
          success: false,
          error: {
            message: 'Breed ID is required',
            code: 'BREED_REQUIRED',
          },
        };
      }

      const newPet = this.petsRepository.create({
        ...petData,
        breed: { id: breedId },
        creatorId: userId,
      });

      const savedPet = await this.petsRepository.save(newPet);
      const petWithRelations = await this.petsRepository.findOne({
        where: { id: savedPet.id },
        relations: ['breed'],
      });
      if (!petWithRelations) {
        return {
          success: false,
          error: {
            message: 'Failed to retrieve saved pet',
            code: 'RETRIEVE_PET_ERROR',
          },
        };
      }
      return {
        success: true,
        data: petWithRelations,
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          message: 'Failed to create pet',
          code: 'CREATE_PET_ERROR',
          details: error.message,
        },
      };
    }
  }

  async findAll(paginationDto: PaginationDto): Promise<ApiResponse<Pet[]>> {
    try {
      const { page = 1, limit = 10, search } = paginationDto;
      const skip = (page - 1) * limit;

      const queryBuilder = this.petsRepository
        .createQueryBuilder('pet')
        .leftJoinAndSelect('pet.breed', 'breed')
        .orderBy('pet.id', 'DESC')
        .skip(skip)
        .take(limit);

      if (search) {
        queryBuilder.andWhere(
          '(pet.name ILIKE :search OR pet.description ILIKE :search)',
          { search: `%${search}%` },
        );
      }

      const [pets, total] = await queryBuilder.getManyAndCount();
      const totalPages = Math.ceil(total / limit);

      return {
        success: true,
        data: pets,
        pagination: {
          total,
          page,
          limit,
          totalPages,
        },
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          message: 'Failed to retrieve pets',
          code: 'FIND_PETS_ERROR',
          details: error.message,
        },
      };
    }
  }

  async findOne(id: number): Promise<ApiResponse<Pet>> {
    try {
      const pet = await this.petsRepository.findOne({
        where: { id },
        relations: ['breed'],
      });

      if (!pet) {
        return {
          success: false,
          error: {
            message: `Pet with ID ${id} not found`,
            code: 'PET_NOT_FOUND',
          },
        };
      }

      return {
        success: true,
        data: pet,
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          message: 'Failed to retrieve pet',
          code: 'FIND_PET_ERROR',
          details: error.message,
        },
      };
    }
  }

  async update(
    id: number,
    updatePetDto: UpdatePetDto,
    userId?: number,
  ): Promise<ApiResponse<Pet>> {
    try {
      const pet = await this.petsRepository.findOne({
        where: { id },
      });

      if (!pet) {
        return {
          success: false,
          error: {
            message: `Pet with ID ${id} not found`,
            code: 'PET_NOT_FOUND',
          },
        };
      }

      const updatedPet = await this.petsRepository.save({
        ...pet,
        ...updatePetDto,
      });

      return {
        success: true,
        data: updatedPet,
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          message: 'Failed to update pet',
          code: 'UPDATE_PET_ERROR',
          details: error.message,
        },
      };
    }
  }

  async remove(
    id: number,
    userId?: number,
  ): Promise<ApiResponse<{ deleted: boolean }>> {
    try {
      const pet = await this.petsRepository.findOne({
        where: { id },
      });

      if (!pet) {
        return {
          success: false,
          error: {
            message: `Pet with ID ${id} not found`,
            code: 'PET_NOT_FOUND',
          },
        };
      }

      await this.petsRepository.remove(pet);

      return {
        success: true,
        data: { deleted: true },
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          message: 'Failed to delete pet',
          code: 'DELETE_PET_ERROR',
          details: error.message,
        },
      };
    }
  }
}
