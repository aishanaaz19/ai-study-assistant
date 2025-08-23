import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Summary schema for storing user's summary history
const summarySchema = new mongoose.Schema({
  content: {
    type: String,
    required: true
  },
  title: {
    type: String,
    default: 'Untitled Summary'
  },
  wordCount: {
    type: Number
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters long']
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'Password must be at least 6 characters long'],
    select: false // Don't include password in queries by default
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true // Allows multiple null values
  },
  profilePicture: {
    type: String
  },
  summaries: [summarySchema],
  isEmailVerified: {
    type: Boolean,
    default: true // Auto-verify Google users
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  // Only run if password is modified
  if (!this.isModified('password')) return next();

  // Hash password with salt of 12
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to add summary to user's history
userSchema.methods.addSummary = function(summaryData) {
  this.summaries.push({
    content: summaryData.content,
    title: summaryData.title || 'Untitled Summary',
    wordCount: summaryData.content.split(' ').length
  });
  return this.save();
};

// Method to get user's summary history
userSchema.methods.getSummaryHistory = function(limit = 10) {
  return this.summaries
    .sort({ createdAt: -1 })
    .slice(0, limit);
};

export default mongoose.model('User', userSchema);
