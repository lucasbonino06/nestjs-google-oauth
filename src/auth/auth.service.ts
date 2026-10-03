import { Injectable } from '@nestjs/common';
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
    const byGoogleId = await this.usersService.findByGoogleId(
      googleUser.googleId,
    );
    if (byGoogleId) return byGoogleId;

    const byEmail = await this.usersService.findByEmail(googleUser.email);
    if (byEmail) {
      return this.usersService.linkGoogleAccount(
        byEmail.id,
        googleUser.googleId,
      );
    }

    return this.usersService.create(googleUser);
  }

  login(user: { id: string; email: string }) {
    return this.jwtService.sign({ sub: user.id, email: user.email });
  }
} 