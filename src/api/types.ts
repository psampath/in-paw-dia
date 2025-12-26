export type UserRole = 'viewer' | 'editor' | 'admin';

export interface User {
  _id: string;
  email: string;
  role: UserRole;
  createdAt?: string;
}

export interface Pet {
  _id: string;
  name: string;
  type: 'dog' | 'cat';
  slug?: string;
  origin?: string;
  physical_appearance?: string;
  temperament?: string;
  lifespan?: string;
  care_requirements?: string;
  health_issues?: string;
  suitability?: string;
  weight_range?: string;
  size?: string;
  photos?: string[];
  traits?: Record<string, any>;
  species_id?: string;
  is_featured?: boolean;
  popularity_score?: number;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  success: boolean;
  user: User;
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

export interface UserResponse {
  success: boolean;
  user: User;
}

export interface PetsResponse {
  success: boolean;
  count: number;
  data: Pet[];
}

export interface PetResponse {
  success: boolean;
  data: Pet;
}

export interface ApiError {
  success: false;
  error: string;
}
