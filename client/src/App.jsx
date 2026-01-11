import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import UserChat from './components/UserChat';
import SupportDashboard from './components/SupportDashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/chat" />} />
        <Route path="/chat" element={<UserChat />} />
        <Route path="/support" element={<SupportDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
