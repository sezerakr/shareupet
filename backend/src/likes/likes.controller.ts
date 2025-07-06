import {
  Controller,
  Post,
  Param,
  Delete,
  UseGuards,
  Req,
  Body,
} from '@nestjs/common';
import { LikesService } from './likes.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBody,
} from '@nestjs/swagger';
import { CreateLikeDto } from './dto/create-like.dto';
import { RequestUser } from 'src/common/interfaces/request-user.interface';
import { Request } from 'express';

@ApiTags('likes')
@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @ApiOperation({ summary: 'Like a post' })
  @ApiResponse({ status: 201, description: 'Post successfully liked' })
  @ApiBody({ type: CreateLikeDto })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createLikeDto: CreateLikeDto, @Req() req: Request) {
    const user = req.user as RequestUser;
    return this.likesService.create(createLikeDto, user.userId);
  }

  @ApiOperation({ summary: 'Unlike a post' })
  @ApiResponse({ status: 200, description: 'Post successfully unliked' })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Delete(':postId')
  remove(@Param('postId') postId: string, @Req() req: Request) {
    const user = req.user as RequestUser;
    return this.likesService.remove(+postId, user.userId);
  }
}
