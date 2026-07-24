import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Analysis from './pages/Analysis'
import ResumeHistory from './pages/ResumeHistory'
import Profile from './pages/Profile'
import ProtectedRoute from './components/ProtectedRoute'
import SidebarLayout from './components/SidebarLayout'
import Roadmap from './pages/roadmap'
import MockInterview from './pages/MockInterview'

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
            <SidebarLayout>
              <Dashboard />
            </SidebarLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/analysis/:id"
        element={
          <ProtectedRoute>
            <SidebarLayout>
              <Analysis />
            </SidebarLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/resumes"
        element={
          <ProtectedRoute>
            <SidebarLayout>
              <ResumeHistory />
            </SidebarLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <SidebarLayout>
              <Profile />
            </SidebarLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/roadmap/:id"
        element={
          <ProtectedRoute>
            <SidebarLayout>
              <Roadmap />
            </SidebarLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/mock-interview"
        element={
          <ProtectedRoute>
            <SidebarLayout>
              <MockInterview />
            </SidebarLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

export default App