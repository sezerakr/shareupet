import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { randomBytes } from 'crypto';
import { RequestUser } from 'src/common/interfaces/request-user.interface';

interface GoogleUserDto {
  googleId: string;
  email: string;
  displayName: string;
  avatar?: string;
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) { }

  async validateUser(
    email: string,
    pass: string,
  ): Promise<Omit<User, 'password'> | null> {
    const userResponse = await this.usersService.findByEmail(email);

    if (!userResponse.success || !userResponse.data) {
      return null;
    }

    const user = userResponse.data;
    const isPasswordValid = await bcrypt.compare(pass, user.password as string);

    if (!isPasswordValid) {
      return null;
    }

    const { password, ...result } = user;
    return result;
  }

  async validateGoogleUser(googleUserDto: GoogleUserDto): Promise<User> {
    // Try to find user by Google ID first
    let userResponse = await this.usersService.findByGoogleId(
      googleUserDto.googleId,
    );

    // If found by Google ID, return the user
    if (userResponse.success && userResponse.data) {
      return userResponse.data;
    }

    // Try to find by email
    userResponse = await this.usersService.findByEmail(googleUserDto.email);

    if (userResponse.success && userResponse.data) {
      // User exists with this email but not connected to Google
      // Update user with Google info
      const updatedUserResponse = await this.usersService.update(
        userResponse.data.id,
        {
          googleId: googleUserDto.googleId,
          displayName: googleUserDto.displayName,
          avatar: googleUserDto.avatar,
        },
      );

      if (updatedUserResponse.success) {
        return updatedUserResponse.data;
      }
    }

    // Create new user from Google data
    const randomUsername =
      googleUserDto.email.split('@')[0] + '_' + randomBytes(4).toString('hex');
    const createUserResponse = await this.usersService.createFromGoogle({
      username: randomUsername,
      email: googleUserDto.email,
      googleId: googleUserDto.googleId,
      displayName: googleUserDto.displayName,
      avatar: googleUserDto.avatar,
    });

    if (createUserResponse.success) {
      return createUserResponse.data;
    }

    throw new Error('Failed to authenticate with Google');
  }

  async login(user: RequestUser) {
    const payload = {
      username: user.username,
      sub: user.userId,
      role: user.role,
      displayName: user.displayName || null,
      avatar: user.avatar || null,
      permissions: user.permissions || []
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
  decodeToken(token: string) {
    return this.jwtService.decode(token);
  }
}
