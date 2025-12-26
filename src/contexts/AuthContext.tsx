import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, UserRole } from '@/api/types';
import * as authAPI from '@/api/auth';
import { tokenManager } from '@/lib/tokenManager';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  userRole: UserRole | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check for existing session on mount
  useEffect(() => {
    const initAuth = async () => {
      const accessToken = tokenManager.getAccessToken();

      if (!accessToken) {
        setLoading(false);
        return;
      }

      try {
        // Verify token is still valid by fetching current user
        const response = await authAPI.getCurrentUser();
        setUser(response.user);
        setUserRole(response.user.role);
      } catch (error) {
        // Token is invalid or expired
        console.error('Failed to restore session:', error);
        tokenManager.clearAllTokens();
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const response = await authAPI.login(email, password);

      // Save tokens
      tokenManager.setAccessToken(response.accessToken);
      tokenManager.setRefreshToken(response.refreshToken);

      // Set user state
      setUser(response.user);
      setUserRole(response.user.role);

      toast.success('Logged in successfully!');
      return { error: null };
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Failed to sign in';
      console.error('Sign in error:', error);
      return { error: errorMessage };
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const response = await authAPI.register(email, password);

      // Save tokens
      tokenManager.setAccessToken(response.accessToken);
      tokenManager.setRefreshToken(response.refreshToken);

      // Set user state
      setUser(response.user);
      setUserRole(response.user.role);

      toast.success('Account created successfully!');
      return { error: null };
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Failed to sign up';
      console.error('Sign up error:', error);
      return { error: errorMessage };
    }
  };

  const signOut = async () => {
    try {
      const refreshToken = tokenManager.getRefreshToken();
      if (refreshToken) {
        await authAPI.logout(refreshToken);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear tokens and state regardless of API call success
      tokenManager.clearAllTokens();
      setUser(null);
      setUserRole(null);
      navigate('/');
      toast.success('Logged out successfully');
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, userRole, loading, signIn, signUp, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
