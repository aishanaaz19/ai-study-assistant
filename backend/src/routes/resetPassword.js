import express from 'express';
import crypto from 'crypto';
import User from '../models/User.js';

// Enforce: at least one letter, one number, one special char, min 6 chars
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{6,}$/;

const router = express.Router();

router.post('/:token', async (req, res) => {
  const { password } = req.body;

  // Validate password by regex
  if (!password || !passwordRegex.test(password)) {
    return res.status(400).json({
      message: 'Password must be at least 6 characters, include one letter, one number, and one special character.'
    });
  }

  const resetTokenHash = crypto.createHash('sha256').update(req.params.token).digest('hex');
  const user = await User.findOne({
    resetPasswordToken: resetTokenHash,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({ message: 'Token is invalid or expired.' });
  }

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  res.status(200).json({ message: 'Password successfully reset. You can now log in.' });
});

export default router;
