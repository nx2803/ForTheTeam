import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    constructor() {
        const pool = new Pool({ connectionString: process.env.DATABASE_URL });
        const adapter = new PrismaPg(pool);
        super({ adapter });
    }

    async onModuleInit() {
        // 서버가 켜질 때 DB에 연결 시도
        await this.$connect();
        const models = Object.keys(this).filter(k => !k.startsWith('_') && !k.startsWith('$'));
        console.log('[PrismaService] Connected. Available models:', models.join(', '));
    }

    async onModuleDestroy() {
        // 서버가 꺼질 때 DB 연결 해제
        await this.$disconnect();
    }
}