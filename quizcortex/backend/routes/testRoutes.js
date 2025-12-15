const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { isTeacher, isStudent } = require("../middleware/roleMiddleware");

const router = express.Router();

router.get("/student", protect, isStudent, (req, res) => {
  res.json({ message: "Welcome Student Dashboard" });
});

router.get("/teacher", protect, isTeacher, (req, res) => {
  res.json({ message: "Welcome Teacher Dashboard" });
});
// router.post("/quizzes", authMiddleware, (req, res) => {
//   res.json({ message: "Quiz created", data: req.body });
// });
module.exports = router;
