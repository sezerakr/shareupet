import { Controller, Post, Body, UseGuards, Patch, Param, HttpStatus, HttpException, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LocalAuthGuard } from 'src/auth/local-auth.guard';
import { RolesPermissionsGuard } from 'src/core/guards/roles-permissions.guard';
import { Roles } from 'src/core/decorators/roles.decorator';
import { Role } from 'src/core/enums/role.enum';
import { Permission } from 'src/core/enums/permission.enum';
import { Permissions } from 'src/core/decorators/permissions.decorator';
import { ApiResponse } from 'src/core/interfaces/api-response.interface';
import { User } from './entities/user.entity';
import { Public } from 'src/auth/route.public';
import { GetUserDto } from './dto/get-user.dto';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Public()
    @Post('register')
    async register(@Body() createUserDto: CreateUserDto): Promise<ApiResponse<GetUserDto>> {
        const response = await this.usersService.create(createUserDto);
        if (!response.success) {
            throw new HttpException(response.error, HttpStatus.BAD_REQUEST);
        }
        return response;
    }

    @Patch(':id')
    async update(
        @Param('id') id: string,
        @Body() updateUserDto: UpdateUserDto,
        @Req() req
    ): Promise<ApiResponse<User>> {
        const currentUser = req.user;
        const isAdmin = currentUser.role === Role.ADMIN;
        const hasEditPermission = currentUser.permissions && currentUser.permissions.includes(Permission.EditUsers);
        const isUpdatingOwnAccount = currentUser.userId === +id;

        if (!isAdmin && !hasEditPermission && !isUpdatingOwnAccount) {
            throw new HttpException('Unauthorized', HttpStatus.FORBIDDEN);
        }

        if (isUpdatingOwnAccount && !isAdmin && !hasEditPermission) {
            const allowedFields = ['username', 'displayName', 'password', 'avatar', 'birthdate'];
            const filteredUpdateDto = Object.keys(updateUserDto)
                .filter(key => allowedFields.includes(key))
                .reduce((obj, key) => {
                    obj[key] = updateUserDto[key];
                    return obj;
                }, {});

            updateUserDto = filteredUpdateDto as UpdateUserDto;
        }

        const response = await this.usersService.update(+id, updateUserDto);
        if (!response.success) {
            throw new HttpException(response.error, HttpStatus.BAD_REQUEST);
        }
        return response;
    }

    @Patch(':userId/set-admin')
    @Roles(Role.ADMIN)
    async setAdmin(@Param('userId') userId: string): Promise<ApiResponse<User>> {
        const response = await this.usersService.setAdmin(+userId);
        if (!response.success) {
            throw new HttpException(response.error, HttpStatus.BAD_REQUEST);
        }
        return response;
    }
}