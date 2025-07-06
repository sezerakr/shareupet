import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Patch,
  Param,
} from '@nestjs/common';
import { RehomingService } from './rehoming.service';
import { CreateRehomingDto } from './dto/create-rehoming.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBody,
} from '@nestjs/swagger';
import { RolesPermissionsGuard } from 'src/core/guards/roles-permissions.guard';
import { Roles } from 'src/core/decorators/roles.decorator';
import { Role } from 'src/core/enums/role.enum';
import { RequestUser } from 'src/common/interfaces/request-user.interface';
import { Request } from 'express';

@ApiTags('rehoming')
@Controller('rehoming')
export class RehomingController {
  constructor(private readonly rehomingService: RehomingService) {}

  @ApiOperation({ summary: 'Create a new rehoming request' })
  @ApiResponse({
    status: 201,
    description: 'Rehoming request successfully created',
  })
  @ApiBody({ type: CreateRehomingDto })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createRehomingDto: CreateRehomingDto, @Req() req: Request) {
    const user = req.user as RequestUser;
    return this.rehomingService.create(createRehomingDto, user.userId);
  }

  @ApiOperation({ summary: 'Approve a rehoming request (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Rehoming request successfully approved',
  })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, RolesPermissionsGuard)
  @Roles(Role.ADMIN)
  @Patch(':id/approve')
  approve(@Param('id') id: string) {
    return this.rehomingService.approve(+id);
  }
}
