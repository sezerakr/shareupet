import { Controller, Get, Post, UseGuards, Request, Body, Res } from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { GoogleAuthGuard } from './auth/google-auth.guard';
import { AuthService } from './auth/auth.service';
import { ApiBody, ApiHeader, ApiOperation, ApiResponse, ApiTags, ApiOAuth2, ApiExcludeEndpoint, ApiSecurity } from '@nestjs/swagger';
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
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid credentials' })
  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req, @Body() loginDto: LoginDto) {
    return this.authService.login(req.user);
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
  async googleAuth() {
    // Passport takes care of the redirect
  }

  @Public()
  @ApiExcludeEndpoint()
  @Get('auth/google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleAuthCallback(@Request() req, @Res() res: Response) {
    const token = await this.authService.login(req.user);

    // Look for state parameter which is always present in Swagger OAuth requests
    // You can see it in your logs: state: 'V2VkIEFwciAzMCAyMDI1IDAzOjI5OjE0IEdNVCswMzAwIChHTVQrMDM6MDAp'
    const isSwagger = !!req.query.state || req.query.swagger === 'true';

    console.log('Google callback handler', {
      isSwagger,
      state: req.query.state,
      referer: req.headers.referer || 'none'
    });

    if (isSwagger) {
      // Format for Swagger UI's oauth2-redirect.html
      const redirectUrl = `/api/oauth2-redirect.html#` +
        `access_token=${encodeURIComponent(token.access_token)}` +
        `&token_type=Bearer` +
        `&expires_in=86400` +
        (req.query.state ? `&state=${encodeURIComponent(req.query.state)}` : '');

      console.log(`Redirecting to Swagger: ${redirectUrl}`);
      return res.redirect(redirectUrl);
    } else {
      console.log('Redirecting to frontend login');
      return res.redirect(`http://localhost:3000/login?token=${token.access_token}`);
    }
  }

  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({ status: 200, description: 'Return authenticated user information' })
  @ApiSecurity('oauth2', ['email', 'profile'])
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    console.log('Profile request auth header:', req.headers.authorization?.substring(0, 20) + '...');

    const user = req.user;
    console.log('User profile:', user);
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