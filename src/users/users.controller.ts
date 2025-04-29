import { Controller, Post, Body, UseGuards, Patch, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LocalAuthGuard } from 'src/auth/local-auth.guard';
import { RolesPermissionsGuard } from 'src/core/guards/roles-permissions.guard';
import { Roles } from 'src/core/decorators/roles.decorator';
import { Role } from 'src/core/enums/role.enum';
import { Permission } from 'src/core/enums/permission.enum';
import { Permissions } from 'src/core/decorators/permissions.decorator';

@Controller('users')
@UseGuards(LocalAuthGuard, RolesPermissionsGuard)
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Post('register')
    async register(@Body() createUserDto: CreateUserDto) {
        const user = await this.usersService.create(createUserDto);
        return {
            id: user.id,
            username: user.username,
            role: user.role,
        };
    }

    @Post()
    @Patch(':id')
    @Roles(Role.ADMIN)
    @Permissions(Permission.ManageUsers)
    async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        return this.usersService.update(+id, updateUserDto);
    }

    @Post()
    @Patch(':userId')
    @Roles(Role.ADMIN)
    async setAdmin(@Param('userId') userId: string) {
        return this.usersService.setAdmin(+userId);
    }
}