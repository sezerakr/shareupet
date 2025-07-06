import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { ApiResponse } from 'src/core/interfaces/api-response.interface';
import { PaginationDto } from 'src/core/dto/pagination.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,
  ) {}

  async create(
    createCommentDto: CreateCommentDto,
    userId: number,
  ): Promise<ApiResponse<Comment>> {
    try {
      const { postId, ...commentData } = createCommentDto;
      const newComment = this.commentsRepository.create({
        ...commentData,
        author: { id: userId },
        post: { id: postId },
      });

      const savedComment = await this.commentsRepository.save(newComment);
      return { success: true, data: savedComment };
    } catch (error: any) {
      return {
        success: false,
        error: { message: 'Failed to create comment', details: error.message },
      };
    }
  }

  async findAll(
    paginationDto: PaginationDto,
    postId?: number,
  ): Promise<ApiResponse<Comment[]>> {
    try {
      const { page = 1, limit = 10, search } = paginationDto;
      const skip = (page - 1) * limit;

      const queryBuilder = this.commentsRepository
        .createQueryBuilder('comment')
        .leftJoinAndSelect('comment.author', 'author')
        .leftJoinAndSelect('comment.post', 'post')
        .orderBy('comment.created_at', 'DESC')
        .skip(skip)
        .take(limit);

      if (postId) {
        queryBuilder.andWhere('comment.postId = :postId', { postId });
      }

      if (search) {
        queryBuilder.andWhere('comment.content ILIKE :search', {
          search: `%${search}%`,
        });
      }

      const [comments, total] = await queryBuilder.getManyAndCount();
      const totalPages = Math.ceil(total / limit);

      return {
        success: true,
        data: comments,
        pagination: { total, page, limit, totalPages },
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          message: 'Failed to retrieve comments',
          details: error.message,
        },
      };
    }
  }

  async findOne(id: number): Promise<ApiResponse<Comment>> {
    try {
      const comment = await this.commentsRepository.findOne({
        where: { id },
        relations: ['author', 'post'],
      });
      if (!comment) {
        return {
          success: false,
          error: { message: `Comment with ID ${id} not found` },
        };
      }
      return { success: true, data: comment };
    } catch (error: any) {
      return {
        success: false,
        error: {
          message: 'Failed to retrieve comment',
          details: error.message,
        },
      };
    }
  }

  async update(
    id: number,
    updateCommentDto: UpdateCommentDto,
    userId: number,
  ): Promise<ApiResponse<Comment>> {
    try {
      const comment = await this.commentsRepository.findOne({
        where: { id, author: { id: userId } },
      });
      if (!comment) {
        return {
          success: false,
          error: {
            message: `Comment with ID ${id} not found or you don't have permission to edit it`,
          },
        };
      }

      const updatedComment = await this.commentsRepository.save({
        ...comment,
        ...updateCommentDto,
      });
      return { success: true, data: updatedComment };
    } catch (error: any) {
      return {
        success: false,
        error: { message: 'Failed to update comment', details: error.message },
      };
    }
  }

  async remove(
    id: number,
    userId: number,
  ): Promise<ApiResponse<{ deleted: boolean }>> {
    try {
      const comment = await this.commentsRepository.findOne({
        where: { id, author: { id: userId } },
      });
      if (!comment) {
        return {
          success: false,
          error: {
            message: `Comment with ID ${id} not found or you don't have permission to delete it`,
          },
        };
      }

      await this.commentsRepository.remove(comment);
      return { success: true, data: { deleted: true } };
    } catch (error: any) {
      return {
        success: false,
        error: { message: 'Failed to delete comment', details: error.message },
      };
    }
  }
}
