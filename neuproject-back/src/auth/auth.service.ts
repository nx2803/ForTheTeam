// src/auth/auth.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

console.log(process.env.DATABASE_URL);
@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) { }

  async register(email: string, pass: string, nickname: string, teamId: string) {
    const hashedPassword = await bcrypt.hash(pass, 10);

    return this.prisma.members.create({
      data: {
        email,
        hashed_password: hashedPassword,
        nickname,
        main_favorite_team_id: teamId,
      },
    });
  }

  async login(email: string, pass: string) {
    // 이메일로 사용자 찾기
    const user = await this.prisma.members.findUnique({
      where: { email },
    });

    // 사용자가 없으면 에러
    if (!user) {
      throw new Error('사용자를 찾을 수 없습니다');
    }

    // 비밀번호 검증
    const isPasswordValid = await bcrypt.compare(pass, user.hashed_password);

    if (!isPasswordValid) {
      throw new Error('비밀번호가 일치하지 않습니다');
    }

    // 비밀번호 필드 제외하고 반환
    const { hashed_password, ...result } = user;
    return result;
  }
}