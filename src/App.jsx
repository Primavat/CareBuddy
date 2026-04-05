import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeProvider';
import Showcase from './pages/Showcase';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <ThemeProvider>
    <BrowserRouter>
      <Routes>
        {/* The Landing Experience */}
        <Route path="/" element={<Showcase />} />
        
        {/* The Login Page */}
        <Route path="/login" element={<Login />} />
        
        {/* The Main Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* Redirect unknown routes to Showcase */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
