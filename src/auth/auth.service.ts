import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

export interface GoogleUser {
  googleId: string;
  email: string;
  name: string;
  avatar: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateGoogleUser(googleUser: GoogleUser) {
    if (!googleUser.email) {
      throw new UnauthorizedException('Google no devolvió un email');
    }

    try {
      const byGoogleId = await this.usersService.findByGoogleId(
        googleUser.googleId,
      );
      if (byGoogleId) return byGoogleId;

      const byEmail = await this.usersService.findByEmail(googleUser.email);
      if (byEmail) {
        return await this.usersService.linkGoogleAccount(
          byEmail.id,
          googleUser.googleId,
        );
      }

      return await this.usersService.create(googleUser);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException(
        'Error al procesar el usuario de Google',
      );
    }
  }

  login(user: { id: string; email: string }) {
    return this.jwtService.sign({ sub: user.id, email: user.email });
  }
}