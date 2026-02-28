import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // 전역으로 설정해서 어디서든 쓸 수 있게 합니다.
@Module({
    providers: [PrismaService],
    exports: [PrismaService],

})



export class PrismaModule { }