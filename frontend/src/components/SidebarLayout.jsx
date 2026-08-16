import { useEffect, useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import {
  FileText,
  Map,
  Mic,
  Clock,
  LogOut,
  Sparkles,
  User
} from 'lucide-react'
import './SidebarLayout.css'

const ICON_MAP = {
  'Resume Analyzer': FileText,
  'Learning Roadmap': Map,
  'Mock Interview': Mic,
  'Past Records': Clock
}

function SidebarLayout({ children }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [userInfo, setUserInfo] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) return

    fetch('http://127.0.0.1:8000/users/me', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data) setUserInfo(data)
      })
      .catch(() => {})
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  const navItems = [
    { name: 'Resume Analyzer', path: '/resume-analyzer' },
    { name: 'Learning Roadmap', path: '/roadmap' },
    { name: 'Mock Interview', path: '/mock-interview' },
    { name: 'Past Records', path: '/past-records' }
  ]

  const renderNavLink = (item) => {
    const Icon = ICON_MAP[item.name]
    const isActive =
      item.name === 'Learning Roadmap'
        ? location.pathname === '/roadmap' || location.pathname.startsWith('/roadmap/')
        : location.pathname === item.path

    return (
      <Link
        key={item.name}
        to={item.path}
        className={`nav-link ${isActive ? 'active' : ''}`}
      >
        <span className="nav-icon-wrapper">
          {Icon && <Icon size={18} strokeWidth={isActive ? 2.2 : 1.8} />}
        </span>
        <span className="nav-text">{item.name}</span>
      </Link>
    )
  }

  return (
    <div className="app-container">
      {/* Dark Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="brand-group">
            <div className="brand-icon">
              <Sparkles size={16} color="#fff" />
            </div>
            <h1 className="brand-title">Role Ready AI</h1>
          </div>
          {userInfo && (
            <div className="user-info">
              <div className="user-avatar">
                <User size={14} />
              </div>
              <div className="user-details">
                <span className="user-name">{userInfo.name}</span>
                <span className="user-email">{userInfo.email}</span>
              </div>
            </div>
          )}
        </div>

        <nav className="nav-menu">
          {navItems.map(renderNavLink)}
        </nav>

        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-btn">
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Pane */}
      <div className="main-content-pane">
        <main className="page-content">
          {children}
        </main>
      </div>
    </div>
  )
}

export default SidebarLayout