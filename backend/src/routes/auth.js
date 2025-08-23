import express from 'express';
import rateLimit from 'express-rate-limit';
import { OAuth2Client } from 'google-auth-library';
import { 
  register, 
  login, 
  getMe,
  getSummaryHistory 
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { validateRegister, validateLogin } from '../middleware/validation.js'; // ✅ Correct import

const router = express.Router();

// Rate limiting
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later'
  }
});

export const googleAuth = async (req, res) => {
  try {
    const { token } = req.body;
    
    // Verify the Google token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    
    const payload = ticket.getPayload();
    const { sub, email, name, picture } = payload;
    
    // Check if user already exists
    let user = await User.findOne({ email });
    
    if (!user) {
      // Create new user
      user = await User.create({
        name,
        email,
        password: 'google-auth', // Placeholder password for Google users
        googleId: sub,
        profilePicture: picture
      });
    } else if (!user.googleId) {
      // Link existing user with Google
      user.googleId = sub;
      user.profilePicture = picture;
      await user.save();
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
    console.error('Google auth error:', error);
    res.status(500).json({
      success: false,
      message: 'Google authentication failed'
    });
  }
};

// Public routes
router.post('/register', authLimiter, validateRegister, register);
router.post('/login', authLimiter, validateLogin, login);
router.post('/google', googleAuth);
// Protected routes
router.get('/me', protect, getMe);
router.get('/summaries', protect, getSummaryHistory);

export default router;
