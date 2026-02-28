import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('signup')
    async signup(@Body() body: { email: string; pass: string; nickname: string; teamId: string }) {
        return this.authService.register(body.email, body.pass, body.nickname, body.teamId);
    }

    @Post('login')
    async login(@Body() body: { email: string; pass: string }) {
        return this.authService.login(body.email, body.pass);
    }
}