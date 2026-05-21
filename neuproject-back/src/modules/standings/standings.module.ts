import { Module } from '@nestjs/common';
import { StandingsService } from './standings.service';
import { StandingsController } from './standings.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { FootballModule } from '../football/football.module';
import { EspnModule } from '../espn/espn.module';

@Module({
  imports: [
    PrismaModule,
    FootballModule,
    EspnModule,
  ],
  controllers: [StandingsController],
  providers: [StandingsService],
  exports: [StandingsService],
})
export class StandingsModule {}
