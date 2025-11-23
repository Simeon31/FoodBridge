import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AppLayout from './layout/AppLayout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import './App.css';


function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
     {/* Public Routes */}
    <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
    {/* Protected Routes with Layout */}
   <Route 
     element={
     <ProtectedRoute>
          <AppLayout />
       </ProtectedRoute>
      }
       >
    <Route path="/dashboard" element={<Dashboard />} />
         <Route path="/donations" element={<div className="text-xl font-semibold text-black dark:text-white">Donations Page - Coming Soon</div>} />
    <Route path="/requests" element={<div className="text-xl font-semibold text-black dark:text-white">Requests Page - Coming Soon</div>} />
   <Route path="/organizations" element={<div className="text-xl font-semibold text-black dark:text-white">Organizations Page - Coming Soon</div>} />
 <Route path="/profile" element={<div className="text-xl font-semibold text-black dark:text-white">Profile Page - Coming Soon</div>} />
 </Route>

      {/* Default Routes */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
  </Routes>
   </AuthProvider>
    </Router>
  );
}

export default App;
