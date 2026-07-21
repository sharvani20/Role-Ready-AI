import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Analysis from './pages/Analysis'
import ResumeHistory from './pages/ResumeHistory'
import Profile from './pages/Profile'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/analysis/:id"
        element={
          <ProtectedRoute>
            <Analysis />
          </ProtectedRoute>
        }
      />

      <Route
        path="/resumes"
        element={
          <ProtectedRoute>
            <ResumeHistory />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

export default App