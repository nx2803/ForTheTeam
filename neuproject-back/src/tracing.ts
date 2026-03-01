import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { NestInstrumentation } from '@opentelemetry/instrumentation-nestjs-core';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';

// OTLP 내보내기 설정
const traceExporter = new OTLPTraceExporter({
    url: 'http://localhost:4318/v1/traces',
});

export const otraceSDK = new NodeSDK({
    serviceName: 'neuproject-backend',
    traceExporter,
    instrumentations: [
        getNodeAutoInstrumentations(),
        new NestInstrumentation(),
        new HttpInstrumentation(),
    ],
});

// 프로세스 종료 시 SDK 종료 처리
process.on('SIGTERM', () => {
    otraceSDK.shutdown()
        .then(() => console.log('Tracing terminated'))
        .catch((error) => console.log('Error terminating tracing', error))
        .finally(() => process.exit(0));
});
