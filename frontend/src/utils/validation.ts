export const validateEmail = (email: string): string | null => {
  if (!email) return 'Email is required';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return 'Please enter a valid email address';
  return null;
};

export const validateName = (name: string): string | null => {
  if (!name) return 'Name is required';
  if (name.trim().length < 2) return 'Name must be at least 2 characters';
  return null;
};

export const validateOTP = (otp: string): string | null => {
  if (!otp) return 'OTP is required';
  if (!/^\d{6}$/.test(otp)) return 'OTP must be 6 digits';
  return null;
};

export const validatePassword = (password: string): string | null => {
  if (!password) return 'Password is required';
  if (password.length < 6) return 'Password must be at least 6 characters';
  return null;
};

export const validateDateOfBirth = (date: string): string | null => {
  if (!date) return null; // Optional field
  const birthDate = new Date(date);
  const today = new Date();
  const age = today.getFullYear() - birthDate.getFullYear();
  if (age < 13) return 'You must be at least 13 years old';
  if (age > 120) return 'Please enter a valid date of birth';
  return null;
};
