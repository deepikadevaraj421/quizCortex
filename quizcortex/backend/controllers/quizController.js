const Quiz = require("../models/Quiz");
const User = require("../models/User");
const QuizResult = require("../models/QuizResult");
const RecentActivity = require("../models/RecentActivity");

/* CREATE QUIZ (Teacher only) */
exports.createQuiz = async (req, res) => {
  try {
    const { title, description, category, questions, allowedTo, selectedStudents } = req.body;

    const quiz = await Quiz.create({
      title,
      description,
      category,
      questions,
      allowedTo,
      selectedStudents,
      createdBy: req.user.id,
    });

    const populatedQuiz = await Quiz.findById(quiz._id).populate("createdBy", "name");
    res.status(201).json(populatedQuiz);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* GET ALL QUIZZES (Student & Teacher) */
exports.getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find().populate("createdBy", "name");
    res.json(quizzes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* GET TEACHER'S QUIZZES */
exports.getTeacherQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find({ createdBy: req.user.id }).populate("createdBy", "name");
    res.json(quizzes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* GET STUDENTS COUNT */
exports.getStudentsCount = async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: "student" });
    const activeStudents = await User.countDocuments({ 
      role: "student",
      updatedAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } // Last 7 days
    });
    
    res.json({ totalStudents, activeStudents });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* GET ALL STUDENTS */
exports.getAllStudents = async (req, res) => {
  try {
    const students = await User.find({ role: "student" }).select("name email createdAt updatedAt");
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* TRACK STUDENT REGISTRATION */
exports.trackStudentRegistration = async (studentId, studentName) => {
  try {
    await RecentActivity.create({
      type: 'student_registered',
      studentId: studentId,
      studentName: studentName
    });
  } catch (err) {
    console.error('Failed to track student registration:', err);
  }
};

/* SUBMIT QUIZ RESULT */
exports.submitQuizResult = async (req, res) => {
  try {
    const { quizId, score, totalQuestions } = req.body;
    const percentage = Math.round((score / totalQuestions) * 100);
    
    const result = await QuizResult.create({
      student: req.user.id,
      quiz: quizId,
      score,
      totalQuestions,
      percentage
    });
    
    // Get quiz and student details for recent activity
    const quiz = await Quiz.findById(quizId);
    const student = await User.findById(req.user.id);
    
    // Create recent activity entry
    await RecentActivity.create({
      type: 'quiz_completed',
      studentId: req.user.id,
      studentName: student.name,
      quizId: quizId,
      quizTitle: quiz.title,
      score,
      totalQuestions,
      percentage
    });
    
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* GET STUDENT ANALYTICS */
exports.getStudentAnalytics = async (req, res) => {
  try {
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    
    // Most Active (most quiz attempts)
    const mostActive = await QuizResult.aggregate([
      {
        $group: {
          _id: "$student",
          quizCount: { $sum: 1 }
        }
      },
      { $sort: { quizCount: -1 } },
      { $limit: 1 },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "student"
        }
      }
    ]);
    
    // Top Performer (highest average score)
    const topPerformer = await QuizResult.aggregate([
      {
        $group: {
          _id: "$student",
          avgScore: { $avg: "$percentage" }
        }
      },
      { $sort: { avgScore: -1 } },
      { $limit: 1 },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "student"
        }
      }
    ]);
    
    // New This Week (students who took quizzes this week)
    const newThisWeek = await QuizResult.aggregate([
      {
        $match: {
          createdAt: { $gte: oneWeekAgo }
        }
      },
      {
        $group: {
          _id: "$student"
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "student"
        }
      }
    ]);
    
    res.json({
      mostActive: mostActive[0] || null,
      topPerformer: topPerformer[0] || null,
      newThisWeek: newThisWeek.length
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* GET RECENT ACTIVITIES */
exports.getRecentActivities = async (req, res) => {
  try {
    const activities = await RecentActivity.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('studentId', 'name')
      .populate('quizId', 'title');
    
    res.json(activities);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* GET STUDENT QUIZ RESULTS */
exports.getStudentResults = async (req, res) => {
  try {
    const results = await QuizResult.find({ student: req.user.id })
      .populate('quiz', 'title')
      .sort({ createdAt: -1 });
    
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
