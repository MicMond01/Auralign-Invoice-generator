import type { Role } from "@/config/baseConfig";

export interface User {
  id:           string;
  email:        string;
  firstName:    string;
  lastName:     string;
  displayName:  string;
  avatarUrl?:   string;
  role:         Role;
  isVerified:   boolean;
  isActive:     boolean;
  permissions:  string[];
  createdAt:    string;
  updatedAt:    string;
  lastLoginAt?: string;
}

export interface AuthTokens {
  accessToken:  string;
  refreshToken: string;
  expiresIn:    number;
  tokenType:    "Bearer";
}

export interface AuthState {
  user:          User | null;
  tokens:        AuthTokens | null;
  isAuthenticated: boolean;
  isLoading:     boolean;
  error:         string | null;
}

export interface LoginRequest {
  email:    string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterRequest {
  email:       string;
  password:    string;
  firstName:   string;
  lastName:    string;
  confirmPassword: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token:           string;
  password:        string;
  confirmPassword: string;
}
