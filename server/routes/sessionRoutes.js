import express from 'express';
import { Session } from '../models/Session.js';
import { Notification } from '../models/Notification.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// @route   GET /api/sessions
// @desc    Get user sessions (upcoming and past)
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const sessions = await Session.find({
      $or: [{ teacherId: req.user._id }, { learnerId: req.user._id }]
    })
      .populate('teacherId', 'fullName avatar email')
      .populate('learnerId', 'fullName avatar email')
      .sort({ date: 1 });

    const mapped = sessions.map((s) => {
      const obj = s.toObject();
      obj.id = obj._id.toString();
      if (obj.teacherId && obj.teacherId._id) obj.teacherId = obj.teacherId._id.toString();
      if (obj.learnerId && obj.learnerId._id) obj.learnerId = obj.learnerId._id.toString();
      return obj;
    });
    res.json(mapped);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/sessions
// @desc    Schedule a new learning session
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { teacherId, learnerId, skillName, date, time, durationMinutes, meetingLink, notes } = req.body;

    if (!teacherId || !learnerId || !skillName || !date) {
      return res.status(400).json({ message: 'Teacher, learner, skill, and date are required.' });
    }

    const session = await Session.create({
      teacherId,
      learnerId,
      skillName,
      date,
      time: time || '10:00 AM',
      durationMinutes: durationMinutes || 60,
      meetingLink: meetingLink || '',
      notes: notes || ''
    });

    const otherUser = teacherId.toString() === req.user._id.toString() ? learnerId : teacherId;
    await Notification.create({
      userId: otherUser,
      title: 'New Session Scheduled',
      message: `A session for "${skillName}" on ${date} has been scheduled.`,
      type: 'session',
      relatedId: session._id.toString()
    });

    const obj = session.toObject();
    obj.id = obj._id.toString();
    res.status(201).json(obj);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/sessions/:id
// @desc    Update session status or details
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    const tId = session.teacherId._id || session.teacherId;
    const lId = session.learnerId._id || session.learnerId;

    if (
      tId.toString() !== req.user._id.toString() &&
      lId.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    Object.assign(session, req.body);
    await session.save();

    const obj = session.toObject();
    obj.id = obj._id.toString();
    res.json(obj);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/sessions/:id
// @desc    Cancel/Delete a session
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    const tId = session.teacherId._id || session.teacherId;
    const lId = session.learnerId._id || session.learnerId;

    if (
      tId.toString() !== req.user._id.toString() &&
      lId.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await session.deleteOne();
    res.json({ message: 'Session cancelled', id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
