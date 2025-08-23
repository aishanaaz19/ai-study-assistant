import express from 'express';
import rateLimit from 'express-rate-limit';
import { OAuth2Client } from 'google-auth-library'; // ✅ Add this import
import { 
  register, 
  login, 
  getMe,
  getSummaryHistory 
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { validateRegister, validateLogin } from '../middleware/validation.js';
import { generateToken } from '../utils/jwt.js';
import User from '../models/User.js';

const router = express.Router();

// ✅ Initialize Google OAuth client
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Rate limiting
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later'
  }
});

// ✅ Google Auth Route (Fixed)
const googleAuth = async (req, res) => {
  try {
    const { token } = req.body;
    
    console.log('📥 Received Google token:', token ? 'Present' : 'Missing');
    
    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'No token provided'
      });
    }

    // Verify the Google token using the initialized client
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    
    const payload = ticket.getPayload();
    console.log('✅ Token verified for:', payload.email);
    
    const { sub, email, name, picture } = payload;
    
    // Check if user already exists
    let user = await User.findOne({ email });
    
    if (!user) {
      // Create new user
      user = await User.create({
        name,
        email,
        password: 'google-auth', // Placeholder for Google users
        googleId: sub,
        profilePicture: picture
      });
      console.log('👤 Created new user:', email);
    } else {
      // Update Google info if needed
      if (!user.googleId) {
        user.googleId = sub;
        user.profilePicture = picture;
        await user.save();
      }
      console.log('👤 Found existing user:', email);
    }

    // Generate JWT token
    const jwtToken = generateToken({ id: user._id, email: user.email });

    res.json({
      success: true,
      message: 'Google login successful',
      token: jwtToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profilePicture: user.profilePicture
      }
    });

  } catch (error) {
    console.error('❌ Google auth error:', error);
    res.status(500).json({
      success: false,
      message: 'Google authentication failed: ' + error.message
    });
  }
};

// Public routes
router.post('/register', authLimiter, validateRegister, register);
router.post('/login', authLimiter, validateLogin, login);
router.post('/google', googleAuth); // ✅ Google auth route

// Protected routes
router.get('/me', protect, getMe);
router.get('/summaries', protect, getSummaryHistory);

export default router;
