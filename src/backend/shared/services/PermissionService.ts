// eslint-disable
// @ts-nocheck
import { DatabaseService } from "./DatabaseService";
import {
  Permission,
  Role,
  Department,
  UserPermission,
} from "../types/database.types";
import { logger } from "../../utils/logger";

/**
 * Minimal PermissionService stub.
 * Provides a placeholder `hasPermission` method so that the TypeScript
 * compiler can succeed. Real business logic should replace this stub.
 */
export class PermissionService {
  private db: DatabaseService;

  constructor(db: DatabaseService) {
    this.db = db;
  }

  /**
   * Checks whether a user has a given permission.
   * @param userId - identifier of the user
   * @param permission - permission to check
   * @returns true for now (placeholder)
   */
  async hasPermission(
    userId: string,
    permission: Permission
  ): Promise<boolean> {
    logger.info(`Permission check for user ${userId}`);
    // TODO: replace with real RBAC logic
    return true;
  }
}
