import express from 'express';
import { Connection } from '../models/Connection.js';
import { Notification } from '../models/Notification.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// @route   GET /api/connections
// @desc    Get current user connections
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const connections = await Connection.find({
      $or: [{ requesterId: req.user._id }, { receiverId: req.user._id }]
    })
      .populate('requesterId', 'fullName email avatar status location')
      .populate('receiverId', 'fullName email avatar status location');

    const mapped = connections.map((c) => {
      const obj = c.toObject();
      obj.id = obj._id.toString();
      if (obj.requesterId && obj.requesterId._id) {
        obj.requesterId = obj.requesterId._id.toString();
      }
      if (obj.receiverId && obj.receiverId._id) {
        obj.receiverId = obj.receiverId._id.toString();
      }
      return obj;
    });
    res.json(mapped);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/connections/request
// @desc    Send connection request to a user
// @access  Private
router.post('/request', protect, async (req, res) => {
  try {
    const { receiverId } = req.body;

    if (!receiverId) {
      return res.status(400).json({ message: 'Receiver ID is required.' });
    }

    if (receiverId.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot connect with yourself.' });
    }

    const existing = await Connection.findOne({
      $or: [
        { requesterId: req.user._id, receiverId },
        { requesterId: receiverId, receiverId: req.user._id }
      ]
    });

    if (existing) {
      const obj = existing.toObject();
      obj.id = obj._id.toString();
      return res.json(obj);
    }

    const connection = await Connection.create({
      requesterId: req.user._id,
      receiverId,
      status: 'Pending'
    });

    await Notification.create({
      userId: receiverId,
      title: 'New Connection Request',
      message: `${req.user.fullName} sent you a connection request.`,
      type: 'connection',
      relatedId: connection._id.toString()
    });

    const obj = connection.toObject();
    obj.id = obj._id.toString();
    res.status(201).json(obj);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/connections/:id/status
// @desc    Update connection status (Accepted, Rejected, Removed)
// @access  Private
router.put('/:id/status', protect, async (req, res) => {
  try {
    const { status } = req.body;
    const connection = await Connection.findById(req.params.id);

    if (!connection) {
      return res.status(404).json({ message: 'Connection not found' });
    }

    const reqId = connection.requesterId._id || connection.requesterId;
    const recId = connection.receiverId._id || connection.receiverId;

    if (
      recId.toString() !== req.user._id.toString() &&
      reqId.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (status === 'Removed' || status === 'Rejected') {
      await connection.deleteOne();
      return res.json({ message: 'Connection removed', id: req.params.id });
    }

    connection.status = status;
    await connection.save();

    // Notify requester if accepted
    const otherUser = reqId.toString() === req.user._id.toString() ? recId : reqId;
    await Notification.create({
      userId: otherUser,
      title: `Connection ${status}`,
      message: `${req.user.fullName} ${status.toLowerCase()} your connection request.`,
      type: 'connection',
      relatedId: connection._id.toString()
    });

    const obj = connection.toObject();
    obj.id = obj._id.toString();
    res.json(obj);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
