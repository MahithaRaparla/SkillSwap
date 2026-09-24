import express from 'express';
import { SkillRequest } from '../models/SkillRequest.js';
import { Notification } from '../models/Notification.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// @route   POST /api/requests
// @desc    Create a skill exchange request
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { receiverId, skillName, message } = req.body;

    if (!receiverId || !skillName) {
      return res.status(400).json({ message: 'Receiver and skill name are required.' });
    }

    const request = await SkillRequest.create({
      requesterId: req.user._id,
      receiverId,
      skillName,
      message: message || '',
      status: 'pending'
    });

    // Generate notification for receiver
    await Notification.create({
      userId: receiverId,
      title: 'New Skill Exchange Request',
      message: `${req.user.fullName} requested to learn/exchange "${skillName}" with you.`,
      type: 'request',
      relatedId: request._id.toString()
    });

    const obj = request.toObject();
    obj.id = obj._id.toString();
    res.status(201).json(obj);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/requests/sent
// @desc    Get requests sent by current user
// @access  Private
router.get('/sent', protect, async (req, res) => {
  try {
    const requests = await SkillRequest.find({ requesterId: req.user._id })
      .populate('receiverId', 'fullName email avatar status location')
      .sort({ createdAt: -1 });
    const mapped = requests.map((r) => {
      const obj = r.toObject();
      obj.id = obj._id.toString();
      if (obj.requesterId && obj.requesterId._id) obj.requesterId = obj.requesterId._id.toString();
      if (obj.receiverId && obj.receiverId._id) obj.receiverId = obj.receiverId._id.toString();
      return obj;
    });
    res.json(mapped);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/requests/received
// @desc    Get requests received by current user
// @access  Private
router.get('/received', protect, async (req, res) => {
  try {
    const requests = await SkillRequest.find({ receiverId: req.user._id })
      .populate('requesterId', 'fullName email avatar status location')
      .sort({ createdAt: -1 });
    const mapped = requests.map((r) => {
      const obj = r.toObject();
      obj.id = obj._id.toString();
      if (obj.requesterId && obj.requesterId._id) obj.requesterId = obj.requesterId._id.toString();
      if (obj.receiverId && obj.receiverId._id) obj.receiverId = obj.receiverId._id.toString();
      return obj;
    });
    res.json(mapped);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/requests/:id/status
// @desc    Update request status (accepted, rejected, completed, cancelled)
// @access  Private
router.put('/:id/status', protect, async (req, res) => {
  try {
    const { status } = req.body;
    const request = await SkillRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    const reqId = request.requesterId._id || request.requesterId;
    const recId = request.receiverId._id || request.receiverId;

    if (
      recId.toString() !== req.user._id.toString() &&
      reqId.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    request.status = status;
    await request.save();

    // Notify original requester on accept/reject
    const notifyUser = reqId.toString() === req.user._id.toString() ? recId : reqId;
    await Notification.create({
      userId: notifyUser,
      title: `Skill Request ${status.toUpperCase()}`,
      message: `Your skill exchange request for "${request.skillName}" was updated to ${status}.`,
      type: 'request',
      relatedId: request._id.toString()
    });

    const obj = request.toObject();
    obj.id = obj._id.toString();
    res.json(obj);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
