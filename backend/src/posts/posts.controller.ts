import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiQuery,
} from '@nestjs/swagger';
import { Public } from 'src/auth/route.public';
import { PaginationDto } from 'src/core/dto/pagination.dto';
import { RequestUser } from 'src/common/interfaces/request-user.interface';
import { Request } from 'express';

@ApiTags('posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @ApiOperation({ summary: 'Create a new post' })
  @ApiResponse({ status: 201, description: 'Post successfully created' })
  @ApiBody({ type: CreatePostDto })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createPostDto: CreatePostDto, @Req() req: Request) {
    const user = req.user as RequestUser;
    return this.postsService.create(createPostDto, user.userId);
  }

  @ApiOperation({ summary: 'Get all posts' })
  @ApiResponse({ status: 200, description: 'Return all posts' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number (starts from 1)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Search keyword for post title or content',
  })
  @Public()
  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.postsService.findAll(paginationDto);
  }

  @ApiOperation({ summary: 'Get a post by ID' })
  @ApiResponse({ status: 200, description: 'Return a post by ID' })
  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(+id);
  }

  @ApiOperation({ summary: 'Update a post' })
  @ApiResponse({ status: 200, description: 'Post successfully updated' })
  @ApiBody({ type: UpdatePostDto })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
    @Req() req: Request,
  ) {
    const user = req.user as RequestUser;
    return this.postsService.update(+id, updatePostDto, user.userId);
  }

  @ApiOperation({ summary: 'Delete a post' })
  @ApiResponse({ status: 200, description: 'Post successfully deleted' })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: Request) {
    const user = req.user as RequestUser;
    return this.postsService.remove(+id, user.userId);
  }
}
