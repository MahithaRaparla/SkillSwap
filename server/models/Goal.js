import mongoose from 'mongoose';

const milestoneSchema = new mongoose.Schema({
  title: { type: String, required: true },
  completed: { type: Boolean, default: false },
  dateCompleted: { type: String, default: null }
});

const goalSchema = new mongoose.Schema(
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
    description: {
      type: String,
      default: ''
    },
    startDate: {
      type: String,
      default: () => new Date().toISOString().split('T')[0]
    },
    targetCompletionDate: {
      type: String,
      default: ''
    },
    currentProgress: {
      type: Number,
      default: 0
    },
    targetLevel: {
      type: String,
      default: 'Intermediate'
    },
    priority: {
      type: String,
      default: 'Medium'
    },
    status: {
      type: String,
      enum: ['Active', 'Completed', 'Paused'],
      default: 'Active'
    },
    milestones: [milestoneSchema]
  },
  {
    timestamps: true
  }
);

export const Goal = mongoose.model('Goal', goalSchema);
