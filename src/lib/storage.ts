import Cookies from 'js-cookie';

// Storage utility that uses cookies for persistence
export class Storage {
  // Set data with 30 days expiration
  static set(key: string, value: unknown): void {
    try {
      const serializedValue = JSON.stringify(value);
      Cookies.set(key, serializedValue, { expires: 30, secure: true, sameSite: 'strict' });
    } catch (error) {
      console.error('Error setting data in cookies:', error);
    }
  }

  // Get data from cookies
  static get<T = unknown>(key: string): T | null {
    try {
      const value = Cookies.get(key);
      return value ? JSON.parse(value) as T : null;
    } catch (error) {
      console.error('Error getting data from cookies:', error);
      return null;
    }
  }

  // Remove data from cookies
  static remove(key: string): void {
    Cookies.remove(key);
  }

  // Check if key exists
  static has(key: string): boolean {
    return Cookies.get(key) !== undefined;
  }

  // Clear all our app cookies
  static clear(): void {
    const appKeys = [
      'merchant_product_data',
      'dynamic_translations', 
      'auth_data',
      'user_preferences'
    ];
    
    appKeys.forEach(key => {
      Cookies.remove(key);
    });
  }
}
