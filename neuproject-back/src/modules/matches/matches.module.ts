import { Module } from '@nestjs/common';
import { MatchesService } from './matches.service';
import { MatchesController } from './matches.controller';
import { MatchesGateway } from './matches.gateway';

@Module({
    providers: [MatchesService, MatchesGateway],
    controllers: [MatchesController],
    exports: [MatchesService, MatchesGateway]
})
export class MatchesModule { }
