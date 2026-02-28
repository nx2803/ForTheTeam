import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from '../prisma/prisma.module'; // PrismaModule 연결 필수!

@Module({
    imports: [PrismaModule],
    controllers: [AuthController],
    providers: [AuthService],
})
export class AuthModule { }