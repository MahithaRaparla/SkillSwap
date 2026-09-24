import express from 'express';
import { Goal } from '../models/Goal.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// @route   GET /api/goals
// @desc    Get current user goals
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const goals = await Goal.find({ userId: req.user._id }).sort({ createdAt: -1 });
    const mapped = goals.map((g) => {
      const obj = g.toObject();
      obj.id = obj._id.toString();
      return obj;
    });
    res.json(mapped);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/goals
// @desc    Create a new goal
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { title, skill, category, description, targetCompletionDate, targetLevel, priority, milestones } = req.body;

    if (!title || !skill) {
      return res.status(400).json({ message: 'Title and skill are required.' });
    }

    const goal = await Goal.create({
      userId: req.user._id,
      title,
      skill,
      category: category || 'Programming & Tech',
      description: description || '',
      startDate: new Date().toISOString().split('T')[0],
      targetCompletionDate: targetCompletionDate || '',
      targetLevel: targetLevel || 'Intermediate',
      priority: priority || 'Medium',
      status: 'Active',
      milestones: milestones || []
    });

    const obj = goal.toObject();
    obj.id = obj._id.toString();
    res.status(201).json(obj);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/goals/:id
// @desc    Update a goal
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);
    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    if (goal.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    Object.assign(goal, req.body);

    if (req.body.milestones && req.body.milestones.length > 0) {
      const completedCount = req.body.milestones.filter((m) => m.completed).length;
      goal.currentProgress = Math.round((completedCount / req.body.milestones.length) * 100);
      if (goal.currentProgress === 100) {
        goal.status = 'Completed';
      }
    }

    await goal.save();
    const obj = goal.toObject();
    obj.id = obj._id.toString();
    res.json(obj);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/goals/:id
// @desc    Delete a goal
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);
    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    if (goal.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await goal.deleteOne();
    res.json({ message: 'Goal removed', id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
