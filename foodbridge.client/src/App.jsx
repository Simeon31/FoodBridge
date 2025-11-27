import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AppLayout from './layout/AppLayout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import ProductsPage from './pages/Products';
import Inventory from './pages/Inventory';
import Donors from './pages/Donors';
import Waste from './pages/Waste';
import Donations from './pages/Donations';
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
 <Route path="/donations" element={<Donations />} />
 <Route path="/products" element={<ProductsPage />} />
 <Route path="/inventory" element={<Inventory />} />
 <Route path="/donors" element={<Donors />} />
 <Route path="/waste" element={<Waste />} />
 <Route path="/requests" element={<div className="text-xl font-semibold text-black dark:text-white">Requests Page - Coming Soon</div>} />
 <Route path="/organizations" element={<div className="text-xl font-semibold text-black dark:text-white">Organizations Page - Coming Soon</div>} />
 <Route path="/profile" element={<Profile />} />
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
