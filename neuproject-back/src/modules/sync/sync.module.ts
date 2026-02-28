import { Module } from '@nestjs/common';
import { SyncService } from './sync.service';
import { SyncController } from './sync.controller';
import { FootballModule } from '../football/football.module';
import { PandaScoreModule } from '../pandascore/pandascore.module';
import { EspnModule } from '../espn/espn.module';
import { KboModule } from '../kbo/kbo.module';

@Module({
    imports: [
        FootballModule,
        PandaScoreModule,
        EspnModule,
        KboModule,
    ],
    controllers: [SyncController],
    providers: [SyncService],
})
export class SyncModule { }
