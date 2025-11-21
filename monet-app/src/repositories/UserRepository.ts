import { UserService } from '@/src/services/firestore/UserService';
import { User } from '@/src/models/User';

export class UserRepository {
  async create(user: User): Promise<void> {
    return await UserService.createUser(user);
  }

  async getById(userId: string): Promise<User | null> {
    return await UserService.getUser(userId);
  }

  async update(userId: string, data: Partial<User>): Promise<void> {
    return await UserService.updateUser(userId, data);
  }
}