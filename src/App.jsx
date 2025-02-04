import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import NotesPage from "./pages/NotesPage.jsx"
import NoteProvider from "./context/NoteContext.jsx"
import Login from './pages/Login';
import Signup from './pages/Signup';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div></div>;
  }

  return user ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <NoteProvider><NotesPage /></NoteProvider>
              </ProtectedRoute>
            } 
          />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
