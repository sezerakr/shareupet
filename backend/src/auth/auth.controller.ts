import { Controller, Post, Body, UseGuards, Req, HttpStatus, HttpException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { Public } from './route.public';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { ApiResponse } from 'src/core/interfaces/api-response.interface';
import { GetUserDto } from 'src/users/dto/get-user.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Public()
  @Post('register')
  async register(
    @Body() createUserDto: CreateUserDto,
  ): Promise<ApiResponse<GetUserDto>> {
    const response = await this.usersService.create(createUserDto);
    if (!response.success) {
      throw new HttpException(response.error, HttpStatus.BAD_REQUEST);
    }
    return response;
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req: any) {
    return this.authService.login(req.user);
  }
}
