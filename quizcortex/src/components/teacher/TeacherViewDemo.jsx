import React, { useState, useEffect } from 'react';
import { Home, BookOpen, Users, LogOut, Plus, Edit, Trash2, Eye, X, Check, Search, UserPlus, Mail, ChevronDown } from 'lucide-react';
import { createQuiz, getTeacherQuizzes, getAllQuizzes, getStudentsCount, getAllStudents, getStudentAnalytics, getRecentActivities } from "../../api/quiz";

export default function TeacherViewDemo({ onLogout }) {
  const [currentView, setCurrentView] = useState('dashboard');
  const [showCreateQuiz, setShowCreateQuiz] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState(null);
  const [previewQuiz, setPreviewQuiz] = useState(null);
  const [quizSearchQuery, setQuizSearchQuery] = useState('');
  const [studentSearchQuery, setStudentSearchQuery] = useState('');

const storedUser = localStorage.getItem("user");
const user = storedUser ? JSON.parse(storedUser) : null;

const teacherInfo = {
  name: user?.name || "Teacher",
  email: user?.email || "teacher@mail.com",
  role: user?.role || "Teacher"
};
  
  const [quizzes, setQuizzes] = useState([]);
  const [studentsData, setStudentsData] = useState({ totalStudents: 0, activeStudents: 0 });
  const [analytics, setAnalytics] = useState({ mostActive: null, topPerformer: null, newThisWeek: 0 });
  const [recentActivities, setRecentActivities] = useState([]);

  const [students, setStudents] = useState([]);

  useEffect(() => {
    fetchTeacherData();
  }, []);

  const fetchTeacherData = async () => {
    try {
      console.log('Fetching teacher data...');
      const [quizzesData, studentsCountData, studentsListData, analyticsData, activitiesData] = await Promise.all([
        getAllQuizzes(),
        getStudentsCount(),
        getAllStudents(),
        getStudentAnalytics(),
        getRecentActivities()
      ]);
      console.log('Teacher quizzes received:', quizzesData);
      console.log('Students count:', studentsCountData);
      setQuizzes(quizzesData);
      setStudentsData(studentsCountData);
      setStudents(studentsListData.map(student => ({
        id: student._id,
        name: student.name,
        email: student.email,
        registered: new Date(student.createdAt).toISOString().split('T')[0]
      })));
      setAnalytics(analyticsData);
      setRecentActivities(activitiesData);
    } catch (error) {
      console.error('Failed to fetch teacher data:', error);
    }
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      alert('Logging out... (In a real app, this would redirect to login page)');
    }
  };

  const handleDeleteQuiz = (quizId) => {
    if (window.confirm('Are you sure you want to delete this quiz?')) {
      setQuizzes(prevQuizzes => prevQuizzes.filter(q => q.id !== quizId));
    }
  };

  const filteredStudents = students.filter(student => {
    if (!studentSearchQuery.trim()) return true;
    return student.name.toLowerCase().includes(studentSearchQuery.toLowerCase()) ||
           student.email.toLowerCase().includes(studentSearchQuery.toLowerCase());
  });

  const filteredQuizzes = quizzes.filter(quiz => {
    const matchesSearch = quiz.title.toLowerCase().includes(quizSearchQuery.toLowerCase()) ||
                         (quiz.category && quiz.category.toLowerCase().includes(quizSearchQuery.toLowerCase()));
    return matchesSearch;
  });

  const Navigation = () => (
    <nav className="bg-white shadow-md border-b-2 border-indigo-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex items-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-lg">
              <BookOpen className="h-6 w-6 mr-2" />
              <span className="text-xl font-bold">QuizCortex</span>
            </div>
            <span className="ml-4 px-3 py-1 bg-yellow-400 text-yellow-900 rounded-full text-xs font-bold uppercase tracking-wide">
              Teacher
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setCurrentView('dashboard')}
              className={`flex items-center px-4 py-2 rounded-lg transition ${
                currentView === 'dashboard' 
                  ? 'bg-indigo-50 text-indigo-700 font-semibold' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Home className="h-5 w-5 mr-2" />
              <span>Dashboard</span>
            </button>
            
            <button 
              onClick={() => setCurrentView('quizzes')}
              className={`flex items-center px-4 py-2 rounded-lg transition ${
                currentView === 'quizzes' 
                  ? 'bg-indigo-50 text-indigo-700 font-semibold' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <BookOpen className="h-5 w-5 mr-2" />
              <span>Quizzes</span>
            </button>
            
            <button 
              onClick={() => setCurrentView('students')}
              className={`flex items-center px-4 py-2 rounded-lg transition ${
                currentView === 'students' 
                  ? 'bg-indigo-50 text-indigo-700 font-semibold' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Users className="h-5 w-5 mr-2" />
              <span>Students</span>
            </button>

            <div className="relative ml-4">
              <button
                onClick={() => setShowProfile(!showProfile)}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition border border-gray-200"
              >
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">
                  {teacherInfo.name.charAt(0)}
                </div>
                <ChevronDown className="h-4 w-4 text-gray-600" />
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
                          {teacherInfo.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 text-lg">{teacherInfo.name}</p>
                          <p className="text-sm text-gray-500">{teacherInfo.role}</p>
                        </div>
                      </div>
                      <div className="flex items-center text-gray-700 bg-gray-50 px-3 py-2 rounded-lg">
                        <Mail className="h-4 w-4 mr-2 text-indigo-600" />
                        <span className="text-sm">{teacherInfo.email}</span>
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

  const Dashboard = () => (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome back, {teacherInfo.name}! 👋</h1>
        <p className="text-lg text-gray-600">Here's what's happening with your classes today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white rounded-2xl shadow-xl p-6 transform hover:scale-105 transition">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-indigo-100 text-sm font-medium uppercase tracking-wide">Total Quizzes</p>
              <p className="text-5xl font-bold mt-2">{quizzes.length}</p>
            </div>
            <div className="bg-gray-200 p-3 rounded-xl">
              <BookOpen className="h-8 w-8 text-indigo-600" />
            </div>
          </div>
          <p className="text-indigo-100 text-sm">Active assessments</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl shadow-xl p-6 transform hover:scale-105 transition">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-green-100 text-sm font-medium uppercase tracking-wide">Total Students</p>
              <p className="text-5xl font-bold mt-2">{studentsData.totalStudents}</p>
            </div>
            <div className="bg-gray-200 p-3 rounded-xl">
              <Users className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <p className="text-green-100 text-sm">Registered learners</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl shadow-xl p-6 transform hover:scale-105 transition">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-purple-100 text-sm font-medium uppercase tracking-wide">Active Users</p>
              <p className="text-5xl font-bold mt-2">{studentsData.activeStudents}</p>
            </div>
            <div className="bg-gray-200 p-3 rounded-xl">
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </div>
          <p className="text-purple-100 text-sm">This week</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <button
          onClick={() => {
            setShowCreateQuiz(true);
            setEditingQuiz(null);
          }}
          className="bg-white border-2 border-indigo-200 rounded-2xl shadow-lg p-8 hover:border-indigo-400 hover:shadow-xl transition group"
        >
          <div className="bg-indigo-100 group-hover:bg-indigo-200 transition w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Plus className="h-10 w-10 text-indigo-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Create New Quiz</h3>
          <p className="text-gray-600 text-base">Design engaging quizzes for your students</p>
        </button>

        <button
          onClick={() => setCurrentView('students')}
          className="bg-white border-2 border-green-200 rounded-2xl shadow-lg p-8 hover:border-green-400 hover:shadow-xl transition group"
        >
          <div className="bg-green-100 group-hover:bg-green-200 transition w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Users className="h-10 w-10 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Manage Students</h3>
          <p className="text-gray-600 text-base">View and manage student accounts</p>
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
          <h3 className="text-xl font-bold text-white flex items-center">
            <span className="text-2xl mr-2">📊</span>
            Recent Activity
          </h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {recentActivities.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No recent activities yet.</p>
                <p className="text-gray-400 text-sm mt-1">Activities will appear when students complete quizzes.</p>
              </div>
            ) : (
              recentActivities.map((activity, index) => {
                const colors = ['blue', 'green', 'purple', 'indigo', 'pink'];
                const color = colors[index % colors.length];
                const timeAgo = new Date(activity.createdAt).toLocaleString();
                
                return (
                  <div key={activity._id} className={`flex items-start space-x-4 p-4 bg-${color}-50 rounded-xl border border-${color}-100`}>
                    <div className={`bg-${color}-500 text-white rounded-full h-10 w-10 flex items-center justify-center font-bold flex-shrink-0`}>
                      {activity.studentName.charAt(0)}
                    </div>
                    <div className="flex-1">
                      {activity.type === 'quiz_completed' ? (
                        <>
                          <p className="font-semibold text-gray-800">{activity.studentName} completed "{activity.quizTitle}"</p>
                          <p className="text-sm text-gray-600 mt-1">Score: {activity.score}/{activity.totalQuestions} ({activity.percentage}%) • {timeAgo}</p>
                        </>
                      ) : (
                        <>
                          <p className="font-semibold text-gray-800">New student registered: {activity.studentName}</p>
                          <p className="text-sm text-gray-600 mt-1">{timeAgo}</p>
                        </>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const QuizzesManagement = () => (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Manage Quizzes</h1>
        <button
          onClick={() => {
            setShowCreateQuiz(true);
            setEditingQuiz(null);
          }}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition flex items-center shadow-lg font-semibold"
        >
          <Plus className="h-5 w-5 mr-2" />
          Create New Quiz
        </button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search quizzes by title or category..."
            value={quizSearchQuery}
            onChange={(e) => setQuizSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition text-base"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredQuizzes.map(quiz => (
          <div key={quiz._id} className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="text-xl font-bold text-gray-900">{quiz.title}</h3>
                  {quiz.category && (
                    <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-lg text-sm font-semibold">
                      {quiz.category}
                    </span>
                  )}
                  {quiz.allowedTo === 'selected' && (
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-lg text-sm font-semibold">
                      {quiz.selectedStudents?.length || 0} Selected
                    </span>
                  )}
                </div>
                <p className="text-gray-600 text-base">
                  {quiz.questions?.length || 0} questions • Created by {quiz.createdBy?.name || 'Unknown'}
                </p>
              </div>

              <div className="flex gap-2 ml-4">
                <button 
                  onClick={() => {
                    setPreviewQuiz(quiz);
                    setShowPreview(true);
                  }}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition flex items-center font-medium"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Preview
                </button>
                <button 
                  onClick={() => {
                    setEditingQuiz(quiz);
                    setShowCreateQuiz(true);
                  }}
                  className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition flex items-center font-medium"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </button>
                <button 
                  onClick={() => handleDeleteQuiz(quiz.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition flex items-center font-medium"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
        {filteredQuizzes.length === 0 && (
          <div className="text-center py-16 bg-white rounded-xl border-2 border-dashed border-gray-300">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No quizzes found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );

  const StudentsManagement = () => (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Student Management</h1>
        <button
          onClick={() => setShowAddStudent(true)}
          className="bg-gradient-to-r from-green-600 to-teal-600 text-white px-6 py-3 rounded-xl hover:from-green-700 hover:to-teal-700 transition flex items-center shadow-lg font-semibold"
        >
          <UserPlus className="h-5 w-5 mr-2" />
          Add New Student
        </button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search students by name or email..."
            value={studentSearchQuery}
            onChange={(e) => setStudentSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition text-base"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-green-600 to-teal-600 px-6 py-4">
          <h2 className="text-xl font-bold text-white">Registered Students ({filteredStudents.length})</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b-2 border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wide">Student</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wide">Email</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wide">Registration Date</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredStudents.map(student => (
                <tr key={student.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-11 w-11 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold mr-3 text-lg">
                        {student.name.charAt(0)}
                      </div>
                      <span className="font-semibold text-gray-900 text-base">{student.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-700 text-base">{student.email}</td>
                  <td className="px-6 py-4 text-gray-700 text-base">{student.registered}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => {
                        if (window.confirm(`Are you sure you want to remove ${student.name}?`)) {
                          setStudents(students.filter(s => s.id !== student.id));
                        }
                      }}
                      className="text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded-lg transition"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredStudents.length === 0 && (
          <div className="text-center py-16">
            <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No students found matching your search.</p>
          </div>
        )}
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border-2 border-blue-200 rounded-2xl shadow-md p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-bold text-gray-700 uppercase tracking-wide">Most Active</h3>
            <div className="bg-blue-100 p-2 rounded-lg">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {analytics.mostActive?.student?.[0]?.name || 'No Data'}
          </p>
          <p className="text-blue-600 text-sm mt-1 font-medium">
            {analytics.mostActive?.quizCount || 0} quizzes completed
          </p>
        </div>

        <div className="bg-white border-2 border-purple-200 rounded-2xl shadow-md p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-bold text-gray-700 uppercase tracking-wide">Top Performer</h3>
            <div className="bg-purple-100 p-2 rounded-lg">
              <Users className="h-5 w-5 text-purple-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {analytics.topPerformer?.student?.[0]?.name || 'No Data'}
          </p>
          <p className="text-purple-600 text-sm mt-1 font-medium">
            Average: {analytics.topPerformer?.avgScore ? Math.round(analytics.topPerformer.avgScore) : 0}%
          </p>
        </div>

        <div className="bg-white border-2 border-pink-200 rounded-2xl shadow-md p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-bold text-gray-700 uppercase tracking-wide">New This Week</h3>
            <div className="bg-pink-100 p-2 rounded-lg">
              <Users className="h-5 w-5 text-pink-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{analytics.newThisWeek} Students</p>
          <p className="text-pink-600 text-sm mt-1 font-medium">Active this week</p>
        </div>
      </div>
    </div>
  );

  const CreateQuizModal = () => {
    const [localQuizData, setLocalQuizData] = useState({
      title: editingQuiz ? editingQuiz.title : '',
      category: editingQuiz ? editingQuiz.category : '',
      allowedTo: editingQuiz ? editingQuiz.allowedTo : 'all',
      selectedStudents: editingQuiz ? editingQuiz.selectedStudents : []
    });

    const [questions, setQuestions] = useState(
      editingQuiz ? editingQuiz.questions : [
        { id: Date.now(), text: '', options: ['', '', '', ''], correctAnswer: 0 }
      ]
    );

    const updateQuestion = (index, field, value) => {
      const newQuestions = [...questions];
      newQuestions[index] = { ...newQuestions[index], [field]: value };
      setQuestions(newQuestions);
    };

    const updateOption = (qIndex, optIndex, value) => {
      const newQuestions = [...questions];
      const newOptions = [...newQuestions[qIndex].options];
      newOptions[optIndex] = value;
      newQuestions[qIndex] = { ...newQuestions[qIndex], options: newOptions };
      setQuestions(newQuestions);
    };

    const toggleStudentSelection = (studentId) => {
      const selected = localQuizData.selectedStudents.includes(studentId);
      if (selected) {
        setLocalQuizData({
          ...localQuizData,
          selectedStudents: localQuizData.selectedStudents.filter(id => id !== studentId)
        });
      } else {
        setLocalQuizData({
          ...localQuizData,
          selectedStudents: [...localQuizData.selectedStudents, studentId]
        });
      }
    };

    const toggleSelectAll = () => {
      if (localQuizData.selectedStudents.length === students.length) {
        setLocalQuizData({ ...localQuizData, selectedStudents: [] });
      } else {
        setLocalQuizData({ ...localQuizData, selectedStudents: students.map(s => s.id) });
      }
    };

    const handleSaveQuiz = async () => {
      if (!localQuizData.title.trim()) {
        alert('Please fill in quiz title');
        return;
      }
      if (questions.some(q => !q.text.trim() || q.options.some(opt => !opt.trim()))) {
        alert('Please complete all questions and options');
        return;
      }
      if (localQuizData.allowedTo === 'selected' && localQuizData.selectedStudents.length === 0) {
        alert('Please select at least one student');
        return;
      }

      const quizData = {
        ...localQuizData,
        questions
      };

      try {
        if (editingQuiz) {
          // Update existing quiz (you'll need to implement updateQuiz API)
          alert('Quiz update feature coming soon!');
        } else {
          await createQuiz(quizData);
          await fetchTeacherData(); // Refresh the quiz list
        }
        setShowCreateQuiz(false);
        setEditingQuiz(null);
      } catch (error) {
        console.error('Failed to save quiz:', error);
        alert('Failed to save quiz. Please try again.');
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
        <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full my-8">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-5 rounded-t-2xl flex justify-between items-center">
            <h2 className="text-2xl font-bold">
              {editingQuiz ? 'Edit Quiz' : 'Create New Quiz'}
            </h2>
            <button 
              onClick={() => {
                setShowCreateQuiz(false);
                setEditingQuiz(null);
              }}
              className="text-white hover:bg-white hover:bg-opacity-20 p-1 rounded-lg transition"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="p-6 max-h-[70vh] overflow-y-auto">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Quiz Title</label>
                <input
                  type="text"
                  value={localQuizData.title}
                  onChange={(e) => setLocalQuizData({ ...localQuizData, title: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition text-base"
                  placeholder="Enter quiz title"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Category</label>
                <input
                  type="text"
                  value={localQuizData.category}
                  onChange={(e) => setLocalQuizData({ ...localQuizData, category: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition text-base"
                  placeholder="e.g., Math, Science, History"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">Assign To</label>
                <div className="space-y-3">
                  <label className="flex items-center cursor-pointer p-3 border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition">
                    <input
                      type="radio"
                      checked={localQuizData.allowedTo === 'all'}
                      onChange={() => setLocalQuizData({ ...localQuizData, allowedTo: 'all', selectedStudents: [] })}
                      className="mr-3 h-4 w-4"
                    />
                    <span className="font-medium text-gray-800">All Students</span>
                  </label>
                  <label className="flex items-center cursor-pointer p-3 border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition">
                    <input
                      type="radio"
                      checked={localQuizData.allowedTo === 'selected'}
                      onChange={() => setLocalQuizData({ ...localQuizData, allowedTo: 'selected' })}
                      className="mr-3 h-4 w-4"
                    />
                    <span className="font-medium text-gray-800">Selected Students</span>
                  </label>
                </div>

                {localQuizData.allowedTo === 'selected' && (
                  <div className="mt-4 border-2 border-indigo-200 rounded-xl p-4 bg-indigo-50">
                    <div className="flex justify-between items-center mb-3">
                      <p className="text-sm font-bold text-gray-700 uppercase tracking-wide">
                        Select Students ({localQuizData.selectedStudents.length}/{students.length})
                      </p>
                      <button
                        onClick={toggleSelectAll}
                        className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 underline"
                      >
                        {localQuizData.selectedStudents.length === students.length ? 'Deselect All' : 'Select All'}
                      </button>
                    </div>
                    <div className="max-h-48 overflow-y-auto space-y-2 bg-white rounded-lg p-3 border border-gray-200">
                      {students.map(student => (
                        <label key={student.id} className="flex items-center cursor-pointer hover:bg-indigo-50 p-3 rounded-lg transition">
                          <input
                            type="checkbox"
                            checked={localQuizData.selectedStudents.includes(student.id)}
                            onChange={() => toggleStudentSelection(student.id)}
                            className="mr-3 h-4 w-4"
                          />
                          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold mr-3 flex-shrink-0">
                            {student.name.charAt(0)}
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-gray-800">{student.name}</p>
                            <p className="text-xs text-gray-500">{student.email}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="border-t-2 border-gray-200 pt-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-gray-800 uppercase tracking-wide">Questions</h3>
                  <button
                    onClick={() => setQuestions([...questions, { 
                      id: Date.now(), 
                      text: '', 
                      options: ['', '', '', ''], 
                      correctAnswer: 0 
                    }])}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700 transition flex items-center font-semibold"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Question
                  </button>
                </div>

                {questions.map((q, qIndex) => (
                  <div key={q.id} className="bg-gray-50 border-2 border-gray-200 rounded-xl p-5 mb-4">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="font-bold text-gray-800 text-base">Question {qIndex + 1}</h4>
                      {questions.length > 1 && (
                        <button
                          onClick={() => setQuestions(questions.filter((_, i) => i !== qIndex))}
                          className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                    <input
                      type="text"
                      value={q.text}
                      onChange={(e) => updateQuestion(qIndex, 'text', e.target.value)}
                      placeholder="Enter your question"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 mb-3 text-base"
                    />
                    <div className="space-y-3">
                      {[0, 1, 2, 3].map(optIndex => (
                        <div key={optIndex} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={q.options[optIndex]}
                            onChange={(e) => updateOption(qIndex, optIndex, e.target.value)}
                            placeholder={`Option ${optIndex + 1}`}
                            className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base"
                          />
                          <button
                            onClick={() => updateQuestion(qIndex, 'correctAnswer', optIndex)}
                            className={`px-4 py-3 rounded-xl transition flex items-center gap-2 font-semibold text-sm ${
                              q.correctAnswer === optIndex
                                ? 'bg-green-500 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                          >
                            {q.correctAnswer === optIndex ? <Check className="h-5 w-5" /> : null}
                            {q.correctAnswer === optIndex ? 'Correct' : 'Mark'}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="px-6 py-4 bg-gray-50 rounded-b-2xl flex gap-3 border-t-2 border-gray-200">
            <button
              onClick={handleSaveQuiz}
              className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition font-bold text-base"
            >
              {editingQuiz ? 'Save Changes' : 'Create Quiz'}
            </button>
            <button
              onClick={() => {
                setShowCreateQuiz(false);
                setEditingQuiz(null);
              }}
              className="px-8 bg-gray-300 text-gray-700 py-3 rounded-xl hover:bg-gray-400 transition font-bold text-base"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };

  const PreviewModal = () => {
    if (!previewQuiz) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
        <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full my-8">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-5 rounded-t-2xl flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">{previewQuiz.title}</h2>
              <p className="text-blue-100 text-sm mt-1">{previewQuiz.category} • {previewQuiz.questions.length} Questions</p>
            </div>
            <button 
              onClick={() => setShowPreview(false)}
              className="text-white hover:bg-white hover:bg-opacity-20 p-1 rounded-lg transition"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="p-6 max-h-[70vh] overflow-y-auto">
            <div className="space-y-6">
              {previewQuiz.questions.map((question, index) => (
                <div key={question.id} className="border-2 border-gray-200 rounded-xl p-5 bg-white">
                  <h3 className="font-bold text-gray-900 mb-4 text-base">
                    {index + 1}. {question.text}
                  </h3>
                  <div className="space-y-3">
                    {question.options.map((option, optIndex) => (
                      <div
                        key={optIndex}
                        className={`p-4 rounded-xl border-2 transition ${
                          optIndex === question.correctAnswer
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-200 bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-gray-800 font-medium">{option}</span>
                          {optIndex === question.correctAnswer && (
                            <span className="flex items-center text-green-600 font-bold text-sm">
                              <Check className="h-5 w-5 mr-1" />
                              Correct Answer
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {previewQuiz.allowedTo === 'selected' && (
              <div className="mt-6 border-t-2 border-gray-200 pt-6">
                <h3 className="font-bold text-gray-900 mb-3 uppercase tracking-wide text-sm">
                  Assigned Students ({previewQuiz.selectedStudents.length})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {previewQuiz.selectedStudents.map(studentId => {
                    const student = students.find(s => s.id === studentId);
                    return student ? (
                      <span key={studentId} className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg text-sm font-semibold">
                        {student.name}
                      </span>
                    ) : null;
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="px-6 py-4 bg-gray-50 rounded-b-2xl border-t-2 border-gray-200">
            <button
              onClick={() => setShowPreview(false)}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition font-bold"
            >
              Close Preview
            </button>
          </div>
        </div>
      </div>
    );
  };

  const AddStudentModal = () => {
    const [newStudentData, setNewStudentData] = useState({
      name: '',
      email: ''
    });

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
          <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white px-6 py-5 rounded-t-2xl flex justify-between items-center">
            <h2 className="text-2xl font-bold">Add New Student</h2>
            <button 
              onClick={() => {
                setShowAddStudent(false);
              }}
              className="text-white hover:bg-white hover:bg-opacity-20 p-1 rounded-lg transition"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="p-6">
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Student Name</label>
                <input
                  type="text"
                  value={newStudentData.name}
                  onChange={(e) => setNewStudentData({ ...newStudentData, name: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition text-base"
                  placeholder="Enter student name"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Email Address</label>
                <input
                  type="email"
                  value={newStudentData.email}
                  onChange={(e) => setNewStudentData({ ...newStudentData, email: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition text-base"
                  placeholder="student@school.com"
                />
              </div>
            </div>
          </div>

          <div className="px-6 py-4 bg-gray-50 rounded-b-2xl flex gap-3 border-t-2 border-gray-200">
            <button
              onClick={() => {
                if (!newStudentData.name.trim() || !newStudentData.email.trim()) {
                  alert('Please fill in all fields');
                  return;
                }
                if (!newStudentData.email.includes('@')) {
                  alert('Please enter a valid email address');
                  return;
                }

                const today = new Date().toISOString().split('T')[0];
                setStudents([...students, {
                  id: Date.now(),
                  name: newStudentData.name,
                  email: newStudentData.email,
                  registered: today
                }]);
                setShowAddStudent(false);
              }}
              className="flex-1 bg-gradient-to-r from-green-600 to-teal-600 text-white py-3 rounded-xl hover:from-green-700 hover:to-teal-700 transition font-bold"
            >
              Add Student
            </button>
            <button
              onClick={() => setShowAddStudent(false)}
              className="px-8 bg-gray-300 text-gray-700 py-3 rounded-xl hover:bg-gray-400 transition font-bold"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navigation />
      
      {currentView === 'dashboard' && <Dashboard />}
      {currentView === 'quizzes' && <QuizzesManagement />}
      {currentView === 'students' && <StudentsManagement />}
      
      {showCreateQuiz && <CreateQuizModal />}
      {showPreview && <PreviewModal />}
      {showAddStudent && <AddStudentModal />}
    </div>
  );
}