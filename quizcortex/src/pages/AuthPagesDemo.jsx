import React, { useState, useEffect } from "react";
import { BookOpen, Mail, Lock, User, ArrowRight, CheckCircle, AlertCircle, Home, BarChart3, LogOut, Play, Award, Search } from 'lucide-react';
import StudentDashboard from '../components/student/StudentDashboard';
import TeacherViewDemo from "../components/teacher/TeacherViewDemo";
import { registerUser } from "../api/auth";
import { loginUser } from "../api/auth";



export default function QuizWizzerApp() {
  const [currentPage, setCurrentPage] = useState("register");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loggedInUser, setLoggedInUser] = useState(null);
  useEffect(() => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  if (token && user) {
    setLoggedInUser(user);

    if (user.role?.toLowerCase() === "student") {
     setCurrentPage("dashboard");
    } else if (user.role?.toLowerCase() === "teacher") {
      setCurrentPage("teacher");
    }
  } 
}, []);


  
 
  const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  setLoggedInUser(null);
  setCurrentPage("login");
};


 if (currentPage === "dashboard" &&loggedInUser?.role?.toLowerCase() === "student") {
  return (
    <StudentDashboard
      studentName={loggedInUser.name}
      onLogout={handleLogout}
    />
  );
}

if (currentPage === "teacher" &&loggedInUser?.role?.toLowerCase() === "teacher") {
  return <TeacherViewDemo onLogout={handleLogout} />;
}


  return (
    <div>
      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>
      
      {currentPage === 'register' && (
       <RegisterPage 
        onSwitchPage={setCurrentPage}
        setError={setError}
        setSuccess={setSuccess}
        />
    )}

     {currentPage === 'login' && (
    <LoginPage 
    onSwitchPage={setCurrentPage}
     error={error}
     success={success}
    setError={setError}
    setSuccess={setSuccess}
    setLoggedInUser={setLoggedInUser}
    />
   )}

    </div>
  );
}

const RegisterPage = ({ onSwitchPage, error, success, setError, setSuccess}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [agreeTerms, setAgreeTerms] = useState(false);

  const handleRegister = async () => {
  setError("");
  setSuccess("");

  if (!name || !email || !password) {
    setError("Please fill in all fields");
    return;
  }

  try {
    console.log("REGISTER DATA", { name, email, password, role });

    await registerUser({ name, email, password, role });

    setSuccess("Account created successfully!");
    setTimeout(() => {
      onSwitchPage("login");
    }, 1500);
    } catch (err) {
    console.error("REGISTER ERROR", err);
    setError(err.response?.data?.message || "Registration failed");
   }
   };


  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full mb-4 shadow-lg">
            <BookOpen className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Create Account</h1>
          <p className="text-gray-600">Join QuizCortex today</p>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded flex items-start">
            <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-4 bg-green-50 border-l-4 border-green-500 text-green-700 px-4 py-3 rounded flex items-start">
            <CheckCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
            <span>{success}</span>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 pointer-events-none" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition outline-none"
                placeholder="Enter your full name"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 pointer-events-none" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition outline-none"
                placeholder="Enter your email"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 pointer-events-none" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition outline-none"
                placeholder="Create a password"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Must be at least 6 characters</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">I am a</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setRole('student')}
                className={`p-4 rounded-lg border-2 transition cursor-pointer ${
                  role === 'student'
                    ? 'border-purple-500 bg-purple-50 text-purple-700'
                    : 'border-gray-300 hover:border-purple-300'
                }`}
              >
                <div className="text-center">
                  <BookOpen className="h-8 w-8 mx-auto mb-2" />
                  <span className="font-semibold">Student</span>
                </div>
              </button>
              
              <button
                onClick={() => setRole('teacher')}
                className={`p-4 rounded-lg border-2 transition cursor-pointer ${
                  role === 'teacher'
                    ? 'border-purple-500 bg-purple-50 text-purple-700'
                    : 'border-gray-300 hover:border-purple-300'
                }`}
              >
                <div className="text-center">
                  <User className="h-8 w-8 mx-auto mb-2" />
                  <span className="font-semibold">Teacher</span>
                </div>
              </button>
            </div>
          </div>

          <div className="flex items-start">
            <input 
              type="checkbox" 
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="mr-2 mt-1 cursor-pointer" 
            />
            <label className="text-sm text-gray-600">
              I agree to the{' '}
              <span className="text-purple-600 font-semibold">Terms of Service</span>
              {' '}and{' '}
              <span className="text-purple-600 font-semibold">Privacy Policy</span>
            </label>
          </div>

          <button
            onClick={handleRegister}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 transition font-semibold text-lg shadow-lg flex items-center justify-center cursor-pointer"
          >
            Create Account
            <ArrowRight className="ml-2 h-5 w-5" />
          </button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <button
              onClick={() => {
                onSwitchPage('login');
                setError('');
                setSuccess('');
              }}
              className="text-purple-600 hover:text-purple-700 font-bold hover:underline cursor-pointer"
            >
              Sign in here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

const LoginPage = ({ onSwitchPage,error,success,setError,setSuccess,setLoggedInUser}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    setError("");
    setSuccess("");

    try {
      const res = await loginUser({ email, password });

      const { token, user } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      setSuccess("Login successful!");

      setTimeout(() => {
        setLoggedInUser(user);

         if (user.role?.toLowerCase() === "student") {
               onSwitchPage("dashboard");
         } else if (user.role?.toLowerCase() === "teacher") {
               onSwitchPage("teacher");
         }
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full mb-4 shadow-lg">
            <BookOpen className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to continue to QuizCortex</p>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded flex items-start">
            <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-4 bg-green-50 border-l-4 border-green-500 text-green-700 px-4 py-3 rounded flex items-start">
            <CheckCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
            <span>{success}</span>
          </div>
        )}

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 pointer-events-none" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition outline-none"
                placeholder="Enter your email"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 pointer-events-none" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition outline-none"
                placeholder="Enter your password"
              />
            </div>
          </div>

          <button
            onClick={handleLogin}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition font-semibold text-lg shadow-lg flex items-center justify-center cursor-pointer mt-6"
          >
            Sign In
            <ArrowRight className="ml-2 h-5 w-5" />
          </button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <button
              onClick={() => {
                onSwitchPage('register');
                setError('');
                setSuccess('');
              }}
              className="text-indigo-600 hover:text-indigo-700 font-bold hover:underline cursor-pointer"
            >
              Register here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

