import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rehoming } from './entities/rehoming.entity';
import { CreateRehomingDto } from './dto/create-rehoming.dto';
import { ApiResponse } from 'src/core/interfaces/api-response.interface';

@Injectable()
export class RehomingService {
  constructor(
    @InjectRepository(Rehoming)
    private rehomingRepository: Repository<Rehoming>,
  ) {}

  async create(
    createRehomingDto: CreateRehomingDto,
    userId: number,
  ): Promise<ApiResponse<Rehoming>> {
    try {
      const { postId } = createRehomingDto;
      const newRehomingRequest = this.rehomingRepository.create({
        post: { id: postId },
        requestingUser: { id: userId },
      });

      const savedRequest =
        await this.rehomingRepository.save(newRehomingRequest);
      return { success: true, data: savedRequest };
    } catch (error: any) {
      return {
        success: false,
        error: {
          message: 'Failed to create rehoming request',
          details: error.message,
        },
      };
    }
  }

  async approve(id: number): Promise<ApiResponse<Rehoming>> {
    try {
      const rehomingRequest = await this.rehomingRepository.findOne({
        where: { id },
      });
      if (!rehomingRequest) {
        return {
          success: false,
          error: { message: `Rehoming request with ID ${id} not found` },
        };
      }

      rehomingRequest.isApproved = true;
      const updatedRequest =
        await this.rehomingRepository.save(rehomingRequest);
      return { success: true, data: updatedRequest };
    } catch (error: any) {
      return {
        success: false,
        error: {
          message: 'Failed to approve rehoming request',
          details: error.message,
        },
      };
    }
  }
}
