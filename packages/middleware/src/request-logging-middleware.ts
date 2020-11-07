import { createLogger } from '@tsutil/logger';

const logger = createLogger('http-request');
const isTestEnv = process.env.NODE_ENV === 'dev';

const IGNORE_ROUTES = [
    '/',
    '/health',
    '/favicon.ico',
    '/favicon-16x16.png',
    '/swagger',
    '/styles/style.css',
];

export function logRequests() {
    return async (ctx, next) => {
        const started = Date.now();
        let error;
        try {
            return await next();
        } catch (err) {
            error = err;
            throw err;
        } finally {
            const processingTimeMs = Date.now() - started;
            const { status, method, path, query } = ctx;
            const debugData = {
                status,
                method,
                path,
                query,
                processingTimeMs,
                requestBody: ctx.request.body,
                responseBody: ctx.response.body,
                error,
            };
            if (!shouldIgnoreRequest(ctx)) {
                logger.info(`(http-request) ${method}: ${path} (${status})`, debugData);
                const contentType = ctx.response.headers['content-type'] || '';
                if (isTestEnv && error != null) {
                    console.error(error);
                }
                if (isTestEnv && (contentType.includes('application/json') || status != 200)) {
                    console.log(JSON.stringify(debugData, null, 4));
                }
            }
        }
    };
}
function shouldIgnoreRequest(ctx) {
    if (IGNORE_ROUTES.includes(ctx.path)) {
        return true;
    }
    if (ctx.path === '/graphql' && ctx.request.body?.operationName === 'IntrospectionQuery') {
        return true;
    }
    return false;
}
