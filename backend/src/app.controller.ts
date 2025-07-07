import { Controller, Get, Post, UseGuards, Body, Res, Req } from '@nestjs/common';
import { Response, Request } from 'express';
import { RequestUser } from './common/interfaces/request-user.interface';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { GoogleAuthGuard } from './auth/google-auth.guard';
import { AuthService } from './auth/auth.service';
import { ApiBody, ApiOperation, ApiResponse, ApiTags, ApiOAuth2, ApiExcludeEndpoint, ApiBearerAuth } from '@nestjs/swagger';
import { LoginDto } from './auth/dto/login.dto';
import { Public } from './auth/route.public';

@ApiTags('auth')
@Controller()
export class AppController {
  constructor(private authService: AuthService) { }

  @Public()
  @ApiOperation({ summary: 'User authentication with username/password' })
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
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid credentials' })
  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Req() req: Request) {
    const result = await this.authService.login(req.user as RequestUser);
    return result;
  }

  @Public()
  @ApiOperation({
    summary: 'Start Google OAuth2 authentication flow',
    description: 'Redirects to Google login page for authentication'
  })
  @ApiOAuth2(['email', 'profile'])
  @ApiResponse({
    status: 302,
    description: 'Redirects to Google authentication page'
  })
  @Get('auth/google')
  @UseGuards(GoogleAuthGuard)
  googleAuth() {
    // Passport takes care of the redirect
  }

  @Public()
  @ApiExcludeEndpoint()
  @Get('auth/google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleAuthCallback(@Req() req: Request, @Res() res: Response) {
    const token = await this.authService.login(req.user as RequestUser);

    const isSwagger = !!req.query.state || req.query.swagger === 'true';

    res.cookie('auth_token', token.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Only use secure in production
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      path: '/',
      sameSite: 'lax'
    });

    if (isSwagger) {
      const redirectUrl = `/api/oauth2-redirect.html#` +
        `access_token=${encodeURIComponent(token.access_token)}` +
        `&token_type=Bearer` +
        `&expires_in=86400` +
        (req.query.state ? `&state=${encodeURIComponent(req.query.state as string)}` : '');

      return res.redirect(redirectUrl);
    } else {
      return res.redirect(`http://localhost:3000/login?token=${token.access_token}`);
    }
  }

  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({ status: 200, description: 'Return authenticated user information' })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  getProfile(@Req() req: Request) {
    const user = req.user as RequestUser;

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
