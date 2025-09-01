import { Request, Response } from 'express';
import { OAuth2Client } from 'google-auth-library';
import User from '../models/User';
import { generateToken } from '../utils/jwt';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const signup = async (req: Request, res: Response) => {
  try {
    const { name, email, password, dateOfBirth } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    const user = new User({
      name,
      email,
      password,
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
      isVerified: true // No email verification needed
    });

    await user.save();

    const token = generateToken({ userId: (user._id as string).toString(), email: user.email });

    res.status(201).json({ 
      message: 'User created successfully',
      token,
      user: {
        id: user._id as string,
        name: user.name,
        email: user.email,
        dateOfBirth: user.dateOfBirth
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


export const googleAuth = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: 'Google token is required' });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    if (!payload) {
      return res.status(400).json({ message: 'Invalid Google token' });
    }

    const { sub: googleId, email, name } = payload;

    if (!email || !name) {
      return res.status(400).json({ message: 'Incomplete Google profile' });
    }

    let user = await User.findOne({ $or: [{ email }, { googleId }] });

    if (user) {
      // Update Google ID if not set
      if (!user.googleId) {
        user.googleId = googleId;
        user.isVerified = true;
        await user.save();
      }
    } else {
      // Create new user
      user = new User({
        name,
        email,
        googleId,
        isVerified: true
      });
      await user.save();
    }

    const jwtToken = generateToken({ userId: (user._id as string).toString(), email: user.email });

    res.json({
      message: 'Google authentication successful',
      token: jwtToken,
      user: {
        id: user._id as string,
        name: user.name,
        email: user.email,
        dateOfBirth: user.dateOfBirth
      }
    });
  } catch (error) {
    console.error('Google auth error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const signin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }


    if (!user.password) {
      return res.status(401).json({ message: 'Please use Google sign-in for this account' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken({ userId: (user._id as string).toString(), email: user.email });

    res.json({
      message: 'Sign in successful',
      token,
      user: {
        id: user._id as string,
        name: user.name,
        email: user.email,
        dateOfBirth: user.dateOfBirth
      }
    });
  } catch (error) {
    console.error('Signin error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
