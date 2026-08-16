import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, 
  CheckCircle2, 
  XCircle, 
  ThumbsUp, 
  AlertTriangle, 
  Lightbulb, 
  Sparkles, 
  Loader2 
} from 'lucide-react'
import './Analysis.css'

function Analysis() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [analysis, setAnalysis] = useState(location.state?.analysis || null)
  const [loading, setLoading] = useState(!location.state?.analysis)
  const [isGenerating, setIsGenerating] = useState(false)

  useEffect(() => {
    if (location.state?.analysis) {
      setAnalysis(location.state.analysis)
      setLoading(false)
      return
    }

    async function fetchAnalysis() {
      try {
        const token = localStorage.getItem('token')
        const response = await fetch(`http://127.0.0.1:8000/resumes/${id}/analysis`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await response.json()
        setAnalysis(data)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalysis()
  }, [id, location.state])

  if (loading) {
    return (
      <div className="an-loading">
        <Loader2 size={40} className="an-spin" />
        <p>Analyzing your resume...</p>
      </div>
    )
  }

  if (!analysis) {
    return (
      <div className="an-loading">
        <AlertTriangle size={48} style={{ color: '#f59e0b', marginBottom: 12 }} />
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Analysis not found</h2>
        <button onClick={() => navigate('/resume-analyzer')} className="an-back-btn-primary">
          Back to Resume Analyzer
        </button>
      </div>
    )
  }

  return (
    <div className="an-page">
      {/* Back Button */}
      <button onClick={() => navigate('/resume-analyzer')} className="an-back-btn">
        <ArrowLeft size={16} />
        <span>Back to Resume Analyzer</span>
      </button>

      {/* Header Card */}
      <div className="an-header-card">
        <div className="an-header-accent"></div>
        <div className="an-header-content">
          <div className="an-header-left">
            <span className="an-eval-badge">
              <Sparkles size={14} />
              AI Evaluation Report
            </span>
            <h1 className="an-page-title">Resume Analysis</h1>
            <p className="an-page-subtitle">Detailed breakdown of your resume match score, skills gap, and growth roadmap.</p>
          </div>
          <div className="an-score-box">
            <div className="an-score-display">
              <span className="an-score-label">Match Score</span>
              <div className="an-score-number">{analysis.score}<span className="an-score-out">/100</span></div>
            </div>
          </div>
        </div>
        {/* Generate Roadmap Button - below the header content */}
        <div className="an-generate-row">
          <button
            disabled={isGenerating}
            onClick={async () => {
              setIsGenerating(true)
              const token = localStorage.getItem('token')
              try {
                const response = await fetch(`http://127.0.0.1:8000/roadmap/generate/${id}`, {
                  method: 'POST',
                  headers: { Authorization: `Bearer ${token}` }
                })
                if (response.ok) {
                  navigate(`/roadmap/${id}`)
                } else {
                  alert('Could not generate roadmap right now')
                }
              } catch (error) {
                console.error(error)
                alert('Could not generate roadmap right now')
              } finally {
                setIsGenerating(false)
              }
            }}
            className="an-generate-btn"
          >
            {isGenerating ? (
              <>
                <Loader2 size={16} className="an-spin" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Sparkles size={16} />
                <span>Generate Learning Roadmap</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Skills Grid */}
      <div className="an-grid">
        {/* Matched Skills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="an-card"
        >
          <div className="an-card-header">
            <div className="an-icon-box an-icon-green">
              <CheckCircle2 size={20} />
            </div>
            <h3>Matched Skills</h3>
          </div>
          <div className="an-tags-wrap">
            {analysis.skills?.map((s, i) => (
              <span key={i} className="an-tag an-tag-green">{s}</span>
            ))}
          </div>
        </motion.div>

        {/* Missing Skills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="an-card"
        >
          <div className="an-card-header">
            <div className="an-icon-box an-icon-red">
              <XCircle size={20} />
            </div>
            <h3>Missing Skills</h3>
          </div>
          <div className="an-tags-wrap">
            {analysis.missing_skills?.map((s, i) => (
              <span key={i} className="an-tag an-tag-red">{s}</span>
            ))}
          </div>
        </motion.div>

        {/* Strengths */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="an-card"
        >
          <div className="an-card-header">
            <div className="an-icon-box an-icon-indigo">
              <ThumbsUp size={20} />
            </div>
            <h3>Strengths</h3>
          </div>
          <ul className="an-list">
            {analysis.strengths?.map((s, i) => (
              <li key={i} className="an-list-item an-list-indigo">
                <span className="an-dot an-dot-indigo"></span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Weaknesses */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="an-card"
        >
          <div className="an-card-header">
            <div className="an-icon-box an-icon-amber">
              <AlertTriangle size={20} />
            </div>
            <h3>Weaknesses</h3>
          </div>
          <ul className="an-list">
            {analysis.weaknesses?.map((s, i) => (
              <li key={i} className="an-list-item an-list-amber">
                <span className="an-dot an-dot-amber"></span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>

      {/* Suggestions Full Width */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
        className="an-card an-card-full"
      >
        <div className="an-card-header">
          <div className="an-icon-box an-icon-violet">
            <Lightbulb size={20} />
          </div>
          <h3>Improvement Suggestions</h3>
        </div>
        <div className="an-suggestions-grid">
          {analysis.suggestions?.map((s, i) => (
            <div key={i} className="an-suggestion-item">
              <span className="an-suggestion-num">{i + 1}</span>
              <p>{s}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

export default Analysis