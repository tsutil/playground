export function gracefulShutdown(server, opts = null) {
    let shuttingDown = false;
    const options = {
        forceTimeout: 30000,
        ...opts
    };
    const logger = options.logger;

    logger.info('creating graceful shutdown middleware');
    process.on('SIGTERM', () => {
        logger && logger.info && logger.info('received kill signal (SIGTERM), shutting down');
        gracefulExit();
    });
    process.on('SIGINT', () => {
        console.log(''); // prettify console output - newline after ^C
        logger && logger.info && logger.info('received kill signal (SIGINT), shutting down');
        gracefulExit();
    });

    function gracefulExit() {
        if (shuttingDown) {
            logger && logger.info && logger.info('shutdown was already triggered');
            return;
        }
        shuttingDown = true;

        setTimeout(() => {
            logger && logger.error && logger.error('could not close connections in time, forcefully shutting down');
            process.exit(1);
        }, options.forceTimeout);
        server.close(() => {
            logger && logger.info && logger.info('incoming connections closed, exiting');
            process.exit();
        });
    }
    async function middleware({ request, response }, next) {
        if (!shuttingDown) {
            return await next();
        }
        response.set('Connection', 'close');
        response.status(503).send('Server is in the process of restarting.');
    }
    return middleware;
}
