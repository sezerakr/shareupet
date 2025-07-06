import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Share } from './entities/share.entity';
import { CreateShareDto } from './dto/create-share.dto';
import { ApiResponse } from 'src/core/interfaces/api-response.interface';

@Injectable()
export class SharesService {
  constructor(
    @InjectRepository(Share)
    private sharesRepository: Repository<Share>,
  ) {}

  async create(
    createShareDto: CreateShareDto,
    userId: number,
  ): Promise<ApiResponse<Share>> {
    try {
      const { postId } = createShareDto;
      const newShare = this.sharesRepository.create({
        user: { id: userId },
        post: { id: postId },
      });

      const savedShare = await this.sharesRepository.save(newShare);
      return { success: true, data: savedShare };
    } catch (error) {
      return {
        success: false,
        error: {
          message: 'Failed to create share',
          details: error.message,
        },
      };
    }
  }
}
