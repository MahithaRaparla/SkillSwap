import express from 'express';
import { Review } from '../models/Review.js';
import { Notification } from '../models/Notification.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// @route   GET /api/reviews/user/:id
// @desc    Get reviews received by a specific user
// @access  Public
router.get('/user/:id', async (req, res) => {
  try {
    const reviews = await Review.find({ reviewedUserId: req.params.id })
      .populate('reviewerId', 'fullName avatar')
      .sort({ createdAt: -1 });

    const mapped = reviews.map((r) => {
      const obj = r.toObject();
      obj.id = obj._id.toString();
      return obj;
    });

    // Calculate average rating
    const avgRating =
      reviews.length > 0
        ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1)
        : 5.0;

    res.json({ reviews: mapped, averageRating: Number(avgRating), totalReviews: reviews.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/reviews
// @desc    Create a review for a user after a session
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { reviewedUserId, sessionId, rating, comment } = req.body;

    if (!reviewedUserId || !rating) {
      return res.status(400).json({ message: 'Reviewed user and rating are required.' });
    }

    if (reviewedUserId.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot review yourself.' });
    }

    // Check duplicate review for same session
    if (sessionId) {
      const existing = await Review.findOne({
        reviewerId: req.user._id,
        sessionId
      });
      if (existing) {
        return res.status(400).json({ message: 'You have already submitted a review for this session.' });
      }
    }

    const review = await Review.create({
      reviewerId: req.user._id,
      reviewedUserId,
      sessionId: sessionId || null,
      rating: Number(rating),
      comment: comment || ''
    });

    await Notification.create({
      userId: reviewedUserId,
      title: 'New Review Received ⭐',
      message: `${req.user.fullName} left you a ${rating}-star review!`,
      type: 'system',
      relatedId: review._id.toString()
    });

    const obj = review.toObject();
    obj.id = obj._id.toString();
    res.status(201).json(obj);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
