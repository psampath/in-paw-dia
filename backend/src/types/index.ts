import { UserRole } from '../models/User';

export interface AuthResponse {
  success: boolean;
  user: {
    _id: string;
    email: string;
    role: UserRole;
  };
  accessToken: string;
  refreshToken: string;
}

export interface RefreshTokenResponse {
  success: boolean;
  accessToken: string;
  refreshToken: string;
}

export interface MessageResponse {
  success: boolean;
  message: string;
}
