/**
 * setup-cosmos.js
 * Provision a Cosmos DB (SQL API) database for the application.
 * This script uses @azure/cosmos; replace placeholder values with real ones.
 */

const { CosmosClient } = require('@azure/cosmos');

async function main() {
  const endpoint = process.env.COSMOS_ENDPOINT;
  const key = process.env.COSMOS_KEY;
  const databaseId = process.env.COSMOS_DATABASE || 'knowledgeDB';
  const containerId = process.env.COSMOS_CONTAINER || 'items';

  if (!endpoint || !key) {
    console.error('Cosmos DB endpoint or key not set in environment.');
    process.exit(1);
  }

  const client = new CosmosClient({ endpoint, key });

  console.log(`Creating (or ensuring) database "${databaseId}"...`);
  const { database } = await client.databases.createIfNotExists({ id: databaseId });

  console.log(`Creating (or ensuring) container "${containerId}"...`);
  await database.containers.createIfNotExists({
    id: containerId,
    partitionKey: { paths: ['/id'] },
  });

  console.log('Cosmos DB setup completed.');
}

main().catch(err => {
  console.error('Error during Cosmos DB provisioning:', err);
  process.exit(1);
});
