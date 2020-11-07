import 'tsconfig-paths/register';
import '@tsutil/dotenv';
import * as http from 'http';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import { router } from './api';
import * as middleware from '@tsutil/middleware';
import { createLogger } from '@tsutil/logger';

const port = process.env.DEMO_HTTP_SERVER_PORT || process.env.PORT || 8088;
const logger = createLogger('server');

module.parent == null && start().catch(err => {
    console.error(err);
    process.exit(1);
});
export async function start(): Promise<void> {
    const app = new Koa();
    const server = http.createServer(app.callback());

    app
        .use(middleware.gracefulShutdown(server, { logger }))
        .use(bodyParser())
        .use(middleware.logRequests())
        .use(router.routes())
        .use(router.allowedMethods());

    server.listen(port, () => {
        logger.info(`Server is listening on port ${port}`);
    });
}
