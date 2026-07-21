import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function UploadResume() {
  const [file, setFile] = useState(null)
  const [jobDescription, setJobDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()

    if (!file) {
      alert('Please choose a PDF resume first')
      return
    }

    const token = localStorage.getItem('token')

    if (!token) {
      alert('Please login again')
      return
    }

    setLoading(true)

    const formData = new FormData()
    formData.append('file', file)
    formData.append('job_description', jobDescription)

    try {
      const response = await fetch('http://127.0.0.1:8000/resumes/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.detail || 'Analysis failed')
      }

      navigate(`/analysis/${data.resume_id}`, {
        state: {
          analysis: {
            score: data.score,
            skills: data.skills || [],
            missing_skills: data.missing_skills || [],
            strengths: data.strengths || [],
            weaknesses: data.weaknesses || [],
            suggestions: data.suggestions || []
          }
        }
      })
    } catch (error) {
      console.error(error)
      alert(error.message || 'Something went wrong while analyzing the resume')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="upload-card">
      <h2>RoleReady AI Resume Analysis</h2>

      <form onSubmit={handleSubmit}>
        <input type="file" accept=".pdf" onChange={(e) => setFile(e.target.files[0])} />

        <textarea
          placeholder="Paste job description here..."
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          rows={8}
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Analyzing...' : 'Run Analysis'}
        </button>
      </form>
    </div>
  )
}

export default UploadResume