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
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
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

@ApiTags('comments')
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @ApiOperation({ summary: 'Create a new comment' })
  @ApiResponse({ status: 201, description: 'Comment successfully created' })
  @ApiBody({ type: CreateCommentDto })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createCommentDto: CreateCommentDto, @Req() req: Request) {
    const user = req.user as RequestUser;
    return this.commentsService.create(createCommentDto, user.userId);
  }

  @ApiOperation({ summary: 'Get all comments (optionally by post ID)' })
  @ApiResponse({ status: 200, description: 'Return all comments' })
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
    name: 'postId',
    required: false,
    type: Number,
    description: 'Filter comments by post ID',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Search keyword for comment content',
  })
  @Public()
  @Get()
  findAll(
    @Query() paginationDto: PaginationDto,
    @Query('postId') postId?: number,
  ) {
    return this.commentsService.findAll(paginationDto, postId);
  }

  @ApiOperation({ summary: 'Get a comment by ID' })
  @ApiResponse({ status: 200, description: 'Return a comment by ID' })
  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commentsService.findOne(+id);
  }

  @ApiOperation({ summary: 'Update a comment' })
  @ApiResponse({ status: 200, description: 'Comment successfully updated' })
  @ApiBody({ type: UpdateCommentDto })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateCommentDto,
    @Req() req: Request,
  ) {
    const user = req.user as RequestUser;
    return this.commentsService.update(+id, updateCommentDto, user.userId);
  }

  @ApiOperation({ summary: 'Delete a comment' })
  @ApiResponse({ status: 200, description: 'Comment successfully deleted' })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: Request) {
    const user = req.user as RequestUser;
    return this.commentsService.remove(+id, user.userId);
  }
}
