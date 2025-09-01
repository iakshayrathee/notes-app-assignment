const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Network error' }));
    throw new ApiError(response.status, errorData.message || 'Something went wrong');
  }
  return response.json();
};

export const api = {
  // Auth endpoints
  signup: async (data: { name: string; email: string; dateOfBirth?: string }) => {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  verifyOTP: async (data: { userId: string; otp: string }) => {
    const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  signin: async (data: { email: string }) => {
    const response = await fetch(`${API_BASE_URL}/auth/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  verifySigninOTP: async (data: { userId: string; otp: string }) => {
    const response = await fetch(`${API_BASE_URL}/auth/verify-signin-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  googleAuth: async (token: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });
    return handleResponse(response);
  },

  // Notes endpoints
  getNotes: async (token: string) => {
    const response = await fetch(`${API_BASE_URL}/notes`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    return handleResponse(response);
  },

  createNote: async (token: string, data: { title: string; content: string }) => {
    const response = await fetch(`${API_BASE_URL}/notes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  updateNote: async (token: string, id: string, data: { title: string; content: string }) => {
    const response = await fetch(`${API_BASE_URL}/notes/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  deleteNote: async (token: string, id: string) => {
    const response = await fetch(`${API_BASE_URL}/notes/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    return handleResponse(response);
  },
};
