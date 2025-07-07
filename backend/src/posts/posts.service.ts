import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { ApiResponse } from 'src/core/interfaces/api-response.interface';
import { PaginationDto } from 'src/core/dto/pagination.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
  ) { }

  async create(
    createPostDto: CreatePostDto,
    userId: number,
  ): Promise<ApiResponse<Post>> {
    try {
      const { petId, ...postData } = createPostDto;
      const newPost = this.postsRepository.create({
        ...postData,
        author: { id: userId },
        pet: petId ? { id: petId } : undefined,
      });

      const savedPost = await this.postsRepository.save(newPost);
      return { success: true, data: savedPost };
    } catch (error: any) {
      return {
        success: false,
        error: { message: 'Failed to create post', details: error.message },
      };
    }
  }

  async findAll(paginationDto: PaginationDto): Promise<ApiResponse<Post[]>> {
    try {
      const { page = 1, limit = 10, search } = paginationDto;
      const skip = (page - 1) * limit;

      const queryBuilder = this.postsRepository
        .createQueryBuilder('post')
        .leftJoinAndSelect('post.author', 'author')
        .leftJoinAndSelect('post.pet', 'pet')
        .orderBy('post.created_at', 'DESC')
        .skip(skip)
        .take(limit);

      if (search) {
        queryBuilder.andWhere(
          '(post.title ILIKE :search OR post.content ILIKE :search)',
          { search: `%${search}%` },
        );
      }

      const [posts, total] = await queryBuilder.getManyAndCount();
      const totalPages = Math.ceil(total / limit);

      return {
        success: true,
        data: posts,
        pagination: { total, page, limit, totalPages },
      };
    } catch (error: any) {
      return {
        success: false,
        error: { message: 'Failed to retrieve posts', details: error.message },
      };
    }
  }

  async findOne(id: number): Promise<ApiResponse<Post>> {
    try {
      const post = await this.postsRepository.findOne({
        where: { id },
        relations: ['author', 'pet', 'comments', 'likes', 'shares'],
      });
      if (!post) {
        return {
          success: false,
          error: { message: `Post with ID ${id} not found` },
        };
      }
      return { success: true, data: post };
    } catch (error: any) {
      return {
        success: false,
        error: { message: 'Failed to retrieve post', details: error.message },
      };
    }
  }

  async update(
    id: number,
    updatePostDto: UpdatePostDto,
    userId: number,
  ): Promise<ApiResponse<Post>> {
    try {
      const post = await this.postsRepository.findOne({
        where: { id, author: { id: userId } },
      });
      if (!post) {
        return {
          success: false,
          error: {
            message: `Post with ID ${id} not found or you don't have permission to edit it`,
          },
        };
      }

      const updatedPost = await this.postsRepository.save({
        ...post,
        ...updatePostDto,
      });
      return { success: true, data: updatedPost };
    } catch (error: any) {
      return {
        success: false,
        error: { message: 'Failed to update post', details: error.message },
      };
    }
  }

  async remove(
    id: number,
    userId: number,
  ): Promise<ApiResponse<{ deleted: boolean }>> {
    try {
      const post = await this.postsRepository.findOne({
        where: { id, author: { id: userId } },
      });
      if (!post) {
        return {
          success: false,
          error: {
            message: `Post with ID ${id} not found or you don't have permission to delete it`,
          },
        };
      }

      await this.postsRepository.remove(post);
      return { success: true, data: { deleted: true } };
    } catch (error: any) {
      return {
        success: false,
        error: { message: 'Failed to delete post', details: error.message },
      };
    }
  }
}
