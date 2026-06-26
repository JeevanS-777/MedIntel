import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home'; // <-- Add this new import block
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ChatSession from './pages/ChatSession';
import ReportAnalysis from './pages/ReportAnalysis';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        {/* NEW ATTRACTIVE WELCOME ENTRYWAY */}
        <Route path="/" element={<Home />} />

        {/* YOUR UNTOUCHED WORKING AUTHENTICATION LOGIC TRACK */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* KEEP YOUR EXISTING PROTECTED ROUTES COMPLETELY UNTOUCHED */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/chat/:chatId" 
          element={
            <ProtectedRoute>
              <ChatSession />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/analysis" 
          element={
            <ProtectedRoute>
              <ReportAnalysis />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;