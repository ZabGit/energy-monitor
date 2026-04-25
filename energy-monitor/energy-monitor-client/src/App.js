import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import RoomPage from './components/RoomPage';
import ReportPage from './components/ReportPage';

// Проверка авторизации
const isAuthenticated = () => {
  return localStorage.getItem('token') !== null;
};

// Защищённый маршрут (требует авторизации)
const PrivateRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } />
        <Route path="/profile" element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        } />
        <Route path="/rooms/:id" element={
          <PrivateRoute>
            <RoomPage />
          </PrivateRoute>
        } />
        <Route path="/report" element={
          <PrivateRoute>
            <ReportPage />
          </PrivateRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;