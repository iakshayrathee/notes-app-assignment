import { Request, Response } from 'express';
import { OAuth2Client } from 'google-auth-library';
import User from '../models/User';
import { generateToken } from '../utils/jwt';
import { generateOTP, sendOTPEmail, sendWelcomeEmail } from '../utils/email';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const signup = async (req: Request, res: Response) => {
  try {
    const { name, email, dateOfBirth } = req.body;

    // Validation
    if (!name || !email) {
      return res.status(400).json({ message: 'Name and email are required' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Generate and send OTP
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    const user = new User({
      name,
      email,
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
      otp,
      otpExpires,
      isVerified: false
    });

    await user.save();

    try {
      await sendOTPEmail(email, otp, name);
      res.status(201).json({ 
        message: 'User created successfully. OTP sent to email.',
        userId: user._id 
      });
    } catch (emailError) {
      console.error('Email error details:', emailError);
      // For development: log OTP to console if email fails
      console.log('=== DEVELOPMENT OTP ===');
      console.log(`Email: ${email}`);
      console.log(`OTP: ${otp}`);
      console.log('=====================');
      
      res.status(201).json({ 
        message: 'User created successfully. Check console for OTP (email service unavailable).',
        userId: user._id 
      });
    }
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const verifyOTP = async (req: Request, res: Response) => {
  try {
    const { userId, otp } = req.body;

    if (!userId || !otp) {
      return res.status(400).json({ message: 'User ID and OTP are required' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: 'User already verified' });
    }

    if (!user.otp || !user.otpExpires) {
      return res.status(400).json({ message: 'No OTP found for this user' });
    }

    if (user.otpExpires < new Date()) {
      return res.status(400).json({ message: 'OTP has expired' });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    // Send welcome email after successful verification
    try {
      await sendWelcomeEmail(user.email, user.name);
    } catch (error) {
      console.error('Failed to send welcome email:', error);
      // Don't fail the verification if welcome email fails
    }

    const token = generateToken({ userId: user._id.toString(), email: user.email });

    res.json({
      message: 'Email verified successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        dateOfBirth: user.dateOfBirth
      }
    });
  } catch (error) {
    console.error('OTP verification error:', error);
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

    const jwtToken = generateToken({ userId: user._id.toString(), email: user.email });

    res.json({
      message: 'Google authentication successful',
      token: jwtToken,
      user: {
        id: user._id,
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
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found. Please sign up first.' });
    }

    if (!user.isVerified) {
      return res.status(401).json({ message: 'Please verify your email first' });
    }

    // Generate and send OTP for signin
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    try {
      await sendOTPEmail(email, otp, user.name);
      res.json({ 
        message: 'OTP sent to your email. Please verify to sign in.',
        userId: user._id 
      });
    } catch (emailError) {
      console.error('Email error details:', emailError);
      // For development: log OTP to console if email fails
      console.log('=== DEVELOPMENT OTP ===');
      console.log(`Email: ${email}`);
      console.log(`OTP: ${otp}`);
      console.log('=====================');
      
      res.json({ 
        message: 'OTP generated. Check console for OTP (email service unavailable).',
        userId: user._id 
      });
    }
  } catch (error) {
    console.error('Signin error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const verifySigninOTP = async (req: Request, res: Response) => {
  try {
    const { userId, otp } = req.body;

    if (!userId || !otp) {
      return res.status(400).json({ message: 'User ID and OTP are required' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.isVerified) {
      return res.status(401).json({ message: 'User not verified' });
    }

    if (!user.otp || !user.otpExpires) {
      return res.status(400).json({ message: 'No OTP found for this user' });
    }

    if (user.otpExpires < new Date()) {
      return res.status(400).json({ message: 'OTP has expired' });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // Clear OTP after successful verification
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    const token = generateToken({ userId: user._id.toString(), email: user.email });

    res.json({
      message: 'Sign in successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        dateOfBirth: user.dateOfBirth
      }
    });
  } catch (error) {
    console.error('Signin OTP verification error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
