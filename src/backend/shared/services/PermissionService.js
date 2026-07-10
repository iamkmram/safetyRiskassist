export class PermissionService {
    /**
     * Returns the list of permission strings for a given user.
     * This placeholder implementation always returns an empty array.
     */
    async getPermissions(userId) {
        return [];
    }
    /**
     * Checks whether a user has a specific permission.
     * Placeholder always returns false.
     */
    async hasPermission(userId, permission) {
        return false;
    }
}
