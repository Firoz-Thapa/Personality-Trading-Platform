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
      console.log('🔄 Initializing auth...');
      const token = storage.get('token');
      
      if (token) {
        console.log('🔑 Found token, verifying...');
        try {
          // Verify token and get user data
          const response = await api.get<User>('/auth/me');
          console.log('✅ Token verification response:', response);
          
          if (response.success && response.data) {
            console.log('✅ User authenticated:', response.data.email);
            setUser(response.data);
          } else {
            console.log('❌ Invalid token response, removing token');
            storage.remove('token');
          }
        } catch (error: any) {
          console.error('❌ Token verification failed:', error.message);
          storage.remove('token');
        }
      } else {
        console.log('ℹ️ No token found');
      }
      
      setLoading(false);
    };

    // Only run on client side
    if (typeof window !== 'undefined') {
      initializeAuth();
    } else {
      setLoading(false);
    }
  }, []);

  // Login function
  const login = async (credentials: LoginCredentials): Promise<void> => {
    try {
      setLoading(true);
      console.log('🔐 Attempting login for:', credentials.email);
      
      const response = await api.post<{ user: User; token: string }>('/auth/login', credentials);
      console.log('📥 Login response:', { 
        success: response.success, 
        hasData: !!response.data,
        hasToken: !!response.data?.token,
        hasUser: !!response.data?.user
      });
      
      if (response.success && response.data) {
        const { user, token } = response.data;
        
        console.log('💾 Storing token and user data...');
        // Store token
        storage.set('token', token);
        
        // Set user
        setUser(user);
        console.log('✅ Login successful for:', user.email);
      } else {
        throw new Error(response.message || 'Login failed - no data received');
      }
    } catch (error: any) {
      console.error('❌ Login error:', error);
      throw new Error(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (data: RegisterData): Promise<void> => {
    try {
      setLoading(true);
      console.log('📝 Attempting registration for:', data.email);
      
      const response = await api.post<{ user: User; token: string }>('/auth/register', data);
      console.log('📥 Registration response:', { 
        success: response.success, 
        hasData: !!response.data,
        hasToken: !!response.data?.token,
        hasUser: !!response.data?.user
      });
      
      if (response.success && response.data) {
        const { user, token } = response.data;
        
        console.log('💾 Storing token and user data...');
        // Store token
        storage.set('token', token);
        
        // Set user
        setUser(user);
        console.log('✅ Registration successful for:', user.email);
      } else {
        throw new Error(response.message || 'Registration failed - no data received');
      }
    } catch (error: any) {
      console.error('❌ Registration error:', error);
      throw new Error(error.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = (): void => {
    try {
      console.log('👋 Logging out user...');
      // Call logout endpoint (optional, for server-side cleanup)
      api.post('/auth/logout').catch(console.error);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clean up local state regardless of API call result
      storage.remove('token');
      setUser(null);
      console.log('✅ Logout complete');
    }
  };

  // Update user function
  const updateUser = (userData: Partial<User>): void => {
    if (user) {
      console.log('🔄 Updating user data...');
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
        console.log('🔒 User not authenticated, redirecting to login...');
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