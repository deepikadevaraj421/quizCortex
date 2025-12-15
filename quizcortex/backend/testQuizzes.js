const mongoose = require("mongoose");
const Quiz = require("./models/Quiz");
const User = require("./models/User");
require("dotenv").config();

async function testQuizzes() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // Check if quizzes exist
    const quizCount = await Quiz.countDocuments();
    console.log(`Total quizzes in database: ${quizCount}`);

    // Get all quizzes
    const quizzes = await Quiz.find().populate("createdBy", "name");
    console.log("Quizzes found:");
    quizzes.forEach((quiz, index) => {
      console.log(`${index + 1}. ${quiz.title} - ${quiz.questions.length} questions - Created by: ${quiz.createdBy?.name || 'Unknown'}`);
    });

    // Check teachers
    const teachers = await User.find({ role: "teacher" });
    console.log(`\nTeachers found: ${teachers.length}`);
    teachers.forEach(teacher => {
      console.log(`- ${teacher.name} (${teacher.email})`);
    });

    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

testQuizzes();