import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { TeamsModule } from './teams/teams.module';
import { PandaScoreModule } from './modules/pandascore/pandascore.module';
import { FootballModule } from './modules/football/football.module';
import { EspnModule } from './modules/espn/espn.module';
import { KboModule } from './modules/kbo/kbo.module';
import { SyncModule } from './modules/sync/sync.module';
import { MatchesModule } from './modules/matches/matches.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    TeamsModule,
    PandaScoreModule,
    FootballModule,
    EspnModule,
    KboModule,
    SyncModule,
    MatchesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
