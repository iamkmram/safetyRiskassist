/**
 * setup-cosmos.js
 *
 * Provision a Cosmos DB account, database and containers if they do not exist.
 * Designed to be idempotent and heavily logged.
 *
 * Usage: node setup-cosmos.js
 */

const { CosmosClient } = require('@azure/cosmos');
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(info => `[${info.timestamp}] ${info.level.toUpperCase()} ${info.message}`)
  ),
  transports: [new winston.transports.Console()],
});

async function main() {
  const connectionString = process.env.COSMOS_CONNECTION_STRING;
  if (!connectionString) {
    logger.error('COSMOS_CONNECTION_STRING environment variable is missing.');
    process.exit(1);
  }

  const client = new CosmosClient(connectionString);
  const dbId = process.env.COSMOS_DB_NAME || 'travel-assistant-db';

  try {
    const { database } = await client.databases.createIfNotExists({ id: dbId });
    logger.info(`Database '${dbId}' ensured.`);

    const containers = ['users', 'permissions', 'documents'];
    for (const cont of containers) {
      const { container } = await database.containers.createIfNotExists({ id: cont });
      logger.info(`Container '${cont}' ensured.`);
    }

    logger.info('Cosmos DB setup completed successfully.');
  } catch (err) {
    logger.error(`Cosmos DB setup failed: ${err.message}`);
    process.exit(1);
  }
}

main();
