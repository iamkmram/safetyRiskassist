/**
 * Cosmos DB seed script - creates databases, containers, and seeds
 * core RBAC data (departments, roles, permissions).
 *
 * Run with: node src/database/scripts/setup-cosmos.js
 */

const { CosmosClient } = require('@azure/cosmos');
require('dotenv').config();

const endpoint = process.env.COSMOS_ENDPOINT;
const key = process.env.COSMOS_KEY;
const databaseId = process.env.COSMOS_DATABASE || 'app-db';

if (!endpoint || !key) {
  console.error('COSMOS_ENDPOINT and COSMOS_KEY must be set in .env');
  process.exit(1);
}

async function main() {
  const client = new CosmosClient({ endpoint, key });
  const { database } = await client.databases.createIfNotExists({ id: databaseId });
  console.log(`Database "${database.id}" ready.`);

  // Containers (tables) -------------------------------------------------
  const containers = [
    { id: 'departments', partitionKey: { kind: 'Hash', paths: ['/id'] } },
    { id: 'roles', partitionKey: { kind: 'Hash', paths: ['/id'] } },
    { id: 'permissions', partitionKey: { kind: 'Hash', paths: ['/id'] } },
    { id: 'users', partitionKey: { kind: 'Hash', paths: ['/id'] } },
    { id: 'documents', partitionKey: { kind: 'Hash', paths: ['/id'] } },
  ];

  for (const c of containers) {
    const { container } = await database.containers.createIfNotExists(c);
    console.log(`Container "${container.id}" ready.`);
  }

  // Seed data -----------------------------------------------------------
  const permissions = [
    { id: 'perm-1', key: 'knowledge.read', description: 'Read any knowledge item' },
    { id: 'perm-2', key: 'knowledge.write', description: 'Create/modify knowledge items' },
    { id: 'perm-3', key: 'admin.manage', description: 'Administrative privileges' },
  ];

  const rolePermissions = [
    { role_id: 'role-admin', permission_id: 'perm-3' },
    { role_id: 'role-knowledge-reader', permission_id: 'perm-1' },
    { role_id: 'role-knowledge-writer', permission_id: 'perm-2' },
  ];

  const departments = [
    { id: 'dept-hr', name: 'Human Resources' },
    { id: 'dept-eng', name: 'Engineering' },
  ];

  const roles = [
    { id: 'role-admin', name: 'Administrator' },
    { id: 'role-knowledge-reader', name: 'Knowledge Reader' },
    { id: 'role-knowledge-writer', name: 'Knowledge Writer' },
  ];

  // Helper to upsert items
  async function upsert(containerId, items) {
    const container = database.container(containerId);
    for (const item of items) {
      await container.items.upsert(item);
    }
  }

  await upsert('permissions', permissions);
  await upsert('roles', roles);
  await upsert('departments', departments);
  // Note: role_permission is modelled via a separate container in a real Cosmos design;
  // for this simple seed we store it in a container named "role_permission".
  await upsert('role_permission', rolePermissions);

  console.log('Seeding completed.');
}

main().catch((err) => {
  console.error('Error running script', err);
});
