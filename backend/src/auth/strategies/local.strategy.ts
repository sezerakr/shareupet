import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<User> {
    const result = await this.authService.validateUser(username, password);

    if (result === 'USER_NOT_FOUND' || result === 'INVALID_PASSWORD') {
      throw new UnauthorizedException('Username or password is incorrect');
    }

    return result;
  }
}
