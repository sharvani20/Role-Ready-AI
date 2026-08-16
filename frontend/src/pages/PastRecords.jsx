import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FileText, Map, Loader2 } from 'lucide-react'
import './PastRecords.css'

function PastRecords() {
  const navigate = useNavigate()
  const [resumes, setResumes] = useState([])
  const [roadmaps, setRoadmaps] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) return

    const fetchData = async () => {
      try {
        // Fetch resume analyses
        const resumeRes = await fetch('http://127.0.0.1:8000/resumes/list', {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (resumeRes.ok) {
          const resumeData = await resumeRes.json()
          setResumes(resumeData)
        }

        // Fetch roadmaps
        const roadmapRes = await fetch('http://127.0.0.1:8000/roadmap/list', {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (roadmapRes.ok) {
          const roadmapData = await roadmapRes.json()
          setRoadmaps(roadmapData)
        }
      } catch (err) {
        console.error('Error fetching past records:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="pr-loading">
        <Loader2 size={40} className="pr-spin" />
        <p>Loading your records...</p>
      </div>
    )
  }

  return (
    <div className="pr-page">
      {/* Header */}
      <div className="pr-header">
        <h1 className="pr-title">Candidate Learning History</h1>
        <p className="pr-subtitle">Your past resume match scores, skill gap reports, and active roadmaps</p>
      </div>

      {/* Two Column Layout */}
      <div className="pr-grid">
        {/* Saved Resume Analyses */}
        <div className="pr-card">
          <h2 className="pr-card-title">
            <FileText size={18} />
            Saved Resume Analyses ({resumes.length})
          </h2>
          <div className="pr-card-body">
            {resumes.length === 0 ? (
              <p className="pr-empty">No previous resume analyses found.</p>
            ) : (
              <div className="pr-list">
                {resumes.map((r) => (
                  <div
                    key={r.resume_id}
                    className="pr-list-item"
                    onClick={() => navigate(`/analysis/${r.resume_id}`)}
                  >
                    <div className="pr-list-item-main">
                      <h3>{r.filename}</h3>
                      <div className="pr-list-item-meta">
                        <span className="pr-score-badge">{r.score}% match</span>
                        <span className="pr-date">
                          {r.uploaded_at ? new Date(r.uploaded_at).toLocaleDateString() : 'Recently'}
                        </span>
                      </div>
                    </div>
                    <span className="pr-arrow">→</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Generated Roadmaps */}
        <div className="pr-card">
          <h2 className="pr-card-title">
            <Map size={18} />
            Generated Roadmaps ({roadmaps.length})
          </h2>
          <div className="pr-card-body">
            {roadmaps.length === 0 ? (
              <p className="pr-empty">No generated roadmaps found.</p>
            ) : (
              <div className="pr-list">
                {roadmaps.map((rm, idx) => (
                  <div
                    key={idx}
                    className="pr-list-item"
                    onClick={() => rm.resume_id && navigate(`/roadmap/${rm.resume_id}`)}
                  >
                    <div className="pr-list-item-main">
                      <h3>Mastery Roadmap for {rm.target_role || 'Unknown Role'}</h3>
                      <div className="pr-list-item-meta">
                        <span className="pr-role-badge">{rm.target_role || rm.career_level}</span>
                        <span className="pr-date">
                          {rm.created_at ? new Date(rm.created_at).toLocaleDateString() : new Date().toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <span className="pr-arrow">→</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PastRecords
