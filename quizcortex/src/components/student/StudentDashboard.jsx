import { useEffect,useState } from "react";
import { Home, BookOpen, BarChart3, LogOut, Play, Award, Search, Filter, User, Mail, ChevronDown } from 'lucide-react';
import { getAllQuizzes, submitQuizResult, getStudentResults } from "../../api/quiz";
export default function StudentDashboard({ studentName, onLogout }) {
 
  const [currentView, setCurrentView] = useState('dashboard');
  const [quizInProgress, setQuizInProgress] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [studentResults, setStudentResults] = useState([]);
  const [quizSearchQuery, setQuizSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [showProfile, setShowProfile] = useState(false);

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const studentInfo = {
    name: user?.name || studentName || "Student",
    email: user?.email || "student@mail.com",
    role: user?.role || "Student"
  };




  const startQuiz = () => {
    setQuizInProgress(true);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setShowResult(false);
  };

  const handleNextQuestion = async () => {
    let finalScore = score;
    if (selectedAnswer === selectedQuiz.questions[currentQuestion].correctAnswer) {
      finalScore = score + 1;
      setScore(finalScore);
    }

    if (currentQuestion + 1 < selectedQuiz.questions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    } else {
      // Submit quiz result to backend
      try {
        await submitQuizResult({
          quizId: selectedQuiz._id,
          score: finalScore,
          totalQuestions: selectedQuiz.questions.length
        });
      } catch (error) {
        console.error('Failed to submit quiz result:', error);
      }
      setShowResult(true);
    }
  };

  const Navigation = () => (
    <nav className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <BookOpen className="h-8 w-8 mr-2" />
            <span className="text-2xl font-bold">QuizCortex</span>
          </div>
          
          <div className="flex items-center space-x-6">
            <button 
              onClick={() => {
                setCurrentView('dashboard');
                setQuizInProgress(false);
                setShowResult(false);
              }}
              className={`flex items-center hover:text-indigo-200 transition ${currentView === 'dashboard' ? 'text-white font-semibold' : 'text-indigo-100'}`}
            >
              <Home className="h-5 w-5 mr-1" />
              <span>Dashboard</span>
            </button>
            
            <button 
              onClick={() => {
                setCurrentView('quizzes');
                setQuizInProgress(false);
                setShowResult(false);
              }}
              className={`flex items-center hover:text-indigo-200 transition ${currentView === 'quizzes' ? 'text-white font-semibold' : 'text-indigo-100'}`}
            >
              <BookOpen className="h-5 w-5 mr-1" />
              <span>Quizzes</span>
            </button>
            
            <button 
              onClick={() => {
                setCurrentView('progress');
                setQuizInProgress(false);
                setShowResult(false);
              }}
              className={`flex items-center hover:text-indigo-200 transition ${currentView === 'progress' ? 'text-white font-semibold' : 'text-indigo-100'}`}
            >
              <BarChart3 className="h-5 w-5 mr-1" />
              <span>Progress</span>
            </button>

            <div className="relative ml-4">
              <button
                onClick={() => setShowProfile(!showProfile)}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-white hover:bg-opacity-20 transition"
              >
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">
                  {studentInfo.name.charAt(0)}
                </div>
                <ChevronDown className="h-4 w-4 text-white" />
              </button>

              {showProfile && (
                <>
                  <div 
                    className="fixed inset-0 z-40"
                    onClick={() => setShowProfile(false)}
                  />
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-2xl border border-gray-200 z-50">
                    <div className="p-5 border-b border-gray-100">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="h-14 w-14 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
                          {studentInfo.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 text-lg">{studentInfo.name}</p>
                          <p className="text-sm text-gray-500">{studentInfo.role}</p>
                        </div>
                      </div>
                      <div className="flex items-center text-gray-700 bg-gray-50 px-3 py-2 rounded-lg">
                        <Mail className="h-4 w-4 mr-2 text-indigo-600" />
                        <span className="text-sm">{studentInfo.email}</span>
                      </div>
                    </div>

                    <div className="p-3">
                      <button
                        onClick={() => {
                          setShowProfile(false);
                          onLogout();
                        }}
                        className="w-full flex items-center justify-center px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition font-semibold"
                      >
                        <LogOut className="h-5 w-5 mr-2" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching data...');
        const [quizzesData, resultsData] = await Promise.all([
          getAllQuizzes(),
          getStudentResults()
        ]);
        console.log('Quizzes received:', quizzesData);
        console.log('Results received:', resultsData);
        setQuizzes(quizzesData);
        setStudentResults(resultsData);
      } catch (err) {
        console.error("Failed to fetch data", err);
      }
    };

    fetchData();
  }, []);
  

  const Dashboard = () => (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Student Dashboard</h1>
      <p className="text-xl text-gray-600 mb-8">Welcome back, {studentName}! 👋</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <button
          onClick={() => setCurrentView('quizzes')}
          className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl shadow-lg p-8 hover:from-indigo-600 hover:to-purple-700 transition transform hover:scale-105"
        >
          <BookOpen className="h-16 w-16 mx-auto mb-4" />
          <h3 className="text-2xl font-bold">Take a Quiz</h3>
          <p className="text-indigo-100 mt-3 text-lg">Test your knowledge and learn</p>
        </button>

        <button
          onClick={() => setCurrentView('progress')}
          className="bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-xl shadow-lg p-8 hover:from-green-600 hover:to-teal-700 transition transform hover:scale-105"
        >
          <Award className="h-16 w-16 mx-auto mb-4" />
          <h3 className="text-2xl font-bold">View Progress</h3>
          <p className="text-green-100 mt-3 text-lg">Track your learning journey</p>
        </button>
      </div>

      <div className="mt-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl shadow-lg p-6 text-white">
        <h3 className="text-xl font-bold mb-2">Quick Status</h3>
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="bg-white bg-opacity-20 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-blue-900">{studentResults.length}</div>
            <div className="text-sm mt-1 text-black">Quizzes Taken</div>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-blue-900">
              {studentResults.length > 0 
                ? Math.round(studentResults.reduce((sum, result) => sum + result.percentage, 0) / studentResults.length)
                : 0}%
            </div>
            <div className="text-sm mt-1 text-black">Avg Score</div>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-blue-900">
              {studentResults.length > 0 
                ? Math.max(...studentResults.map(result => result.percentage))
                : 0}%
            </div>
            <div className="text-sm mt-1 text-black">Best Score</div>
          </div>
        </div>
      </div>
    </div>
  );

  const QuizzesList = () => (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Available Quizzes</h1>

      <div className="mb-6 flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search quizzes..."
            value={quizSearchQuery}
            onChange={(e) => setQuizSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
        <select 
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        >
          <option>All Categories</option>
          {[...new Set(quizzes.map(quiz => quiz.category).filter(Boolean))].map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(() => {
          const filteredQuizzes = quizzes.filter(quiz => {
            const matchesSearch = quiz.title.toLowerCase().includes(quizSearchQuery.toLowerCase());
            const matchesCategory = selectedCategory === 'All Categories' || quiz.category === selectedCategory;
            return matchesSearch && matchesCategory;
          });
          
          return filteredQuizzes.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500 text-lg">No quizzes available yet.</p>
            <p className="text-gray-400 text-sm mt-2">Check console for errors or contact your teacher.</p>
          </div>
          ) : (
            filteredQuizzes.map((quiz) => (
            <div key={quiz._id} className="bg-white rounded-xl shadow-lg p-6">
              <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm">
                {quiz.category || 'Quiz'}
              </span>

              <h3 className="text-xl font-bold mt-3">{quiz.title}</h3>

              <p className="text-gray-600 mt-2">{quiz.description || 'No description'}</p>

              <p className="text-sm text-gray-500 mt-2">
                {quiz.questions?.length || 0} questions • Created by: {quiz.createdBy?.name || 'Unknown'}
              </p>

              <button
                onClick={() => {
                  if (quiz.questions && quiz.questions.length > 0) {
                    setSelectedQuiz(quiz);
                    setQuizInProgress(true);
                    setCurrentQuestion(0);
                    setScore(0);
                  } else {
                    alert('This quiz has no questions.');
                  }
                }}
                className="mt-4 w-full bg-indigo-600 text-white py-2 rounded"
              >
                Start Quiz
              </button>
            </div>
            ))
          );
        })()}
      </div>
    </div>
  );

  const QuizPlayer = () => {
    if (showResult) {
      const finalScore = selectedAnswer === selectedQuiz.questions[currentQuestion].correctAnswer ? score + 1 : score;
      const percentage = ((finalScore / selectedQuiz.questions.length) * 100).toFixed(0);
      
      return (
        <div className="max-w-3xl mx-auto px-6 py-8">
          <div className="bg-white rounded-2xl shadow-2xl p-12 text-center">
            <Award className={`h-32 w-32 mx-auto mb-6 ${percentage >= 70 ? 'text-green-500' : 'text-yellow-500'}`} />
            <h2 className="text-4xl font-bold text-gray-800 mb-6">Quiz Completed!</h2>
            <div className="text-8xl font-bold text-indigo-600 mb-4">
              {finalScore}/{selectedQuiz.questions.length}
            </div>
            <p className="text-3xl text-gray-600 mb-8">Score: {percentage}%</p>
            
            {percentage >= 90 && <p className="text-green-600 font-semibold text-2xl mb-6">Excellent! 🎉</p>}
            {percentage >= 70 && percentage < 90 && <p className="text-blue-600 font-semibold text-2xl mb-6">Good Job! 👍</p>}
            {percentage < 70 && <p className="text-yellow-600 font-semibold text-2xl mb-6">Keep Practicing! 💪</p>}

            <button
              onClick={() => {
                setQuizInProgress(false);
                setShowResult(false);
                setCurrentView('quizzes');
              }}
              className="bg-indigo-600 text-white px-8 py-4 rounded-lg hover:bg-indigo-700 transition font-medium text-lg"
            >
              Back to Quizzes
            </button>
          </div>
        </div>
      );
    }

    const question = selectedQuiz.questions[currentQuestion];

    return (
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800">{selectedQuiz.title}</h2>
            <span className="text-lg font-semibold text-indigo-600 bg-indigo-100 px-4 py-2 rounded-full">
              Question {currentQuestion + 1}/{selectedQuiz.questions.length}
            </span>
          </div>

          <div className="mb-8">
            <h3 className="text-2xl font-semibold text-gray-800 mb-8">{question.text}</h3>

            <div className="space-y-4">
              {question.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedAnswer(index)}
                  className={`w-full text-left px-6 py-5 rounded-xl border-2 transition transform hover:scale-102 ${
                    selectedAnswer === index
                      ? 'border-indigo-500 bg-indigo-50 shadow-lg'
                      : 'border-gray-200 hover:border-indigo-300 bg-white hover:shadow-md'
                  }`}
                >
                  <span className="font-bold text-lg text-indigo-600 mr-3">{String.fromCharCode(65 + index)}.</span>
                  <span className="text-lg">{option}</span>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleNextQuestion}
            disabled={selectedAnswer === null}
            className={`w-full py-5 rounded-xl font-medium text-lg transition ${
              selectedAnswer === null
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg'
            }`}
          >
            {currentQuestion + 1 === selectedQuiz.questions.length ? 'Finish Quiz' : 'Next Question →'}
          </button>
        </div>
      </div>
    );
  };

  const Progress = () => (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">My Progress</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-indigo-500">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Attempts</h3>
          <p className="text-5xl font-bold text-indigo-600">{studentResults.length}</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Average Score</h3>
          <p className="text-5xl font-bold text-green-600">
            {studentResults.length > 0 
              ? Math.round(studentResults.reduce((sum, result) => sum + result.percentage, 0) / studentResults.length)
              : 0}%
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Best Score</h3>
          <p className="text-5xl font-bold text-purple-600">
            {studentResults.length > 0 
              ? Math.max(...studentResults.map(result => result.percentage))
              : 0}%
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="px-6 py-4 bg-gradient-to-r from-indigo-500 to-purple-600">
          <h2 className="text-xl font-bold text-white">Quiz History</h2>
        </div>

        <div className="divide-y divide-gray-200">
          {studentResults.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <p className="text-gray-500 text-lg">No quiz attempts yet.</p>
              <p className="text-gray-400 text-sm mt-1">Complete some quizzes to see your progress here.</p>
            </div>
          ) : (
            studentResults.map((result, index) => (
              <div key={result._id} className="px-6 py-5 hover:bg-gray-50 transition">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-gray-800 text-lg">{result.quiz?.title || 'Unknown Quiz'}</h3>
                    <p className="text-sm text-gray-600 mt-1">{new Date(result.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-indigo-600">
                      {result.score}/{result.totalQuestions}
                    </div>
                    <div className={`text-sm font-semibold mt-1 ${
                      result.percentage >= 70 ? 'text-green-600' : 'text-yellow-600'
                    }`}>
                      {result.percentage}%
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {!quizInProgress && currentView === 'dashboard' && <Dashboard />}
      {!quizInProgress && currentView === 'quizzes' && <QuizzesList />}
      {quizInProgress && <QuizPlayer />}
      {currentView === 'progress' && <Progress />}
    </div>
  );
}