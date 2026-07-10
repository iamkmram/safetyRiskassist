/**
 * PermissionService - simple inmemory permission checker.
 * In a real system this would query a DB or external IAM.
 */

type Role = 'admin' | 'user' | 'guest';

export class PermissionService {
  /**
   * Checks whether a given role is allowed to perform an action.
   * @param role - role of the caller
   * @param required - minimum role required
   */
  public static hasPermission(role: Role, required: Role): boolean {
    const hierarchy: Role[] = ['guest', 'user', 'admin'];
    const roleIdx = hierarchy.indexOf(role);
    const reqIdx = hierarchy.indexOf(required);
    if (roleIdx === -1 || reqIdx === -1) {
      console.warn(`Unknown role provided: ${role} or ${required}`);
      return false;
    }
    return roleIdx >= reqIdx;
  }
}
