import express from 'express';
import crypto from 'crypto';
import User from '../models/User.js';
import { sendEmail } from '../utils/sendEmail.js';

const router = express.Router();

router.post('/', async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ message: 'Email is required.' });

  const user = await User.findOne({ email });
  if (!user) {
    // Always respond with generic message for privacy
    return res.status(200).json({ message: 'If this email is registered, a reset link was sent.' });
  }

  const resetToken = crypto.randomBytes(32).toString('hex');
  user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  user.resetPasswordExpire = Date.now() + 1000 * 60 * 30; // 30 min
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
  const message = `
    <p>You requested a password reset for StudyMate.</p>
    <p><a href="${resetUrl}" target="_blank" style="color:#4f46e5;"><b>Click here to reset your password</b></a></p>
    <p>This link expires in 30 minutes.</p>
  `;

  try {
    await sendEmail({
      email: user.email,
      subject: 'StudyMate Password Reset',
      message,
    });
    res.status(200).json({ message: 'If this email is registered, a reset link was sent.' });
  } catch (err) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    res.status(500).json({ message: 'Failed to send reset email.' });
  }
});

export default router;
