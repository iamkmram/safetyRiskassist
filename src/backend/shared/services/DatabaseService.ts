/**
 * Stub DatabaseService - returns empty collections.
 * Real implementations would use Azure Cosmos DB / PostgreSQL.
 */

export async function fetchAll<T>(tableName: string): Promise<T[]> {
  // No real DB - return empty array.
  return [];
}

/**
 * Generic insert stub - resolves immediately.
 */
export async function insertOne<T>(tableName: string, record: T): Promise<void> {
  // No operation.
  return;
}
