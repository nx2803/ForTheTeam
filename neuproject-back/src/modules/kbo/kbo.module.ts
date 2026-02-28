import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { KboService } from './kbo.service';
import { KboController } from './kbo.controller';

@Module({
    imports: [HttpModule],
    controllers: [KboController],
    providers: [KboService],
    exports: [KboService],
})
export class KboModule { }
