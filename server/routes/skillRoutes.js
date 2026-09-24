import express from 'express';
import { Skill } from '../models/Skill.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// @route   GET /api/skills
// @desc    Get all skills with optional filters (category, type, search)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, type, search, userId } = req.query;
    let filter = {};

    if (category) filter.category = category;
    if (type) filter.type = type;
    if (userId) filter.userId = userId;
    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }

    const skills = await Skill.find(filter).populate('userId', 'fullName avatar username');
    const mapped = skills.map((s) => {
      const obj = s.toObject();
      obj.id = obj._id.toString();
      if (obj.userId && obj.userId._id) {
        obj.userId = obj.userId._id.toString();
      }
      return obj;
    });
    res.json(mapped);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/skills
// @desc    Add a new skill
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { type, name, category, proficiency, yearsExperience, priority, targetProficiency, description } = req.body;

    if (!type || !name || !category) {
      return res.status(400).json({ message: 'Type, name, and category are required.' });
    }

    const skill = await Skill.create({
      userId: req.user._id,
      type,
      name,
      category,
      proficiency: proficiency || 'Intermediate',
      yearsExperience: yearsExperience || 1,
      priority: priority || 'Medium',
      targetProficiency: targetProficiency || 'Intermediate',
      description: description || ''
    });

    const obj = skill.toObject();
    obj.id = obj._id.toString();
    obj.userId = req.user._id.toString();
    res.status(201).json(obj);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/skills/:id
// @desc    Update a skill
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }

    if (skill.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this skill' });
    }

    Object.assign(skill, req.body);
    const updated = await skill.save();
    const obj = updated.toObject();
    obj.id = obj._id.toString();
    obj.userId = obj.userId.toString();
    res.json(obj);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/skills/:id
// @desc    Delete a skill
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }

    if (skill.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this skill' });
    }

    await skill.deleteOne();
    res.json({ message: 'Skill removed successfully', id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
