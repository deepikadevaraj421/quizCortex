const mongoose = require('mongoose');

const recentActivitySchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['quiz_completed', 'student_registered'],
    required: true
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  studentName: {
    type: String,
    required: true
  },
  quizId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz'
  },
  quizTitle: {
    type: String
  },
  score: {
    type: Number
  },
  totalQuestions: {
    type: Number
  },
  percentage: {
    type: Number
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('RecentActivity', recentActivitySchema);