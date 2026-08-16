import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Sparkles, Loader2 } from 'lucide-react'
import './Roadmap.css'

function Roadmap() {
  const { id } = useParams()
  const navigate = useNavigate()
  
  const [roadmap, setRoadmap] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('timeline')
  const [completedWeeks, setCompletedWeeks] = useState([])

  // Setup mode state
  const [targetRole, setTargetRole] = useState('')
  const [missingSkills, setMissingSkills] = useState('')
  const [generating, setGenerating] = useState(false)

  const loadRoadmap = async () => {
    if (!id) return
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
    if (id) {
      loadRoadmap()
    }
  }, [id])

  const handleGenerateRoadmap = async () => {
    if (!targetRole.trim()) {
      alert('Please enter a target role.')
      return
    }

    setGenerating(true)
    const token = localStorage.getItem('token')

    try {
      const skillsList = missingSkills
        .split(',')
        .map(s => s.trim())
        .filter(s => s.length > 0)

      const response = await fetch('http://127.0.0.1:8000/roadmap/generate-by-skills', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          target_role: targetRole,
          missing_skills: skillsList.length > 0 ? skillsList : ['General Skills']
        })
      })

      if (!response.ok) {
        throw new Error('Failed to generate roadmap')
      }

      const data = await response.json()
      setRoadmap(data)
      setCompletedWeeks([])

      if (data.resume_id) {
        navigate(`/roadmap/${data.resume_id}`, { replace: true })
      }
    } catch (err) {
      console.error(err)
      alert(err.message || 'Failed to generate roadmap')
    } finally {
      setGenerating(false)
    }
  }

  const handleToggleWeek = (weekNum) => {
    let updated
    if (completedWeeks.includes(weekNum)) {
      updated = completedWeeks.filter((w) => w !== weekNum)
    } else {
      updated = [...completedWeeks, weekNum]
    }
    setCompletedWeeks(updated)
    if (id) {
      localStorage.setItem(`role_ready_roadmap_${id}_completed`, JSON.stringify(updated))
    }
  }

  const getResourceIcon = (iconType) => {
    switch (iconType?.toLowerCase()) {
      case 'video': return '🎥'
      case 'code': return '💻'
      case 'book': return '📘'
      case 'article': return '📄'
      default: return '🔗'
    }
  }

  // Setup page (no ID and no roadmap loaded)
  if (!id && !roadmap) {
    return (
      <div className="rm-page">
        <div className="rm-header">
          <h1 className="rm-title">Skill Mastery Roadmap</h1>
          <p className="rm-subtitle">Personalized step-by-step learning path to bridge technical skill gaps</p>
        </div>

        <div className="rm-setup-card">
          <div className="rm-setup-card-header">
            <Sparkles size={20} style={{ color: '#6366f1' }} />
            <h2>Configure Roadmap Parameters</h2>
          </div>

          <div className="rm-setup-fields">
            <div className="rm-setup-field">
              <label>Target Role</label>
              <input
                type="text"
                placeholder="Senior Full Stack Engineer"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
              />
            </div>
            <div className="rm-setup-field">
              <label>Missing Skills (Comma separated)</label>
              <input
                type="text"
                placeholder="Docker, Kubernetes, CI/CD, GraphQL, System Design"
                value={missingSkills}
                onChange={(e) => setMissingSkills(e.target.value)}
              />
            </div>
            <button
              className="rm-generate-btn"
              onClick={handleGenerateRoadmap}
              disabled={generating}
            >
              {generating ? (
                <>
                  <Loader2 size={16} className="rm-spin" />
                  Generating...
                </>
              ) : (
                'Generate Roadmap'
              )}
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="rm-loading">
        <div className="rm-spinner"></div>
        <h2>Assessing placement timeline...</h2>
        <p>Compiling customizable roadmap recommendations.</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rm-error-card">
        <span className="rm-error-icon">⚠️</span>
        <h2>Something went wrong</h2>
        <p>{error}</p>
        <button onClick={loadRoadmap} className="rm-retry-btn">Try Again</button>
      </div>
    )
  }

  if (!roadmap || !roadmap.learning_roadmap || roadmap.learning_roadmap.length === 0) {
    return (
      <div className="rm-error-card">
        <span className="rm-error-icon">📭</span>
        <h2>No roadmap found</h2>
        <p>We couldn't find any weekly learning items for this profile.</p>
        <button onClick={() => navigate('/roadmap')} className="rm-retry-btn">Go Back</button>
      </div>
    )
  }

  // Progress metrics
  const totalWeeks = roadmap.learning_roadmap.length
  const completedCount = completedWeeks.filter(w => 
    roadmap.learning_roadmap.some(item => item.week === w)
  ).length
  const progressPercent = Math.round((completedCount / totalWeeks) * 100) || 0

  const renderCareerBadge = (level) => {
    const cleanLevel = level || 'Intermediate'
    switch (cleanLevel.toLowerCase()) {
      case 'beginner':
        return <span className="rm-badge rm-badge-green">🌱 Beginner</span>
      case 'advanced':
        return <span className="rm-badge rm-badge-purple">🔥 Advanced</span>
      default:
        return <span className="rm-badge rm-badge-amber">⚡ Intermediate</span>
    }
  }

  return (
    <div className="rm-page">
      {/* Back Button */}
      <button onClick={() => navigate('/roadmap')} className="rm-back-btn">
        ← Back to Roadmap Setup
      </button>

      {/* Header */}
      <div className="rm-roadmap-header">
        <div className="rm-roadmap-header-left">
          <div className="rm-roadmap-title-row">
            <h1>Learning Roadmap</h1>
            {renderCareerBadge(roadmap.career_level)}
          </div>
          <p>Personalized weekly milestones addressing resume match alignment gaps.</p>
        </div>
        <div className="rm-progress-widget">
          <div className="rm-progress-labels">
            <span>Roadmap Completion</span>
            <span className="rm-progress-value">{progressPercent}% ({completedCount}/{totalWeeks} Weeks)</span>
          </div>
          <div className="rm-progress-bar">
            <div className="rm-progress-fill" style={{ width: `${progressPercent}%` }}></div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="rm-tabs">
        {[
          { id: 'timeline', label: '📅 Timeline' },
          { id: 'projects', label: '🛠️ Projects' },
          { id: 'interview', label: '💬 Interview Prep' },
          { id: 'advice', label: '🏆 Career & Certs' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`rm-tab ${activeTab === tab.id ? 'rm-tab-active' : ''}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Timeline Tab */}
      {activeTab === 'timeline' && (
        <div className="rm-timeline">
          {roadmap.learning_roadmap.map((week, idx) => {
            const isCompleted = completedWeeks.includes(week.week)
            return (
              <div key={week.week} className="rm-timeline-row">
                <div className="rm-timeline-node-col">
                  <div className={`rm-timeline-node ${isCompleted ? 'rm-node-done' : ''}`}>
                    {isCompleted ? '✓' : week.week}
                  </div>
                  {idx < roadmap.learning_roadmap.length - 1 && (
                    <div className="rm-timeline-line"></div>
                  )}
                </div>
                <div className={`rm-week-card ${isCompleted ? 'rm-week-done' : ''}`}>
                  <div className="rm-week-header">
                    <div>
                      <h2>{week.title}</h2>
                      <span className="rm-hours-badge">⏱️ {week.study_hours || 8} hrs/week</span>
                    </div>
                    <label className={`rm-complete-label ${isCompleted ? 'rm-complete-active' : ''}`}>
                      <input
                        type="checkbox"
                        checked={isCompleted}
                        onChange={() => handleToggleWeek(week.week)}
                        style={{ display: 'none' }}
                      />
                      {isCompleted ? '☑ Completed' : '☐ Mark Complete'}
                    </label>
                  </div>
                  <div className="rm-week-body">
                    <div>
                      <h3 className="rm-section-label">Key Topics Covered</h3>
                      <ul className="rm-topics-list">
                        {week.topics?.map((topic, i) => (
                          <li key={i}>
                            <span className="rm-check">✓</span>
                            <span>{topic}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Projects Tab */}
      {activeTab === 'projects' && (
        <div className="rm-tab-card">
          <h2 className="rm-tab-card-title">Recommended Projects</h2>
          <div className="rm-project-grid">
            {roadmap.recommended_projects?.map((proj, i) => (
              <div key={i} className="rm-project-item">
                <span className="rm-project-num">{i + 1}</span>
                <p>{proj}</p>
              </div>
            ))}
            {(!roadmap.recommended_projects || roadmap.recommended_projects.length === 0) && (
              <p className="rm-empty-text">No project suggestions available right now.</p>
            )}
          </div>
        </div>
      )}

      {/* Interview Tab */}
      {activeTab === 'interview' && (
        <div className="rm-tab-card">
          <h2 className="rm-tab-card-title">Interview Practice Questions</h2>
          <div className="rm-project-grid">
            {roadmap.interview_questions?.map((q, i) => (
              <div key={i} className="rm-project-item">
                <span className="rm-project-num">{i + 1}</span>
                <p style={{ fontStyle: 'italic' }}>"{q}"</p>
              </div>
            ))}
            {(!roadmap.interview_questions || roadmap.interview_questions.length === 0) && (
              <p className="rm-empty-text">No interview questions available right now.</p>
            )}
          </div>
        </div>
      )}

      {/* Career & Certs Tab */}
      {activeTab === 'advice' && (
        <div className="rm-tab-card">
          <div className="rm-advice-section">
            <h2 className="rm-tab-card-title">🏆 Recommended Certifications</h2>
            <div className="rm-advice-list">
              {roadmap.certifications?.map((cert, i) => (
                <div key={i} className="rm-advice-item">
                  <span>🏅</span>
                  <span>{cert}</span>
                </div>
              ))}
              {(!roadmap.certifications || roadmap.certifications.length === 0) && (
                <p className="rm-empty-text">No certifications recommended for this path.</p>
              )}
            </div>
          </div>
          <div className="rm-advice-section" style={{ marginTop: 24 }}>
            <h2 className="rm-tab-card-title">💡 Strategic Career Advice</h2>
            <div className="rm-advice-list">
              {roadmap.career_advice?.map((advice, i) => (
                <div key={i} className="rm-advice-item rm-advice-highlight">
                  <span>⚡</span>
                  <span>{advice}</span>
                </div>
              ))}
              {(!roadmap.career_advice || roadmap.career_advice.length === 0) && (
                <p className="rm-empty-text">No general advice available right now.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Roadmap