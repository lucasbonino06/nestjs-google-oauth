import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  findByGoogleId(googleId: string) {
    return this.prisma.user.findUnique({ where: { googleId } });
  }

  findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  create(data: {
    googleId: string;
    email: string;
    name?: string;
    avatar?: string;
  }) {
    return this.prisma.user.create({ data });
  }

  linkGoogleAccount(id: string, googleId: string) {
    return this.prisma.user.update({ where: { id }, data: { googleId } });
  }
}