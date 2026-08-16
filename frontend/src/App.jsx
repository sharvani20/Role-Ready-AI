import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import ResumeAnalyzer from './pages/ResumeAnalyzer'
import Analysis from './pages/Analysis'
import PastRecords from './pages/PastRecords'
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
        path="/resume-analyzer"
        element={
          <ProtectedRoute>
            <SidebarLayout>
              <ResumeAnalyzer />
            </SidebarLayout>
          </ProtectedRoute>
        }
      />

      {/* Keep /dashboard redirecting to resume-analyzer for backwards compat */}
      <Route
        path="/dashboard"
        element={<Navigate to="/resume-analyzer" replace />}
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
        path="/past-records"
        element={
          <ProtectedRoute>
            <SidebarLayout>
              <PastRecords />
            </SidebarLayout>
          </ProtectedRoute>
        }
      />

      {/* Keep old /resumes route redirecting */}
      <Route
        path="/resumes"
        element={<Navigate to="/past-records" replace />}
      />

      <Route
        path="/roadmap"
        element={
          <ProtectedRoute>
            <SidebarLayout>
              <Roadmap />
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