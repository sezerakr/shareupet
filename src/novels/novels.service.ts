import { Injectable } from '@nestjs/common';
import { CreateNovelDto } from './dto/create-novel.dto';
import { UpdateNovelDto } from './dto/update-novel.dto';
import { Novel } from './entities/novel.entity';
import { randomUUID } from 'crypto';

@Injectable()
export class NovelsService {

  private novels: Novel[] = [];
  constructor() {
    const now = new Date();
    const userId = randomUUID();
    this.novels = this.novels = [
      {
        id: randomUUID(),
        title: 'The Great Adventure',
        description: 'A thrilling journey through unknown lands',
        cover: 'https://example.com/covers/great-adventure.jpg',
        author_id: userId,
        is_published: true,
        is_featured: true,
        is_free: false,
        is_completed: true,
        is_deleted: false,
        published_at: now,
        completed_at: now,
        created_at: now,
        updated_at: now,
        deleted_at: null,
        created_by: userId,
        updated_by: userId,
        deleted_by: null
      },
      {
        id: randomUUID(),
        title: 'Mystery of the Ancient Ruins',
        description: 'Archaeologists discover secrets of a lost civilization',
        cover: 'https://example.com/covers/ancient-ruins.jpg',
        author_id: userId,
        is_published: true,
        is_featured: false,
        is_free: true,
        is_completed: false,
        is_deleted: false,
        published_at: now,
        completed_at: null,
        created_at: now,
        updated_at: now,
        deleted_at: null,
        created_by: userId,
        updated_by: userId,
        deleted_by: null
      },
      {
        id: randomUUID(),
        title: 'The Last Kingdom',
        description: 'Epic fantasy tale of kingdoms at war',
        cover: 'https://example.com/covers/last-kingdom.jpg',
        author_id: userId,
        is_published: true,
        is_featured: true,
        is_free: false,
        is_completed: false,
        is_deleted: false,
        published_at: now,
        completed_at: null,
        created_at: now,
        updated_at: now,
        deleted_at: null,
        created_by: userId,
        updated_by: userId,
        deleted_by: null
      }
    ];
  }


  findFeatured() {
    return this.novels.filter(novel => novel.is_featured && novel.is_published);
  }

  create(createNovelDto: CreateNovelDto) {
    const now = new Date();
    const userId = randomUUID();

    const newNovel: Novel = {
      id: randomUUID(),
      ...createNovelDto,
      author_id: userId, // In a real app, this would come from authentication
      is_published: false,
      is_featured: false,
      is_free: false,
      is_completed: false,
      is_deleted: false,
      published_at: null,
      completed_at: null,
      created_at: now,
      updated_at: now,
      deleted_at: null,
      created_by: userId,
      updated_by: userId,
      deleted_by: null
    };

    this.novels.push(newNovel);
    return newNovel;
  }

  findAll() {
    return this.novels.filter(novel => !novel.is_deleted);
  }

  findOne(title: string) {
    return this.novels.find(novel => novel.title === title && !novel.is_deleted && novel.is_published);
  }

  update(id: string, updateNovelDto: UpdateNovelDto) {
    const novelIndex = this.novels.findIndex(novel => novel.id === id && !novel.is_deleted);
    if (novelIndex === -1) {
      throw new Error(`Novel with id ${id} not found`);
    }

    const userId = randomUUID();
    const updatedNovel = {
      ...this.novels[novelIndex],
      ...updateNovelDto,
      updated_at: new Date(),
      updated_by: userId
    };

    this.novels[novelIndex] = updatedNovel;
    return updatedNovel;
  }

  remove(id: string) {
    const novelIndex = this.novels.findIndex(novel => novel.id === id && !novel.is_deleted);
    if (novelIndex === -1) {
      throw new Error(`Novel with id ${id} not found`);
    }

    const userId = randomUUID();
    this.novels[novelIndex] = {
      ...this.novels[novelIndex],
      is_deleted: true,
      deleted_at: new Date(),
      deleted_by: userId
    };

    return { message: `Novel with id ${id} has been removed` };
  }
}
