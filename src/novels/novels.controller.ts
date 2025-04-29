import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { NovelsService } from './novels.service';
import { CreateNovelDto } from './dto/create-novel.dto';
import { UpdateNovelDto } from './dto/update-novel.dto';
import { Public } from 'src/auth/route.public';

@Controller('novels')
export class NovelsController {
  constructor(private readonly novelsService: NovelsService) { }

  @Post()
  create(@Body() createNovelDto: CreateNovelDto) {
    return this.novelsService.create(createNovelDto);
  }

  @Get('featured')
  findFeatured() {
    return this.novelsService.findFeatured();
  }

  @Get()
  @Public()
  findAll() {
    return this.novelsService.findAll();
  }

  @Get(':title')
  findOne(@Param('title') title: string) {
    var novel = this.novelsService.findOne(title);
    if (!novel) {
      return {
        statusCode: 404,
        message: 'Novel not found',
        error: 'Not Found',
      };
    }
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateNovelDto: UpdateNovelDto) {
    return this.novelsService.update(id, updateNovelDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.novelsService.remove(id);
  }
}
