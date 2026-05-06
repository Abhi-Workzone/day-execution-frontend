import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Execution from './pages/Execution';
import PlanDay from './pages/PlanDay';
import TodoPool from './pages/TodoPool';
import Routines from './pages/Routines';
import Analytics from './pages/Analytics';
import Login from './pages/Login';
import Register from './pages/Register';
import SplashScreen from './components/SplashScreen';
import { AuthProvider, useAuth } from './context/AuthContext';

import { Loader2 } from 'lucide-react';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center space-y-4">
      <Loader2 className="w-10 h-10 animate-spin text-primary-500" />
      <p className="text-slate-400 font-medium text-sm animate-pulse">Loading workspace...</p>
    </div>
  );
  if (!user) return <Navigate to="/login" />;
  
  return children;
};

function AppContent() {
  const [showSplash, setShowSplash] = useState(() => {
    const lastSplashTime = localStorage.getItem('lastSplashTime');
    const now = new Date().getTime();
    // Show splash if no previous time, or if 30 minutes (1800000ms) have passed
    if (!lastSplashTime || (now - parseInt(lastSplashTime) > 30 * 60 * 1000)) {
      return true;
    }
    return false;
  });
  const { user } = useAuth();

  const handleSplashComplete = () => {
    localStorage.setItem('lastSplashTime', new Date().getTime().toString());
    setShowSplash(false);
  };

  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  return (
    <Routes>
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
      <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
      
      <Route path="/*" element={
        <ProtectedRoute>
          <Layout>
            <Routes>
              <Route path="/" element={<Execution />} />
              <Route path="/plan" element={<PlanDay />} />
              <Route path="/tasks" element={<TodoPool />} />
              <Route path="/routines" element={<Routines />} />
              <Route path="/analytics" element={<Analytics />} />
            </Routes>
          </Layout>
        </ProtectedRoute>
      } />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
