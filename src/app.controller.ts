import { Controller, Get, Post, UseGuards, Request, Body, Res } from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { GoogleAuthGuard } from './auth/google-auth.guard';
import { AuthService } from './auth/auth.service';
import { ApiBody, ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './auth/dto/login.dto';
import { Public } from './auth/route.public';

@ApiTags('auth')
@Controller()
export class AppController {
  constructor(private authService: AuthService) { }

  @Public()
  @ApiOperation({ summary: 'User authentication' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'Returns JWT token on successful login',
    schema: {
      type: 'object',
      properties: {
        access_token: {
          type: 'string',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
      },
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid credentials' })
  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req, @Body() loginDto: LoginDto) {
    return this.authService.login(req.user);
  }

  @Public()
  @Get('auth/google')
  @UseGuards(GoogleAuthGuard)
  async googleAuth() {
    // Initiates the Google OAuth2 login flow
  }

  @Public()
  @Get('auth/google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleAuthCallback(@Request() req, @Res() res: Response) {
    // After Google authentication
    const token = await this.authService.login(req.user);

    // Redirect to frontend with token, or return the token directly
    // For demonstration, we'll redirect to a frontend URL with the token
    return res.redirect(`http://localhost:4200/login?token=${token.access_token}`);
  }

  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({ status: 200, description: 'Return authenticated user information' })
  @ApiHeader({
    name: 'Authorization',
    description: 'JWT Bearer token',
    required: true,
    schema: { type: 'string', example: 'Bearer eyJhbGciOiJIUzI...' }
  })
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    const user = req.user;
    if (!user) {
      return {
        success: false,
        error: {
          message: 'User profile not found',
          code: 'USER_NOT_FOUND',
        }
      };
    }
    return {
      success: true,
      data: user
    };
  }
}