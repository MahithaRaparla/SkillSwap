import express from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'skillbridge_jwt_secret_key_2026_super_secure', {
    expiresIn: '30d'
  });
};

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, fullName, status, location, bio, interests } = req.body;

    if (!username || !email || !password || !fullName) {
      return res.status(400).json({ message: 'Please provide all required fields (username, email, password, fullName).' });
    }

    const emailExists = await User.findOne({ email: email.toLowerCase() });
    if (emailExists) {
      return res.status(400).json({ message: 'An account with this email already exists.' });
    }

    const usernameExists = await User.findOne({ username: username.toLowerCase() });
    if (usernameExists) {
      return res.status(400).json({ message: 'Username is already taken.' });
    }

    const user = await User.create({
      username,
      email,
      password,
      fullName,
      status: status || 'Student',
      location: location || '',
      bio: bio || 'New learner on SkillBridge eager to share and discover skills!',
      interests: interests || ['Programming']
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        id: user._id.toString(),
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        status: user.status,
        avatar: user.avatar,
        bio: user.bio,
        location: user.location,
        interests: user.interests,
        token: generateToken(user._id)
      });
    } else {
      res.status(400).json({ message: 'Invalid user data.' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { emailOrUsername, password } = req.body;

    if (!emailOrUsername || !password) {
      return res.status(400).json({ message: 'Please provide email/username and password.' });
    }

    const user = await User.findOne({
      $or: [
        { email: emailOrUsername.toLowerCase() },
        { username: emailOrUsername.toLowerCase() }
      ]
    });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        id: user._id.toString(),
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        status: user.status,
        avatar: user.avatar,
        bio: user.bio,
        location: user.location,
        institution: user.institution,
        education: user.education,
        experience: user.experience,
        portfolio: user.portfolio,
        github: user.github,
        linkedin: user.linkedin,
        interests: user.interests,
        joinedDate: user.joinedDate,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid email/username or password.' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/auth/me
// @desc    Get current authenticated user profile
// @access  Private
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const userObj = user.toObject();
    userObj.id = userObj._id.toString();
    res.json(userObj);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
