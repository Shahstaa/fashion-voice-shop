import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Storage } from '@/lib/storage';

export interface Merchant {
  id: string;
  name: string;
  email: string;
  businessName: string;
  phone: string;
  address: string;
  isActive: boolean;
  createdAt: string;
}

interface AuthContextType {
  currentMerchant: Merchant | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (merchantData: Omit<Merchant, 'id' | 'isActive' | 'createdAt'>) => Promise<boolean>;
  logout: () => void;
  updateMerchant: (updates: Partial<Merchant>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [currentMerchant, setCurrentMerchant] = useState<Merchant | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Load auth state from cookies on mount
  useEffect(() => {
    const storedAuth = Storage.get<{ merchant: Merchant, expiresAt: number }>('merchant_auth');
    if (storedAuth) {
      try {
        if (storedAuth.merchant && storedAuth.expiresAt > Date.now()) {
          setCurrentMerchant(storedAuth.merchant);
          setIsAuthenticated(true);
        } else {
          // Clear expired auth
          Storage.remove('merchant_auth');
        }
      } catch (error) {
        console.error('Error loading auth data:', error);
        Storage.remove('merchant_auth');
      }
    }
  }, []);

  // Save auth state to cookies
  const saveAuthState = (merchant: Merchant) => {
    const authData = {
      merchant,
      expiresAt: Date.now() + (30 * 24 * 60 * 60 * 1000) // 30 days
    };
    Storage.set('merchant_auth', authData);
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Get stored merchants
      const merchants = Storage.get<Merchant[]>('merchants') || [];
      
      // Find merchant by email
      const merchant = merchants.find(m => m.email === email && m.isActive);
      
      if (merchant) {
        // In a real app, you'd verify the password here
        // For now, we'll accept any non-empty password
        if (password.trim()) {
          setCurrentMerchant(merchant);
          setIsAuthenticated(true);
          saveAuthState(merchant);
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const signup = async (merchantData: Omit<Merchant, 'id' | 'isActive' | 'createdAt'>): Promise<boolean> => {
    try {
      // Get existing merchants
      const merchants = Storage.get<Merchant[]>('merchants') || [];
      
      // Check if email already exists
      if (merchants.some(m => m.email === merchantData.email)) {
        return false;
      }
      
      // Create new merchant
      const newMerchant: Merchant = {
        ...merchantData,
        id: Date.now().toString(),
        isActive: true,
        createdAt: new Date().toISOString()
      };
      
      // Add to merchants array
      merchants.push(newMerchant);
      Storage.set('merchants', merchants);
      
      // Auto login after signup
      setCurrentMerchant(newMerchant);
      setIsAuthenticated(true);
      saveAuthState(newMerchant);
      
      return true;
    } catch (error) {
      console.error('Signup error:', error);
      return false;
    }
  };

  const logout = () => {
    setCurrentMerchant(null);
    setIsAuthenticated(false);
    Storage.remove('merchant_auth');
  };

  const updateMerchant = (updates: Partial<Merchant>) => {
    if (!currentMerchant) return;
    
    try {
      const updatedMerchant = { ...currentMerchant, ...updates };
      
      // Update in merchants list
      const merchants = Storage.get<Merchant[]>('merchants') || [];
      const updatedMerchants = merchants.map(m => 
        m.id === currentMerchant.id ? updatedMerchant : m
      );
      
      Storage.set('merchants', updatedMerchants);
      
      // Update current merchant
      setCurrentMerchant(updatedMerchant);
      saveAuthState(updatedMerchant);
    } catch (error) {
      console.error('Update merchant error:', error);
    }
  };

  const value: AuthContextType = {
    currentMerchant,
    isAuthenticated,
    login,
    signup,
    logout,
    updateMerchant
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
