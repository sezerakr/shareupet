import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
  Req,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { BreedsService } from './breeds.service';
import { CreateBreedDto } from './dto/create-breed.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PaginationDto } from 'src/core/dto/pagination.dto';
import { Public } from 'src/auth/route.public';
import { PetType } from 'src/core/enums/pettype.enum';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserPermissions } from 'src/core/enums/userpermissions.enum';
import { Role } from 'src/core/enums/role.enum';
import { UsersService } from 'src/users/users.service';
import { RequestUser } from 'src/common/interfaces/request-user.interface';
import { Request } from 'express';

@ApiTags('breeds')
@Controller('breeds')
export class BreedsController {
  constructor(
    private readonly breedsService: BreedsService,
    private readonly usersService: UsersService,
  ) {}

  @ApiOperation({ summary: 'Create a new breed' })
  @ApiResponse({ status: 201, description: 'breed successfully created' })
  @ApiBody({ type: CreateBreedDto })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  create(@Body() createBreedDto: CreateBreedDto, @Req() req: Request) {
    const currentUser = req.user as RequestUser;
    const userPermissions =
      currentUser.permissions ||
      this.usersService.getDefaultPermissions(currentUser.role);
    const isAdmin = currentUser.role === Role.ADMIN;

    if (!isAdmin && !userPermissions.includes(UserPermissions.CreateBreeds)) {
      throw new HttpException(
        'Unauthorized - Insufficient permissions',
        HttpStatus.FORBIDDEN,
      );
    }

    return this.breedsService.create(createBreedDto);
  }

  @Public()
  @ApiOperation({ summary: 'Get all breeds' })
  @ApiQuery({ name: 'petType', required: false, enum: PetType })
  @Get()
  findAll(
    @Query() paginationDto: PaginationDto,
    @Query('petType') petType?: PetType,
  ) {
    if (petType) {
      return this.breedsService.findByPetType(petType, paginationDto);
    }
    return this.breedsService.findAll(paginationDto);
  }
}
