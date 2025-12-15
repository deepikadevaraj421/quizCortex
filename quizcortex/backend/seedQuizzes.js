const mongoose = require("mongoose");
const Quiz = require("./models/Quiz");
const User = require("./models/User");
require("dotenv").config();

const dummyQuizzes = [
  {
    title: "JavaScript Fundamentals",
    description: "Test your knowledge of JavaScript basics",
    category: "Programming",
    questions: [
      {
        text: "What is the correct way to declare a variable in JavaScript?",
        options: ["var x = 5;", "variable x = 5;", "v x = 5;", "declare x = 5;"],
        correctAnswer: 0
      },
      {
        text: "Which method is used to add an element to the end of an array?",
        options: ["push()", "add()", "append()", "insert()"],
        correctAnswer: 0
      },
      {
        text: "What does '===' operator do in JavaScript?",
        options: ["Assignment", "Comparison without type checking", "Strict equality comparison", "Not equal"],
        correctAnswer: 2
      }
    ],
    allowedTo: "all",
    selectedStudents: []
  },
  {
    title: "World Geography Quiz",
    description: "Test your knowledge about countries and capitals",
    category: "Geography",
    questions: [
      {
        text: "What is the capital of Australia?",
        options: ["Sydney", "Melbourne", "Canberra", "Perth"],
        correctAnswer: 2
      },
      {
        text: "Which is the largest continent by area?",
        options: ["Africa", "Asia", "North America", "Europe"],
        correctAnswer: 1
      },
      {
        text: "The Nile River flows through which continent?",
        options: ["Asia", "Europe", "Africa", "South America"],
        correctAnswer: 2
      },
      {
        text: "Which country has the most time zones?",
        options: ["Russia", "USA", "China", "Canada"],
        correctAnswer: 0
      }
    ],
    allowedTo: "all",
    selectedStudents: []
  },
  {
    title: "Basic Mathematics",
    description: "Fundamental math concepts and calculations",
    category: "Mathematics",
    questions: [
      {
        text: "What is 15 × 8?",
        options: ["120", "125", "115", "130"],
        correctAnswer: 0
      },
      {
        text: "What is the square root of 144?",
        options: ["11", "12", "13", "14"],
        correctAnswer: 1
      },
      {
        text: "If a triangle has angles of 60°, 60°, and x°, what is x?",
        options: ["30°", "45°", "60°", "90°"],
        correctAnswer: 2
      },
      {
        text: "What is 25% of 200?",
        options: ["25", "50", "75", "100"],
        correctAnswer: 1
      },
      {
        text: "What is the value of π (pi) approximately?",
        options: ["3.14", "3.41", "2.14", "4.13"],
        correctAnswer: 0
      }
    ],
    allowedTo: "all",
    selectedStudents: []
  },
  {
    title: "Science Basics",
    description: "General science knowledge test",
    category: "Science",
    questions: [
      {
        text: "What is the chemical symbol for water?",
        options: ["H2O", "CO2", "NaCl", "O2"],
        correctAnswer: 0
      },
      {
        text: "How many bones are in the adult human body?",
        options: ["196", "206", "216", "226"],
        correctAnswer: 1
      },
      {
        text: "What planet is known as the Red Planet?",
        options: ["Venus", "Jupiter", "Mars", "Saturn"],
        correctAnswer: 2
      },
      {
        text: "What gas do plants absorb from the atmosphere during photosynthesis?",
        options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"],
        correctAnswer: 2
      }
    ],
    allowedTo: "all",
    selectedStudents: []
  },
  {
    title: "World History",
    description: "Important events and figures in world history",
    category: "History",
    questions: [
      {
        text: "In which year did World War II end?",
        options: ["1944", "1945", "1946", "1947"],
        correctAnswer: 1
      },
      {
        text: "Who was the first person to walk on the moon?",
        options: ["Buzz Aldrin", "Neil Armstrong", "John Glenn", "Alan Shepard"],
        correctAnswer: 1
      },
      {
        text: "The Great Wall of China was built to protect against invasions from which direction?",
        options: ["South", "East", "West", "North"],
        correctAnswer: 3
      },
      {
        text: "Which ancient wonder of the world was located in Alexandria?",
        options: ["Hanging Gardens", "Lighthouse", "Colossus", "Mausoleum"],
        correctAnswer: 1
      },
      {
        text: "The Renaissance period began in which country?",
        options: ["France", "Germany", "Italy", "Spain"],
        correctAnswer: 2
      }
    ],
    allowedTo: "all",
    selectedStudents: []
  }
];

async function seedQuizzes() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // Find a teacher user to assign as creator
    const teacher = await User.findOne({ role: "teacher" });
    if (!teacher) {
      console.log("No teacher found. Please create a teacher account first.");
      process.exit(1);
    }

    // Delete existing quizzes (optional)
    await Quiz.deleteMany({});
    console.log("Cleared existing quizzes");

    // Create quizzes with teacher as creator
    const quizzesWithCreator = dummyQuizzes.map(quiz => ({
      ...quiz,
      createdBy: teacher._id
    }));

    const createdQuizzes = await Quiz.insertMany(quizzesWithCreator);
    console.log(`Created ${createdQuizzes.length} dummy quizzes successfully!`);

    // Display created quizzes
    createdQuizzes.forEach((quiz, index) => {
      console.log(`${index + 1}. ${quiz.title} (${quiz.questions.length} questions)`);
    });

    process.exit(0);
  } catch (error) {
    console.error("Error seeding quizzes:", error);
    process.exit(1);
  }
}

seedQuizzes();