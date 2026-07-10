// setup-search.js
// Creates / updates the Azure AI Search index for hybrid (keyword + vector) queries.

const { SearchIndexClient, AzureKeyCredential } = require("@azure/search-documents");
require("dotenv").config();

const endpoint = process.env.AZURE_SEARCH_ENDPOINT;
const adminKey = process.env.AZURE_SEARCH_ADMIN_KEY;
const indexName = process.env.AZURE_SEARCH_INDEX || "knowledge-index";

async function main() {
  const client = new SearchIndexClient(endpoint, new AzureKeyCredential(adminKey));

  const index = {
    name: indexName,
    fields: [
      { name: "id", type: "Edm.String", key: true, searchable: false },
      { name: "title", type: "Edm.String", searchable: true, filterable: true },
      { name: "content", type: "Edm.String", searchable: true },
      {
        name: "vectorEmbedding",
        type: "Collection(Edm.Double)",
        searchable: true,
        vectorSearchDimensions: 1536,
        vectorSearchProfile: "default",
      },
    ],
    vectorSearch: {
      algorithms: [
        {
          name: "default",
          kind: "hnsw",
          parameters: { efConstruction: 200, m: 16 },
        },
      ],
    },
  };

  await client.createOrUpdateIndex(index);
  console.log(` Azure Search index "${indexName}" created or updated.`);
}

main().catch((err) => {
  console.error(" Error setting up Azure Search index:", err);
  process.exit(1);
});
