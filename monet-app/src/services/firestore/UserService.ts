import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/FirebaseConfig';
import { User } from '@/src/models/User';

export class UserService {
  private static COLLECTION = 'users';

  /**
   * Crea un nuevo usuario en Firestore
   */
  static async createUser(user: Omit<User, 'createdAt'>): Promise<void> {
    const userData: User = {
      ...user,
      createdAt: new Date().toISOString(),
    };

    await setDoc(doc(db, this.COLLECTION, user.uid), userData);
  }

  /**
   * Obtiene un usuario por su ID
   */
  static async getUser(userId: string): Promise<User | null> {
    const docSnap = await getDoc(doc(db, this.COLLECTION, userId));
    return docSnap.exists() ? (docSnap.data() as User) : null;
  }
  
  /**
   * Verifica si un email ya está registrado
   */
  static async emailExists(email: string): Promise<boolean> {
    const normalizedEmail = email.trim().toLowerCase();
    const docSnap = await getDoc(doc(db, this.COLLECTION, normalizedEmail));
    return docSnap.exists();
  }

  static async updateUser(userId: string, data: Partial<User>): Promise<void> {
    await updateDoc(doc(db, this.COLLECTION, userId), data);
  }
}