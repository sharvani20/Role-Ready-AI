import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'


function Analysis() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [analysis, setAnalysis] = useState(location.state?.analysis || null)
  const [loading, setLoading] = useState(!location.state?.analysis)

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

  if (loading) return <p>Loading analysis...</p>
  if (!analysis) return <p>Analysis not found</p>

  return (
    <div className="analysis-page">
      <button className="back-btn" onClick={() => navigate('/dashboard')}>
        ← Back to Dashboard
      </button>

      <h1>Resume Analysis</h1>

      <div className="score-card">
        <h2>Resume Match Score</h2>
        <div className="score">{analysis.score}/100</div>
        <button
          onClick={async () => {
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
            }
          }}
        >
          Generate Learning Roadmap
        </button>
      </div>
      <div className="analysis-grid">
        <div className="analysis-card">
          <h3>Matched Skills</h3>
          <ul>{analysis.skills?.map((s, i) => <li key={i}>{s}</li>)}</ul>
        </div>

        <div className="analysis-card">
          <h3>Missing Skills</h3>
          <ul>{analysis.missing_skills?.map((s, i) => <li key={i}>{s}</li>)}</ul>
        </div>

        <div className="analysis-card">
          <h3>Strengths</h3>
          <ul>{analysis.strengths?.map((s, i) => <li key={i}>{s}</li>)}</ul>
        </div>

        <div className="analysis-card">
          <h3>Weaknesses</h3>
          <ul>{analysis.weaknesses?.map((s, i) => <li key={i}>{s}</li>)}</ul>
        </div>
      </div>

      <div className="analysis-card full-width">
        <h3>Improvement Suggestions</h3>
        <ul>{analysis.suggestions?.map((s, i) => <li key={i}>{s}</li>)}</ul>
      </div>

    </div>
  )
}

export default Analysis