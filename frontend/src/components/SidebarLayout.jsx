import { useEffect, useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'

function SidebarLayout({ children }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [latestResumeId, setLatestResumeId] = useState(null)
  const [userName, setUserName] = useState('User')

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) return

    // Fetch user profile info
    const fetchProfile = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/users/me', {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (response.ok) {
          const data = await response.json()
          if (data.name) {
            setUserName(data.name)
          }
        }
      } catch (err) {
        console.error('Error fetching user profile for sidebar:', err)
      }
    }

    // Fetch latest resume summary to link roadmap
    const fetchLatestResume = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/resumes/latest/summary', {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (response.ok) {
          const data = await response.json()
          if (data.has_resume) {
            setLatestResumeId(data.resume_id)
          }
        }
      } catch (err) {
        console.error('Error fetching resume summary for sidebar:', err)
      }
    }

    fetchProfile()
    fetchLatestResume()
  }, [location.pathname]) // Re-fetch on path changes to refresh latest resume status

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: '📊' },
    { name: 'My Resumes', path: '/resumes', icon: '📄' },
    {
      name: 'Learning Roadmap',
      path: latestResumeId ? `/roadmap/${latestResumeId}` : '/dashboard',
      icon: '📅',
      disabled: !latestResumeId
    },
    { name: 'Mock Interview', path: '/mock-interview', icon: '🎙️' },
    { name: 'Progress', path: '/dashboard?view=progress', icon: '📈' },
    { name: 'Profile', path: '/profile', icon: '👤' }
  ]

  const handleRoadmapClick = (e, disabled) => {
    if (disabled) {
      e.preventDefault()
      alert('Please upload a resume on the Dashboard first to generate your Learning Roadmap.')
    }
  }

  return (
    <div className="flex h-screen w-full bg-slate-50 font-sans overflow-hidden">
      {/* Fixed Left Sidebar */}
      <aside className="w-[260px] h-full bg-white border-r border-slate-200 flex flex-col justify-between shrink-0">
        <div className="flex flex-col pt-6 overflow-y-auto">
          {/* Logo Brand section */}
          <div className="px-6 mb-6">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🧠</span>
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
                RoleReady AI
              </span>
            </div>
            <span className="text-xs font-semibold text-slate-400 mt-1 block">
              AI Career Placement Coach
            </span>
          </div>

          {/* User profile section */}
          <div className="px-4 mb-6">
            <div className="flex items-center gap-3 p-2 bg-slate-50 border border-slate-100 rounded-xl">
              <div className="w-10 h-10 rounded-lg bg-indigo-600 text-white font-bold flex items-center justify-center shadow-sm">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-semibold text-slate-800 truncate">{userName}</p>
                <p className="text-xs text-slate-400 font-medium truncate">Candidate Account</p>
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="px-3 space-y-1">
             {navItems.map((item) => {
              const isActive = item.name === 'Progress'
                ? location.pathname === '/dashboard' && location.search.includes('view=progress')
                : item.name === 'Dashboard'
                  ? location.pathname === '/dashboard' && !location.search.includes('view=progress')
                  : location.pathname === item.path || (item.name === 'Learning Roadmap' && location.pathname.startsWith('/roadmap/'))
              
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={(e) => item.name === 'Learning Roadmap' && handleRoadmapClick(e, item.disabled)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-600 shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <span className="text-base">{item.icon}</span>
                  <span className="flex-1">{item.name}</span>
                  {item.name === 'Learning Roadmap' && item.disabled && (
                    <span className="text-[10px] bg-slate-100 text-slate-400 px-1.5 py-0.5 rounded font-bold uppercase">
                      Lock
                    </span>
                  )}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Sidebar Footer / Logout */}
        <div className="p-4 border-t border-slate-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 hover:text-rose-700 font-semibold rounded-xl text-sm border border-rose-100/50 transition-all duration-200 cursor-pointer"
          >
            <span>🚪</span>
            <span>Logout Account</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 h-full overflow-y-auto bg-slate-50 relative">
        {children}
      </main>
    </div>
  )
}

export default SidebarLayout
