import {
  Controller,
  Post,
  Body,
  UseGuards,
  Patch,
  Param,
  HttpStatus,
  HttpException,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RolesPermissionsGuard } from 'src/core/guards/roles-permissions.guard';
import { Roles } from 'src/core/decorators/roles.decorator';
import { Role } from 'src/core/enums/role.enum';
import { ApiResponse } from 'src/core/interfaces/api-response.interface';
import { User } from './entities/user.entity';
import { Public } from 'src/auth/route.public';
import { GetUserDto } from './dto/get-user.dto';
import { Permissions } from 'src/core/decorators/permissions.decorator';
import { UserPermissions } from 'src/core/enums/userpermissions.enum';
import { RequestUser } from 'src/common/interfaces/request-user.interface';
import { Request } from 'express';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  

  @UseGuards(RolesPermissionsGuard)
  @Roles(Role.ADMIN)
  @Permissions(UserPermissions.EditUsers)
  @Patch(':id/admin')
  async updateAdmin(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<ApiResponse<User>> {
    const response = await this.usersService.update(+id, updateUserDto);
    if (!response.success) {
      throw new HttpException(response.error, HttpStatus.BAD_REQUEST);
    }
    return response;
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: Request,
  ): Promise<ApiResponse<User>> {
    const currentUser = req.user as RequestUser;
    const userPermissions =
      currentUser.permissions ||
      this.usersService.getDefaultPermissions(currentUser.role);
    const isAdmin = currentUser.role === Role.ADMIN;
    const hasEditPermission = userPermissions.includes(
      UserPermissions.EditUsers,
    );
    const isUpdatingOwnAccount = currentUser.userId === +id;

    if (!isAdmin && !hasEditPermission && !isUpdatingOwnAccount) {
      throw new HttpException('Unauthorized', HttpStatus.FORBIDDEN);
    }

    if (isUpdatingOwnAccount && !isAdmin && !hasEditPermission) {
      const allowedFields = [
        'username',
        'displayName',
        'password',
        'avatar',
        'birthdate',
      ];
      const filteredUpdateDto: UpdateUserDto = Object.keys(updateUserDto)
        .filter((key) => allowedFields.includes(key))
        .reduce((obj: UpdateUserDto, key) => {
          obj[key] = updateUserDto[key];
          return obj;
        }, {});

      updateUserDto = filteredUpdateDto;
    }

    const response = await this.usersService.update(+id, updateUserDto);
    if (!response.success) {
      throw new HttpException(response.error, HttpStatus.BAD_REQUEST);
    }
    return response;
  }
}
