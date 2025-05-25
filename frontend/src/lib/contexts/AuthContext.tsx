'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, AuthContextType, LoginCredentials, RegisterData } from '@/lib/types';
import { api } from '@/lib/api/client';
import { storage } from '@/lib/utils';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing token on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const token = storage.get('token');
      
      if (token) {
        try {
          // Verify token and get user data
          const response = await api.get<User>('/auth/me');
          if (response.success && response.data) {
            setUser(response.data);
          } else {
            // Invalid token, remove it
            storage.remove('token');
          }
        } catch (error) {
          console.error('Token verification failed:', error);
          storage.remove('token');
        }
      }
      
      setLoading(false);
    };

    initializeAuth();
  }, []);

  // Login function
  const login = async (credentials: LoginCredentials): Promise<void> => {
    try {
      setLoading(true);
      const response = await api.post<{ user: User; token: string }>('/auth/login', credentials);
      
      if (response.success && response.data) {
        const { user, token } = response.data;
        
        // Store token
        storage.set('token', token);
        
        // Set user
        setUser(user);
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error: any) {
      throw new Error(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (data: RegisterData): Promise<void> => {
    try {
      setLoading(true);
      const response = await api.post<{ user: User; token: string }>('/auth/register', data);
      
      if (response.success && response.data) {
        const { user, token } = response.data;
        
        // Store token
        storage.set('token', token);
        
        // Set user
        setUser(user);
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (error: any) {
      throw new Error(error.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = (): void => {
    try {
      // Call logout endpoint (optional, for server-side cleanup)
      api.post('/auth/logout').catch(console.error);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clean up local state regardless of API call result
      storage.remove('token');
      setUser(null);
    }
  };

  // Update user function
  const updateUser = (userData: Partial<User>): void => {
    if (user) {
      setUser({ ...user, ...userData });
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

// Higher-order component for protected routes
export const withAuth = <P extends object>(
  Component: React.ComponentType<P>
): React.FC<P> => {
  const AuthenticatedComponent: React.FC<P> = (props) => {
    const { user, loading } = useAuth();
    
    // Show loading spinner while checking auth
    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      );
    }
    
    // Redirect to login if not authenticated
    if (!user) {
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/login';
      }
      return null;
    }
    
    // Render component if authenticated
    return <Component {...props} />;
  };
  
  AuthenticatedComponent.displayName = `withAuth(${Component.displayName || Component.name})`;
  
  return AuthenticatedComponent;
};

// Hook for checking if user is authenticated
export const useIsAuthenticated = (): boolean => {
  const { user } = useAuth();
  return !!user;
};

// Hook for getting current user with loading state
export const useCurrentUser = (): { user: User | null; loading: boolean } => {
  const { user, loading } = useAuth();
  return { user, loading };
};