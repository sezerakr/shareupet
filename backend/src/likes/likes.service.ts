import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Like } from './entities/like.entity';
import { CreateLikeDto } from './dto/create-like.dto';
import { ApiResponse } from 'src/core/interfaces/api-response.interface';

@Injectable()
export class LikesService {
  constructor(
    @InjectRepository(Like)
    private likesRepository: Repository<Like>,
  ) {}

  async create(
    createLikeDto: CreateLikeDto,
    userId: number,
  ): Promise<ApiResponse<Like>> {
    try {
      const { postId } = createLikeDto;
      const existingLike = await this.likesRepository.findOne({
        where: { user: { id: userId }, post: { id: postId } },
      });

      if (existingLike) {
        return {
          success: false,
          error: { message: 'User already liked this post' },
        };
      }

      const newLike = this.likesRepository.create({
        user: { id: userId },
        post: { id: postId },
      });

      const savedLike = await this.likesRepository.save(newLike);
      return { success: true, data: savedLike };
    } catch (error) {
      return {
        success: false,
        error: {
          message: 'Failed to create like',
          details: error.message,
        },
      };
    }
  }

  async remove(
    postId: number,
    userId: number,
  ): Promise<ApiResponse<{ deleted: boolean }>> {
    try {
      const like = await this.likesRepository.findOne({
        where: { user: { id: userId }, post: { id: postId } },
      });

      if (!like) {
        return { success: false, error: { message: 'Like not found' } };
      }

      await this.likesRepository.remove(like);
      return { success: true, data: { deleted: true } };
    } catch (error) {
      return {
        success: false,
        error: {
          message: 'Failed to delete like',
          details: error.message,
        },
      };
    }
  }
}
