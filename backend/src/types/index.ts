export interface User {
    _id?: string;
    name: string;
    email: string;
    dateOfBirth?: Date;
    password?: string;
    googleId?: string;
    isVerified: boolean;
    createdAt?: Date;
    updatedAt?: Date;
  }
  
  export interface Note {
    _id?: string;
    title: string;
    content: string;
    userId: string;
    createdAt?: Date;
    updatedAt?: Date;
  }
  
  export interface AuthRequest extends Request {
    user?: User;
  }
  
  export interface JWTPayload {
    userId: string;
    email: string;
  }
  