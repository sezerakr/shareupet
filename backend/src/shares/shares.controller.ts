import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { SharesService } from './shares.service';
import { CreateShareDto } from './dto/create-share.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBody,
} from '@nestjs/swagger';
import { RequestUser } from 'src/common/interfaces/request-user.interface';
import { Request } from 'express';

@ApiTags('shares')
@Controller('shares')
export class SharesController {
  constructor(private readonly sharesService: SharesService) {}

  @ApiOperation({ summary: 'Share a post' })
  @ApiResponse({ status: 201, description: 'Post successfully shared' })
  @ApiBody({ type: CreateShareDto })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createShareDto: CreateShareDto, @Req() req: Request) {
    const user = req.user as RequestUser;
    return this.sharesService.create(createShareDto, user.userId);
  }
}
