import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import UserFlow from './UserFlow';
import AdminLayout from './layouts/AdminLayout';
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import Colleges from './pages/admin/Colleges';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="login" element={<Login />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="colleges" element={<Colleges />} />
        </Route>

        {/* Maintain existing Main App flow for root and other paths */}
        <Route path="/*" element={<UserFlow />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
