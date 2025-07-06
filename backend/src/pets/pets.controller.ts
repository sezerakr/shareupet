import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  Req,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { PetsService } from './pets.service';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Public } from 'src/auth/route.public';
import { PaginationDto } from '../core/dto/pagination.dto';
import { Role } from 'src/core/enums/role.enum';
import { UserPermissions } from 'src/core/enums/userpermissions.enum';
import { RolesPermissionsGuard } from 'src/core/guards/roles-permissions.guard';
import { Roles } from 'src/core/decorators/roles.decorator';
import { Permissions } from 'src/core/decorators/permissions.decorator';

@ApiTags('pets')
@Controller('pets')
export class PetsController {
  constructor(private readonly petsService: PetsService) {}

  @ApiOperation({ summary: 'Create a new pet' })
  @ApiResponse({ status: 201, description: 'Pet successfully created' })
  @ApiBody({ type: CreatePetDto })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createPetDto: CreatePetDto, @Req() req: Request) {
    const user = req.user as RequestUser;
    return this.petsService.create(createPetDto, user.userId);
  }

  @ApiOperation({ summary: 'Get all pets' })
  @ApiResponse({ status: 200, description: 'Return all pets' })
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
  @Public()
  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.petsService.findAll(paginationDto);
  }

  @ApiOperation({ summary: 'Get a pet by ID' })
  @ApiResponse({ status: 200, description: 'Return a pet by ID' })
  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.petsService.findOne(+id);
  }

  @ApiOperation({ summary: 'Update a pet' })
  @ApiResponse({ status: 200, description: 'Pet successfully updated' })
  @ApiBody({ type: UpdatePetDto })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, RolesPermissionsGuard)
  @Roles(Role.ADMIN)
  @Permissions(UserPermissions.EditPets)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePetDto: UpdatePetDto,
    @Req() req: Request,
  ) {
    const currentUser = req.user as RequestUser;
    const petResponse = await this.petsService.findOne(+id);

    if (!petResponse.success || !petResponse.data) {
      throw new HttpException('Pet not found', HttpStatus.NOT_FOUND);
    }

    const petOwnerId = petResponse.data.creatorId;
    const isUpdatingOwnPet = currentUser.userId === petOwnerId;
    const isAdmin = currentUser.role === Role.ADMIN;
    const hasEditPermission = currentUser.permissions?.includes(
      UserPermissions.EditPets,
    );

    // Skip permission check if user is creator of the pet
    if (!isAdmin && !hasEditPermission && !isUpdatingOwnPet) {
      throw new HttpException('Unauthorized', HttpStatus.FORBIDDEN);
    }

    return this.petsService.update(+id, updatePetDto, currentUser.userId);
  }

  @ApiOperation({ summary: 'Delete a pet' })
  @ApiResponse({ status: 200, description: 'Pet successfully deleted' })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, RolesPermissionsGuard)
  @Roles(Role.ADMIN)
  @Permissions(UserPermissions.DeletePets)
  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: Request) {
    const currentUser = req.user as RequestUser;
    const petResponse = await this.petsService.findOne(+id);

    if (!petResponse.success || !petResponse.data) {
      throw new HttpException('Pet not found', HttpStatus.NOT_FOUND);
    }

    const petOwnerId = petResponse.data.creatorId;
    const isDeletingOwnPet = currentUser.userId === petOwnerId;
    const isAdmin = currentUser.role === Role.ADMIN;
    const hasDeletePermission = currentUser.permissions?.includes(
      UserPermissions.DeletePets,
    );

    if (!isAdmin && !hasDeletePermission && !isDeletingOwnPet) {
      throw new HttpException('Unauthorized', HttpStatus.FORBIDDEN);
    }

    return this.petsService.remove(+id, currentUser.userId);
  }
}
