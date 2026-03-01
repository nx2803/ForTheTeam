import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { TeamsModule } from './teams/teams.module';
import { PandaScoreModule } from './modules/pandascore/pandascore.module';
import { FootballModule } from './modules/football/football.module';
import { EspnModule } from './modules/espn/espn.module';
import { KboModule } from './modules/kbo/kbo.module';
import { SyncModule } from './modules/sync/sync.module';
import { MatchesModule } from './modules/matches/matches.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // API 요청 제한 (1분당 60회)
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 60,
    }]),
    // 캐싱 시스템 (Redis 기반, 로컬 환경은 메모리 권장)
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async (configService: ConfigService) => {
        const redisUrl = configService.get('REDIS_URL');
        if (redisUrl) {
          return {
            store: await redisStore({
              url: redisUrl,
              ttl: 600, // 10분 캐싱
            }),
          };
        }
        // REDIS_URL이 없으면 기본 메모리 스토어 사용 (ECONNREFUSED 방지)
        return {
          ttl: 600,
        };
      },
      inject: [ConfigService],
    }),
    ScheduleModule.forRoot(),
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
