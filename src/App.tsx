import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import './index.css';

// Lazy load pages later for better performance
// For now, let's just create some placeholder components or actual pages
const Login = () => <div className="p-10">Login Page</div>;
const Register = () => <div className="p-10">Register Page</div>;
const Dashboard = () => <div className="p-10">Dashboard Page</div>;
const Transactions = () => <div className="p-10">Transactions Page</div>;

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token, isLoading } = useAuth();

  if (isLoading) return <div>Loading...</div>;
  if (!token) return <Navigate to="/login" replace />;

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/transactions" element={
            <ProtectedRoute>
              <Transactions />
            </ProtectedRoute>
          } />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
