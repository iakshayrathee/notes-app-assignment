export interface User {
  id: string;
  name: string;
  email: string;
  dateOfBirth?: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface SignupData {
  name: string;
  email: string;
  dateOfBirth?: string;
}

export interface SigninData {
  email: string;
  password: string;
}

export interface OTPVerificationData {
  userId: string;
  otp: string;
}
