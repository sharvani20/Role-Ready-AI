import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

function Roadmap() {
  const { id } = useParams()
  const navigate = useNavigate()
  
  const [roadmap, setRoadmap] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('timeline')
  const [completedWeeks, setCompletedWeeks] = useState([])

  const loadRoadmap = async () => {
    setLoading(true)
    setError(null)
    const token = localStorage.getItem('token')

    try {
      const response = await fetch(`http://127.0.0.1:8000/roadmap/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Roadmap not found. Please ensure analysis is complete.')
        }
        throw new Error('Failed to load roadmap. Please try again later.')
      }

      const data = await response.json()
      setRoadmap(data)

      // Initialize completed weeks from localStorage
      const storedCompleted = localStorage.getItem(`role_ready_roadmap_${id}_completed`)
      if (storedCompleted) {
        setCompletedWeeks(JSON.parse(storedCompleted))
      } else {
        setCompletedWeeks([])
      }
    } catch (err) {
      console.error(err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadRoadmap()
  }, [id])

  const handleToggleWeek = (weekNum) => {
    let updated
    if (completedWeeks.includes(weekNum)) {
      updated = completedWeeks.filter((w) => w !== weekNum)
    } else {
      updated = [...completedWeeks, weekNum]
    }
    setCompletedWeeks(updated)
    localStorage.setItem(`role_ready_roadmap_${id}_completed`, JSON.stringify(updated))
  }

  // Get resource type icon
  const getResourceIcon = (iconType) => {
    switch (iconType?.toLowerCase()) {
      case 'video':
        return '🎥'
      case 'code':
        return '💻'
      case 'book':
        return '📘'
      case 'article':
        return '📄'
      default:
        return '🔗'
    }
  }

  // Get career level badge
  const renderCareerBadge = (level) => {
    const cleanLevel = level || 'Intermediate'
    switch (cleanLevel.toLowerCase()) {
      case 'beginner':
        return (
          <span className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider inline-flex items-center gap-1 shadow-sm">
            🌱 Beginner
          </span>
        )
      case 'advanced':
        return (
          <span className="bg-purple-50 border border-purple-200 text-purple-700 text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider inline-flex items-center gap-1 shadow-sm">
            🔥 Advanced
          </span>
        )
      case 'intermediate':
      default:
        return (
          <span className="bg-amber-50 border border-amber-200 text-amber-700 text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider inline-flex items-center gap-1 shadow-sm">
            ⚡ Intermediate
          </span>
        )
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 max-w-md mx-auto">
        <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
        <h2 className="text-lg font-bold text-slate-800">Assessing placement timeline...</h2>
        <p className="text-xs text-slate-500">Compiling customizable roadmap recommendations.</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-8 max-w-md mx-auto text-center space-y-6 shadow-sm my-10">
        <span className="text-4xl">⚠️</span>
        <div className="space-y-2">
          <h2 className="text-xl font-extrabold text-red-600">Something went wrong</h2>
          <p className="text-sm text-slate-500">{error}</p>
        </div>
        <button 
          onClick={loadRoadmap}
          className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm transition-all shadow-sm cursor-pointer"
        >
          Try Again
        </button>
      </div>
    )
  }

  if (!roadmap || !roadmap.learning_roadmap || roadmap.learning_roadmap.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-8 max-w-md mx-auto text-center space-y-6 shadow-sm my-10">
        <span className="text-4xl">📭</span>
        <div className="space-y-2">
          <h2 className="text-xl font-extrabold text-slate-800">No roadmap found</h2>
          <p className="text-sm text-slate-500">We couldn't find any weekly learning items for this profile.</p>
        </div>
        <button 
          onClick={() => navigate('/dashboard')}
          className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm transition-all shadow-sm cursor-pointer"
        >
          Go back to Dashboard
        </button>
      </div>
    )
  }

  // Progress metrics
  const totalWeeks = roadmap.learning_roadmap.length
  const completedCount = completedWeeks.filter(w => 
    roadmap.learning_roadmap.some(item => item.week === w)
  ).length
  const progressPercent = Math.round((completedCount / totalWeeks) * 100) || 0

  return (
    <div className="p-6 md:p-10 max-w-[1400px] mx-auto space-y-8 text-left animate-fade-in">
      
      {/* Back Button */}
      <button 
        onClick={() => navigate('/dashboard')}
        className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200 rounded-xl font-bold text-xs shadow-sm transition-all duration-200 hover:-translate-x-1 cursor-pointer"
      >
        ← Back to Dashboard
      </button>

      {/* Header card Section */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 md:p-8 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2 text-left">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight">
              Learning Roadmap
            </h1>
            {renderCareerBadge(roadmap.career_level)}
          </div>
          <p className="text-xs text-slate-400 font-medium leading-relaxed">
            Personalized weekly milestones addressing resume match alignment gaps.
          </p>
        </div>

        {/* Progress Tracker widget */}
        <div className="w-full md:w-80 space-y-2">
          <div className="flex justify-between items-center text-xs font-bold text-slate-700">
            <span>Roadmap Completion</span>
            <span className="text-indigo-600">{progressPercent}% ({completedCount}/{totalWeeks} Weeks)</span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-indigo-600 rounded-full transition-all duration-500" 
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 p-1 bg-slate-100 border border-slate-200/50 rounded-2xl overflow-x-auto w-full md:w-max">
        {[
          { id: 'timeline', label: '📅 Timeline' },
          { id: 'projects', label: '🛠️ Projects' },
          { id: 'interview', label: '💬 Interview Prep' },
          { id: 'advice', label: '🏆 Career & Certs' }
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 md:flex-initial px-5 py-2.5 font-bold text-xs rounded-xl transition-all duration-200 whitespace-nowrap cursor-pointer ${
              activeTab === tab.id 
                ? 'bg-white text-indigo-600 shadow-sm' 
                : 'text-slate-500 hover:bg-slate-200/50 hover:text-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'timeline' && (
        <div className="space-y-0">
          {roadmap.learning_roadmap.map((week, idx) => {
            const isCompleted = completedWeeks.includes(week.week)
            return (
              <div 
                key={week.week} 
                className="flex gap-4 md:gap-6 items-stretch"
              >
                {/* Timeline node and vertical line column */}
                <div className="flex flex-col items-center shrink-0 w-8 md:w-10">
                  <div className={`w-8 h-8 rounded-full border-2 bg-white flex items-center justify-center font-extrabold text-xs shadow-sm transition-all duration-300 shrink-0 ${
                    isCompleted 
                      ? 'bg-indigo-600 border-indigo-600 text-white shadow-indigo-100 scale-105' 
                      : 'border-slate-300 text-slate-400'
                  }`}>
                    {isCompleted ? '✓' : week.week}
                  </div>
                  {/* Vertical connector line */}
                  {idx < roadmap.learning_roadmap.length - 1 ? (
                    <div className="w-[2px] flex-1 bg-slate-200/80 my-2"></div>
                  ) : (
                    <div className="w-[2px] flex-1 bg-transparent my-2"></div>
                  )}
                </div>

                {/* Week Card */}
                <div className={`flex-1 bg-white border border-slate-200/80 rounded-2xl p-6 md:p-8 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 mb-8 ${
                  isCompleted ? 'border-indigo-100 bg-indigo-50/10' : ''
                }`}>
                  {/* Card Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-6 text-left">
                    <div className="space-y-1.5">
                      <h2 className="text-lg md:text-xl font-extrabold text-slate-800 group-hover:text-indigo-600 transition-colors">
                        {week.title}
                      </h2>
                      <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg text-xs font-bold shadow-sm">
                        ⏱️ {week.study_hours || 8} hrs/week
                      </span>
                    </div>

                    {/* Completion checkbox action */}
                    <div className="flex-shrink-0">
                      <label className={`inline-flex items-center gap-2 px-3 py-1.5 border rounded-xl text-xs font-bold cursor-pointer transition-all duration-200 select-none ${
                        isCompleted 
                          ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm' 
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}>
                        <input
                          type="checkbox"
                          checked={isCompleted}
                          onChange={() => handleToggleWeek(week.week)}
                          className="absolute opacity-0 cursor-pointer h-0 w-0"
                        />
                        <span>{isCompleted ? '☑ Completed' : '☐ Mark Complete'}</span>
                      </label>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="space-y-6 text-left">
                    {/* Topics Checklist */}
                    <div>
                      <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-3">
                        Key Topics Covered
                      </h3>
                      <ul className="space-y-2">
                        {week.topics?.map((topic, i) => (
                          <li key={i} className="flex items-start gap-2.5 text-xs md:text-sm text-slate-600">
                            <span className="text-indigo-500 font-bold mt-0.5">✓</span>
                            <span>{topic}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Recommended Resources List */}
                    {week.resources && week.resources.length > 0 && (
                      <div className="space-y-3">
                        <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-2">
                          Recommended Resources
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {week.resources.map((resource, i) => (
                            <div 
                              key={i} 
                              className="border border-slate-200/60 rounded-xl p-4 flex justify-between items-center gap-3 bg-slate-50/50 hover:bg-white hover:border-indigo-100 transition-all duration-200 group/res hover:shadow-sm"
                            >
                              <div className="flex items-center gap-3 overflow-hidden">
                                <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 text-lg flex items-center justify-center flex-shrink-0 group-hover/res:bg-indigo-600 group-hover/res:text-white transition-colors duration-200">
                                  {getResourceIcon(resource.icon)}
                                </div>
                                <span className="text-xs font-bold text-slate-700 truncate">
                                  {resource.title}
                                </span>
                              </div>
                              <a 
                                href={resource.url} 
                                className="bg-white hover:bg-indigo-600 border border-slate-200 hover:border-indigo-600 text-slate-600 hover:text-white font-bold p-2.5 rounded-lg text-xs transition-all duration-200 flex-shrink-0" 
                                target="_blank" 
                                rel="noreferrer"
                              >
                                ↗
                              </a>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                </div>
              </div>
            )
          })}
        </div>
      )}

      {activeTab === 'projects' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm space-y-6">
          <h2 className="text-lg font-extrabold text-slate-800 border-b border-slate-100 pb-3">
            Recommended Projects
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {roadmap.recommended_projects?.map((proj, i) => (
              <div 
                key={i} 
                className="bg-slate-50/50 border border-slate-200/80 rounded-2xl p-5 hover:border-indigo-100 hover:bg-white transition-all duration-200 space-y-3"
              >
                <span className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 font-bold flex items-center justify-center text-xs">
                  {i + 1}
                </span>
                <p className="text-sm font-semibold text-slate-700 leading-relaxed text-left">
                  {proj}
                </p>
              </div>
            ))}
            {(!roadmap.recommended_projects || roadmap.recommended_projects.length === 0) && (
              <p className="text-xs text-slate-400">No project suggestions available right now.</p>
            )}
          </div>
        </div>
      )}

      {activeTab === 'interview' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm space-y-6">
          <h2 className="text-lg font-extrabold text-slate-800 border-b border-slate-100 pb-3">
            Interview Practice Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {roadmap.interview_questions?.map((q, i) => (
              <div 
                key={i} 
                className="bg-slate-50/50 border border-slate-200/80 rounded-2xl p-5 hover:border-indigo-100 hover:bg-white transition-all duration-200 space-y-3"
              >
                <span className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 font-bold flex items-center justify-center text-xs">
                  {i + 1}
                </span>
                <p className="text-sm font-semibold text-slate-700 leading-relaxed text-left font-serif italic">
                  "{q}"
                </p>
              </div>
            ))}
            {(!roadmap.interview_questions || roadmap.interview_questions.length === 0) && (
              <p className="text-xs text-slate-400">No interview questions available right now.</p>
            )}
          </div>
        </div>
      )}

      {activeTab === 'advice' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm space-y-8">
          
          <div className="space-y-4">
            <h2 className="text-lg font-extrabold text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
              🏆 Recommended Certifications
            </h2>
            <div className="space-y-3">
              {roadmap.certifications?.map((cert, i) => (
                <div key={i} className="flex gap-3 p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-semibold text-slate-700 hover:border-indigo-100 hover:bg-white transition-all duration-200">
                  <span className="text-lg">🏅</span>
                  <span className="text-left">{cert}</span>
                </div>
              ))}
              {(!roadmap.certifications || roadmap.certifications.length === 0) && (
                <p className="text-xs text-slate-400">No certifications recommended for this path.</p>
              )}
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <h2 className="text-lg font-extrabold text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
              💡 Strategic Career Advice
            </h2>
            <div className="space-y-3">
              {roadmap.career_advice?.map((advice, i) => (
                <div key={i} className="flex gap-3 p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-semibold text-slate-700 hover:border-indigo-100 hover:bg-white transition-all duration-200 border-l-4 border-l-indigo-600">
                  <span className="text-lg text-indigo-600">⚡</span>
                  <span className="text-left leading-relaxed">{advice}</span>
                </div>
              ))}
              {(!roadmap.career_advice || roadmap.career_advice.length === 0) && (
                <p className="text-xs text-slate-400">No general advice available right now.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Roadmap