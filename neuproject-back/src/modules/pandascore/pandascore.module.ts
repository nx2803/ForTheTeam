import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { PandaScoreService } from './pandascore.service';
import { PandaScoreController } from './pandascore.controller';

@Module({
    imports: [
        HttpModule,
        ConfigModule,
    ],
    controllers: [PandaScoreController],
    providers: [PandaScoreService],
    exports: [PandaScoreService],
})
export class PandaScoreModule { }
