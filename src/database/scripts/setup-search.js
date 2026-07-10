/**
 * Azure AI Search seeding script - creates an index for KnowledgeItem and
 * populates it with sample documents.
 *
 * Run with: node src/database/scripts/setup-search.js
 */

const { SearchIndexClient, SearchClient, AzureKeyCredential } = require('@azure/search-documents');
require('dotenv').config();

const endpoint = process.env.SEARCH_ENDPOINT;
const adminKey = process.env.SEARCH_ADMIN_KEY;
const indexName = process.env.SEARCH_INDEX || 'knowledge-index';

if (!endpoint || !adminKey) {
  console.error('SEARCH_ENDPOINT and SEARCH_ADMIN_KEY must be set in .env');
  process.exit(1);
}

async function main() {
  const indexClient = new SearchIndexClient(endpoint, new AzureKeyCredential(adminKey));

  // ----------------------------------------------------------------
  // 1 Define the index schema
  // ----------------------------------------------------------------
  const indexSchema = {
    name: indexName,
    fields: [
      { name: 'id', type: 'Edm.String', key: true, searchable: false },
      { name: 'title', type: 'Edm.String', searchable: true, filterable: false, sortable: true },
      { name: 'content', type: 'Edm.String', searchable: true },
      { name: 'department_id', type: 'Edm.String', filterable: true },
      { name: 'required_permission', type: 'Edm.String', filterable: true },
    ],
    semantic: {
      configuration: {
        name: 'default-semantic-config',
        prioritizedFields: {
          titleField: { fieldName: 'title' },
          prioritizedContentFields: [{ fieldName: 'content' }],
        },
      },
    },
  };

  // Create or update the index
  await indexClient.createOrUpdateIndex(indexSchema);
  console.log(`Search index "${indexName}" is ready.`);

  // ----------------------------------------------------------------
  // 2 Upload sample documents
  // ----------------------------------------------------------------
  const searchClient = new SearchClient(endpoint, indexName, new AzureKeyCredential(adminKey));

  const documents = [
    {
      id: 'k1',
      title: 'Company Policies',
      content: 'All employees must follow the policy handbook ...',
      department_id: 'dept-hr',
      required_permission: 'knowledge.read',
    },
    {
      id: 'k2',
      title: 'Engineering Architecture',
      content: 'Our system is built on microservices and Azure Functions ...',
      department_id: 'dept-eng',
      required_permission: 'knowledge.eng.read',
    },
  ];

  await searchClient.uploadDocuments(documents);
  console.log('Sample knowledge items indexed.');
}

main().catch((err) => {
  console.error('Error executing script', err);
});
