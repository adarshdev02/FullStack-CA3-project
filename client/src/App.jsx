import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import AuthPage from './pages/AuthPage';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Donations from './pages/Donations';
import Requests from './pages/Requests';
import ProfileSettings from './pages/ProfileSettings';

export default function App() {
  return <AuthProvider><BrowserRouter><Routes>
    <Route path="/" element={<Home />} />
    <Route path="/login" element={<AuthPage />} />
    <Route path="/register" element={<AuthPage register />} />
    <Route element={<ProtectedRoute />}><Route path="/dashboard" element={<Dashboard />} /><Route path="/donations" element={<Donations />} /><Route path="/requests" element={<Requests />} /><Route path="/profile" element={<ProfileSettings />} /></Route>
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes></BrowserRouter></AuthProvider>;
}
