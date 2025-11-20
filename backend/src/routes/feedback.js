import express from 'express';
import Feedback from '../models/Feedback.js';

const router = express.Router();

// POST - Submit feedback
router.post('/', async (req, res) => {
  try {
    const { name, email, rating, category, message } = req.body;

    // Validation
    if (!name || !email || !rating || !category || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    // Create new feedback
    const feedback = new Feedback({
      name,
      email,
      rating,
      category,
      message
    });

    await feedback.save();

    res.status(201).json({ 
      message: 'Feedback submitted successfully',
      feedback 
    });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({ error: 'Failed to submit feedback' });
  }
});

// GET - Retrieve all feedback (optional - for admin dashboard)
router.get('/', async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.json(feedbacks);
  } catch (error) {
    console.error('Error fetching feedback:', error);
    res.status(500).json({ error: 'Failed to fetch feedback' });
  }
});

export default router;
