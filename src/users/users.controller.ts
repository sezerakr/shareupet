import { Controller, Post, Body, UseGuards, Patch, Param, HttpStatus, HttpException } from '@nestjs/common';
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
        console.log('Registering user:', createUserDto);
        const response = await this.usersService.create(createUserDto);
        if (!response.success) {
            throw new HttpException(response.error, HttpStatus.BAD_REQUEST);
        }
        return response;
    }

    @Patch(':id')
    @Roles(Role.ADMIN)
    @Permissions(Permission.ManageUsers)
    async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<ApiResponse<User>> {
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