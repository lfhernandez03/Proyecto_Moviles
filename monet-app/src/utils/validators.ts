// src/utils/validators.ts
export class Validators {
  /**
   * Valida formato de email
   */
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Valida longitud mínima de contraseña
   */
  static isValidPassword(password: string, minLength: number = 6): boolean {
    return password.length >= minLength;
  }

  /**
   * Valida que dos contraseñas coincidan
   */
  static passwordsMatch(password: string, confirmPassword: string): boolean {
    return password === confirmPassword;
  }

  /**
   * Valida que el nombre no esté vacío
   */
  static isValidName(name: string): boolean {
    return name.trim().length > 0;
  }
}