import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  updateProfile,
  User
} from 'firebase/auth';
import { auth } from '@/FirebaseConfig';

export class AuthService {
  /**
   * Inicia sesión con email y contraseña
   */
  static async signIn(email: string, password: string): Promise<User> {
    const userCredential = await signInWithEmailAndPassword(
      auth, 
      email.trim().toLowerCase(), 
      password
    );
    return userCredential.user;
  }

  /**
   * Registra un nuevo usuario
   */
  static async signUp(
    email: string, 
    password: string, 
    fullname: string
  ): Promise<User> {
    const userCredential = await createUserWithEmailAndPassword(
      auth, 
      email.trim().toLowerCase(), 
      password
    );
    
    await updateProfile(userCredential.user, { 
      displayName: fullname.trim() 
    });
    
    return userCredential.user;
  }

  /**
   * Cierra la sesión del usuario actual
   */
  static async signOut(): Promise<void> {
    await firebaseSignOut(auth);
  }

  /**
   * Envía un correo de recuperación de contraseña
   */
  static async sendPasswordReset(email: string): Promise<void> {
    await sendPasswordResetEmail(auth, email.trim().toLowerCase());
  }

  /**
   * Obtiene el usuario actual
   */
  static getCurrentUser(): User | null {
    return auth.currentUser;
  }

  /**
   * Verifica si hay un usuario autenticado
   */
  static isAuthenticated(): boolean {
    return !!auth.currentUser;
  }
}