/**
 * setup-search.js
 *
 * Creates an Azure Cognitive Search index for documents if missing.
 * Logs progress and handles errors gracefully.
 *
 * Usage: node setup-search.js
 */

const { SearchIndexClient, SearchIndexerClient, AzureKeyCredential } = require('@azure/search-documents');
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
  const endpoint = process.env.SEARCH_ENDPOINT;
  const apiKey = process.env.SEARCH_API_KEY;
  const indexName = process.env.SEARCH_INDEX_NAME || 'documents-index';

  if (!endpoint || !apiKey) {
    logger.error('SEARCH_ENDPOINT and SEARCH_API_KEY environment variables are required.');
    process.exit(1);
  }

  const client = new SearchIndexClient(endpoint, new AzureKeyCredential(apiKey));

  try {
    const indexes = await client.listIndexes();
    const exists = indexes.some(idx => idx.name === indexName);

    if (exists) {
      logger.info(`Search index '${indexName}' already exists - skipping creation.`);
      return;
    }

    const definition = {
      name: indexName,
      fields: [
        { name: 'id', type: 'Edm.String', key: true, searchable: false },
        { name: 'title', type: 'Edm.String', searchable: true, filterable: true, sortable: true },
        { name: 'content', type: 'Edm.String', searchable: true },
        { name: 'author_id', type: 'Edm.String', filterable: true, facetable: false },
        { name: 'created_at', type: 'Edm.DateTimeOffset', filterable: true, sortable: true },
      ],
    };

    await client.createIndex(definition);
    logger.info(`Search index '${indexName}' created successfully.`);
  } catch (err) {
    logger.error(`Failed to create or verify search index: ${err.message}`);
    process.exit(1);
  }
}

main();
