import 'tsconfig-paths/register';
import '@tsutil/dotenv';
import { createLogger } from '@tsutil/logger';

/**
 * run with `node -r ts-node/register`
 */

const logger = createLogger();
module.parent == null && main().catch(console.error);
async function main() {
    logger.info(`mongo connection string: ${process.env.MONGO_CONNECTION_STRING}`);
}
