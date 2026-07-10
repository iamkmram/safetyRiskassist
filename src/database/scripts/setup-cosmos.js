// setup-cosmos.js
// Creates the Cosmos DB database and a container for knowledge items.

const { CosmosClient } = require("@azure/cosmos");
require("dotenv").config();

const endpoint = process.env.COSMOS_ENDPOINT;
const key = process.env.COSMOS_KEY;
const databaseId = process.env.COSMOS_DB_ID || "knowledgeDb";
const containerId = process.env.COSMOS_CONTAINER_ID || "knowledgeItems";

async function main() {
  const client = new CosmosClient({ endpoint, key });

  const { database } = await client.databases.createIfNotExists({
    id: databaseId,
  });
  console.log(` Cosmos DB database "${database.id}" is ready.`);

  const { container } = await database.containers.createIfNotExists({
    id: containerId,
    partitionKey: { paths: ["/id"] },
  });
  console.log(` Container "${container.id}" is ready.`);
}

main().catch((err) => {
  console.error(" Error setting up Cosmos DB:", err);
  process.exit(1);
});
