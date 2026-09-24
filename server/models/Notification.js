import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    title: {
      type: String,
      default: 'Notification'
    },
    message: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['match', 'connection', 'streak', 'request', 'session', 'system'],
      default: 'system'
    },
    read: {
      type: Boolean,
      default: false
    },
    relatedId: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

export const Notification = mongoose.model('Notification', notificationSchema);
