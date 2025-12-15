import api from "./axios";

/* CREATE QUIZ (Teacher) */
export const createQuiz = async (quizData) => {
  const res = await api.post("/quizzes", quizData);
  return res.data;
};

/* GET ALL QUIZZES (Student) */
export const getAllQuizzes = async () => {
  const res = await api.get("/quizzes");
  return res.data;
};

/* GET TEACHER'S QUIZZES */
export const getTeacherQuizzes = async () => {
  const res = await api.get("/quizzes/teacher");
  return res.data;
};

/* GET STUDENTS COUNT */
export const getStudentsCount = async () => {
  const res = await api.get("/quizzes/students-count");
  return res.data;
};

/* GET ALL STUDENTS */
export const getAllStudents = async () => {
  const res = await api.get("/quizzes/students");
  return res.data;
};

/* SUBMIT QUIZ RESULT */
export const submitQuizResult = async (resultData) => {
  const res = await api.post("/quizzes/submit-result", resultData);
  return res.data;
};

/* GET STUDENT ANALYTICS */
export const getStudentAnalytics = async () => {
  const res = await api.get("/quizzes/analytics");
  return res.data;
};

/* GET RECENT ACTIVITIES */
export const getRecentActivities = async () => {
  const res = await api.get("/quizzes/recent-activities");
  return res.data;
};

/* GET STUDENT RESULTS */
export const getStudentResults = async () => {
  const res = await api.get("/quizzes/student-results");
  return res.data;
};
