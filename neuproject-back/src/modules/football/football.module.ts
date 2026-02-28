import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { FootballService } from './football.service';
import { FootballController } from './football.controller';

@Module({
    imports: [HttpModule, ConfigModule],
    controllers: [FootballController],
    providers: [FootballService],
    exports: [FootballService],
})
export class FootballModule { }
