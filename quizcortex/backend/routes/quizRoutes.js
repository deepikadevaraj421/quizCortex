const express = require("express");
const { createQuiz, getAllQuizzes, getTeacherQuizzes, getStudentsCount, getAllStudents, submitQuizResult, getStudentAnalytics, getRecentActivities, getStudentResults } = require("../controllers/quizController");
const { protect } = require("../middleware/authMiddleware");
const { isTeacher } = require("../middleware/roleMiddleware");

const router = express.Router();

router.post("/", protect, isTeacher, createQuiz);
router.get("/", protect, getAllQuizzes);
router.get("/teacher", protect, isTeacher, getTeacherQuizzes);
router.get("/students-count", protect, isTeacher, getStudentsCount);
router.get("/students", protect, isTeacher, getAllStudents);
router.post("/submit-result", protect, submitQuizResult);
router.get("/analytics", protect, isTeacher, getStudentAnalytics);
router.get("/recent-activities", protect, isTeacher, getRecentActivities);
router.get("/student-results", protect, getStudentResults);

module.exports = router;
