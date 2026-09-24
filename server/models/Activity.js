import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    title: {
      type: String,
      required: true
    },
    skill: {
      type: String,
      required: true
    },
    category: {
      type: String,
      default: 'Programming & Tech'
    },
    activityType: {
      type: String,
      default: 'Self Learning'
    },
    sessionType: {
      type: String,
      default: 'Self Learning'
    },
    date: {
      type: String,
      default: () => new Date().toISOString().split('T')[0]
    },
    durationMinutes: {
      type: Number,
      default: 60
    },
    partnerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    partnerName: {
      type: String,
      default: null
    },
    description: {
      type: String,
      default: ''
    },
    rating: {
      type: Number,
      default: 5
    },
    notes: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

export const Activity = mongoose.model('Activity', activitySchema);
