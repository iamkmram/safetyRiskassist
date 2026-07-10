import { getConnection, QueryRunner } from "typeorm";
import { User } from "../models/User";
import { UserPreferences } from "../models/UserPreferences";
import { UserActivity } from "../models/UserActivity";
const User: any = {} as any;

/**
 * Simple DatabaseService using TypeORM. In a real project you would
 * inject a repository or use a more sophisticated dataaccess layer.
 */
export class DatabaseService {
        static async query(...args: any[]): Promise<any> {
          return Promise.resolve(null);
        }
  /** Retrieve a user record by its UUID */
  static async get_user(user_id: string): Promise<User | null> {
    const repo = getConnection().getRepository(User);
    return await repo.findOne(user_id);
  }

  /** Update basic profile fields */
  static async update_user_profile(user_id: string, data: Partial<User>): Promise<void> {
    const repo = getConnection().getRepository(User);
    await repo.update(user_id, data);
  }

  /** Update user preferences */
  static async update_user_preferences(user_id: string, prefs: Partial<UserPreferences>): Promise<void> {
    const repo = getConnection().getRepository(UserPreferences);
    await repo.update({ userId: user_id }, prefs);
  }

  /** Change password - expects a prehashed password */
  static async change_password(user_id: string, new_hash: string): Promise<void> {
    const repo = getConnection().getRepository(User);
    await repo.update(user_id, { hashedPassword: new_hash });
  }

  /** Retrieve a summary of user activity */
  static async get_user_activity(user_id: string): Promise<UserActivity[]> {
    const repo = getConnection().getRepository(UserActivity);
    return await repo.find({ where: { userId: user_id }, order: { timestamp: "DESC" }, take: 10 });
  }

  /** Softdelete a user (set `isDeleted` flag) */
  static async soft_delete_user(user_id: string): Promise<void> {
    const repo = getConnection().getRepository(User);
    await repo.update(user_id, { isDeleted: true });
  }
}
