import { CosmosClient, Container, Database } from '@azure/cosmos';
import { logger } from '../../utils/logger';

/**
 * Simple wrapper around Azure Cosmos DB.
 * Provides init, getContainer and basic CRUD helpers with error handling.
 */
export class DatabaseService {
  private static instance: DatabaseService;
  private client: CosmosClient;
  private database?: Database;

  private constructor(connectionString: string) {
    this.client = new CosmosClient(connectionString);
  }

  /** Initialise the service - must be called once at startup */
  public static async init(connectionString: string): Promise<DatabaseService> {
    if (!DatabaseService.instance) {
      const svc = new DatabaseService(connectionString);
      await svc.ensureDatabase();
      DatabaseService.instance = svc;
    }
    return DatabaseService.instance;
  }

  private async ensureDatabase(): Promise<void> {
    try {
      const { database } = await this.client.databases.createIfNotExists({
        id: process.env.COSMOS_DB_NAME ?? 'travel-assistant-db',
      });
      this.database = database;
      logger.info('Cosmos DB database ensured.');
    } catch (err:any) {
      logger.error('Failed to ensure Cosmos DB database:', err);
      throw err;
    }
  }

  /** Get a container; created if missing */
  public async getContainer(containerId: string): Promise<Container> {
    if (!this.database) {
      throw new Error('DatabaseService not initialised - call init() first.');
    }
    try {
      const { container } = await this.database.containers.createIfNotExists({
        id: containerId,
      });
      logger.info(`Container '${containerId}' ready.`);
      return container;
    } catch (err:any) {
      logger.error(`Failed to get/create container '${containerId}':`, err);
      throw err;
    }
  }

  /* ------------------------------------------------------------------
   * Generic CRUD helpers - all return the raw Azure response
   * ------------------------------------------------------------------ */
  public async createItem<T>(containerId: string, item: T): Promise<T> {
    const container = await this.getContainer(containerId);
    const { resource } = await container.items.create(item);
    return resource as T;
  }

  public async readItem<T>(containerId: string, id: string, partitionKey: string): Promise<T> {
    const container = await this.getContainer(containerId);
    const { resource } = await container.item(id, partitionKey).read<T>();
    return resource as T;
  }

  public async queryItems<T>(containerId: string, query: string, parameters?: any[]): Promise<T[]> {
    const container = await this.getContainer(containerId);
    const { resources } = await container.items
      .query<T>({ query, parameters })
      .fetchAll();
    return resources;
  }
}
