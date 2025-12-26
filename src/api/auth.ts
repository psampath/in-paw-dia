import apiClient from './client';
import {
  AuthResponse,
  RefreshTokenResponse,
  MessageResponse,
  UserResponse,
} from './types';

export const register = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>('/auth/register', {
    email,
    password,
  });
  return response.data;
};

export const login = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>('/auth/login', {
    email,
    password,
  });
  return response.data;
};

export const refreshToken = async (
  refreshToken: string
): Promise<RefreshTokenResponse> => {
  const response = await apiClient.post<RefreshTokenResponse>('/auth/refresh', {
    refreshToken,
  });
  return response.data;
};

export const logout = async (refreshToken: string): Promise<MessageResponse> => {
  const response = await apiClient.post<MessageResponse>('/auth/logout', {
    refreshToken,
  });
  return response.data;
};

export const getCurrentUser = async (): Promise<UserResponse> => {
  const response = await apiClient.get<UserResponse>('/auth/me');
  return response.data;
};
