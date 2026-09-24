import express from 'express';
import { Message } from '../models/Message.js';
import { Notification } from '../models/Notification.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// @route   GET /api/messages/:userId
// @desc    Get conversation messages between current user and target user
// @access  Private
router.get('/:userId', protect, async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { senderId: req.user._id, receiverId: req.params.userId },
        { senderId: req.params.userId, receiverId: req.user._id }
      ]
    }).sort({ createdAt: 1 });

    const mapped = messages.map((m) => {
      const obj = m.toObject();
      obj.id = obj._id.toString();
      return obj;
    });
    res.json(mapped);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/messages
// @desc    Send a message to a peer
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { receiverId, content } = req.body;

    if (!receiverId || !content) {
      return res.status(400).json({ message: 'Receiver and content are required.' });
    }

    const message = await Message.create({
      senderId: req.user._id,
      receiverId,
      content,
      read: false
    });

    await Notification.create({
      userId: receiverId,
      title: 'New Message',
      message: `${req.user.fullName}: "${content.substring(0, 40)}${content.length > 40 ? '...' : ''}"`,
      type: 'system',
      relatedId: message._id.toString()
    });

    const obj = message.toObject();
    obj.id = obj._id.toString();
    res.status(201).json(obj);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/messages/:id/read
// @desc    Mark a message as read
// @access  Private
router.put('/:id/read', protect, async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    if (message.receiverId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    message.read = true;
    await message.save();

    const obj = message.toObject();
    obj.id = obj._id.toString();
    res.json(obj);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
