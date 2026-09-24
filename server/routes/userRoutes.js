import express from 'express';
import { User } from '../models/User.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// @route   GET /api/users
// @desc    Get all users (directory/search)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};

    if (search) {
      query = {
        $or: [
          { fullName: { $regex: search, $options: 'i' } },
          { username: { $regex: search, $options: 'i' } },
          { bio: { $regex: search, $options: 'i' } },
          { location: { $regex: search, $options: 'i' } }
        ]
      };
    }

    const users = await User.find(query).select('-password');
    const mapped = users.map((u) => {
      const obj = u.toObject();
      obj.id = obj._id.toString();
      return obj;
    });
    res.json(mapped);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/users/:id
// @desc    Get user profile by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const obj = user.toObject();
    obj.id = obj._id.toString();
    res.json(obj);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/users/profile
// @desc    Update current user profile
// @access  Private
router.put('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const {
      fullName,
      status,
      location,
      institution,
      education,
      experience,
      bio,
      avatar,
      portfolio,
      github,
      linkedin,
      interests
    } = req.body;

    if (fullName) user.fullName = fullName;
    if (status) user.status = status;
    if (location !== undefined) user.location = location;
    if (institution !== undefined) user.institution = institution;
    if (education !== undefined) user.education = education;
    if (experience !== undefined) user.experience = experience;
    if (bio !== undefined) user.bio = bio;
    if (avatar) user.avatar = avatar;
    if (portfolio !== undefined) user.portfolio = portfolio;
    if (github !== undefined) user.github = github;
    if (linkedin !== undefined) user.linkedin = linkedin;
    if (interests) user.interests = interests;

    const updatedUser = await user.save();
    const obj = updatedUser.toObject();
    delete obj.password;
    obj.id = obj._id.toString();
    res.json(obj);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
