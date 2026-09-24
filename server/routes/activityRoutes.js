import express from 'express';
import { Activity } from '../models/Activity.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// @route   GET /api/activities
// @desc    Get user activity logs
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const activities = await Activity.find({ userId: req.user._id }).sort({ date: -1 });
    const mapped = activities.map((a) => {
      const obj = a.toObject();
      obj.id = obj._id.toString();
      return obj;
    });
    res.json(mapped);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/activities
// @desc    Log a new activity session
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { title, skill, category, activityType, sessionType, date, durationMinutes, partnerId, partnerName, description, rating, notes } = req.body;

    if (!title || !skill) {
      return res.status(400).json({ message: 'Title and skill are required.' });
    }

    const activity = await Activity.create({
      userId: req.user._id,
      title,
      skill,
      category: category || 'Programming & Tech',
      activityType: activityType || 'Self Learning',
      sessionType: sessionType || 'Self Learning',
      date: date || new Date().toISOString().split('T')[0],
      durationMinutes: Number(durationMinutes) || 60,
      partnerId: partnerId || null,
      partnerName: partnerName || null,
      description: description || '',
      rating: Number(rating) || 5,
      notes: notes || ''
    });

    const obj = activity.toObject();
    obj.id = obj._id.toString();
    res.status(201).json(obj);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/activities/:id
// @desc    Delete an activity log entry
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);
    if (!activity) {
      return res.status(404).json({ message: 'Activity log not found' });
    }

    if (activity.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await activity.deleteOne();
    res.json({ message: 'Activity deleted', id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
