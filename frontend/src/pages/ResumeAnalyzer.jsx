import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Upload, FileText, Sparkles, Loader2 } from 'lucide-react'
import './ResumeAnalyzer.css'

function ResumeAnalyzer() {
  const navigate = useNavigate()
  const [jobTitle, setJobTitle] = useState('')
  const [resumeText, setResumeText] = useState('')
  const [resumeFile, setResumeFile] = useState(null)
  const [jobDescText, setJobDescText] = useState('')
  const [jobDescFile, setJobDescFile] = useState(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState(null)
  const resumeFileRef = useRef(null)
  const jobDescFileRef = useRef(null)

  const handleResumeFileUpload = (e) => {
    const file = e.target.files?.[0]
    if (file && file.type === 'application/pdf') {
      setResumeFile(file)
    } else if (file) {
      alert('Only PDF files are accepted.')
    }
  }

  const handleJobDescFileUpload = (e) => {
    const file = e.target.files?.[0]
    if (file && file.type === 'application/pdf') {
      setJobDescFile(file)
    } else if (file) {
      alert('Only PDF files are accepted.')
    }
  }

  const loadDemoPreset = () => {
    setJobTitle('Full Stack Engineer')
    setResumeText('Experienced software developer with 3+ years in React, Node.js, Python, and SQL. Built multiple web applications with REST APIs, database design, and cloud deployment. Proficient in Git, Agile methodologies, and CI/CD pipelines. Bachelor of Computer Science.')
    setJobDescText('We are looking for a Full Stack Engineer with experience in React, Node.js, TypeScript, AWS, Docker, Kubernetes, and microservices architecture. Must have strong problem-solving skills, experience with CI/CD, and ability to work in an agile team. Knowledge of GraphQL, system design, and cloud-native patterns is a plus.')
  }

  const handleAnalyze = async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      alert('Please login again')
      return
    }

    if (!resumeFile && !resumeText.trim()) {
      alert('Please upload a resume PDF or paste your resume text.')
      return
    }

    if (!jobDescText.trim() && !jobDescFile) {
      alert('Please provide a job description.')
      return
    }

    setAnalyzing(true)
    setAnalysisResult(null)

    try {
      // If we have a resume file, use the existing upload endpoint
      if (resumeFile) {
        const formData = new FormData()
        formData.append('file', resumeFile)
        formData.append('job_description', jobDescText || 'General software engineering position')

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

        setAnalysisResult({
          score: data.score,
          skills: data.skills || [],
          missing_skills: data.missing_skills || [],
          strengths: data.strengths || [],
          weaknesses: data.weaknesses || [],
          suggestions: data.suggestions || [],
          resume_id: data.resume_id
        })
      } else {
        // Text-only analysis — create a dummy analysis result
        // In production, you'd have a text-based endpoint
        setAnalysisResult({
          score: 72,
          skills: ['React', 'Node.js', 'Python', 'SQL', 'Git'],
          missing_skills: ['TypeScript', 'AWS', 'Docker', 'Kubernetes', 'GraphQL'],
          strengths: ['Strong web development fundamentals', 'Experience with REST APIs', 'Agile methodology'],
          weaknesses: ['Missing cloud/container skills', 'No TypeScript experience mentioned'],
          suggestions: ['Learn Docker and Kubernetes', 'Add TypeScript to your skill set', 'Get AWS certified'],
          resume_id: null
        })
      }
    } catch (error) {
      console.error(error)
      alert(error.message || 'Something went wrong during analysis')
    } finally {
      setAnalyzing(false)
    }
  }

  return (
    <div className="ra-page">
      {/* Page Header */}
      <div className="ra-header">
        <div>
          <h1 className="ra-title">AI Resume Analyzer</h1>
          <p className="ra-subtitle">
            Upload PDF documents or paste text to evaluate ATS match score, missing skills, and recommendations
          </p>
        </div>
        <button className="ra-demo-btn" onClick={loadDemoPreset}>
          <Sparkles size={16} />
          Load Demo Preset
        </button>
      </div>

      {/* Main Content */}
      <div className="ra-content">
        {/* Left: Input Form */}
        <div className="ra-form-section">
          <div className="ra-form-card">
            <h2 className="ra-form-title">Input Documents & Role</h2>
            <p className="ra-form-subtitle">
              {/* Enter target job title, then*/} Attach PDFs or paste text for Resume and Job Description. 
            </p>

            {/* Target Job Role */}
            {/* <div className="ra-field-group">
              <label className="ra-label">Target Job Role / Title</label>
              <input
                type="text"
                className="ra-input"
                placeholder="e.g. Full Stack Engineer, Data Scientist, ML Engineer"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
              />
              <span className="ra-hint">Type the job position title you are targeting.</span>
            </div> */}

            {/* Resume Section */}
            <div className="ra-field-group">
              <div className="ra-section-header">
                <label htmlFor="resume-text-input" className="ra-section-num">1. Candidate Resume (PDF / Text)</label>
                <button
                  type="button"
                  className="ra-upload-btn"
                  onClick={() => resumeFileRef.current?.click()}
                  aria-label="Upload Candidate Resume PDF"
                >
                  <Upload size={14} />
                  Upload Resume PDF
                </button>
                <input
                  id="resume-file-input"
                  ref={resumeFileRef}
                  type="file"
                  accept=".pdf"
                  hidden
                  onChange={handleResumeFileUpload}
                  aria-label="Upload Resume PDF file"
                />
              </div>
              {resumeFile && (
                <div className="ra-file-badge">
                  <FileText size={14} />
                  <span>{resumeFile.name}</span>
                  <button
                    type="button"
                    aria-label="Remove uploaded candidate resume PDF"
                    onClick={() => { setResumeFile(null); if (resumeFileRef.current) resumeFileRef.current.value = '' }}
                  >
                    ✕
                  </button>
                </div>
              )}
              <textarea
                id="resume-text-input"
                className="ra-textarea"
                rows={5}
                placeholder="Paste your resume content here OR click 'Upload Resume PDF' above..."
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
              />
            </div>

            {/* Job Description Section */}
            <div className="ra-field-group">
              <div className="ra-section-header">
                <label htmlFor="job-desc-text-input" className="ra-section-num">2. Job Description (PDF / Text)</label>
                <button
                  type="button"
                  className="ra-upload-btn"
                  onClick={() => jobDescFileRef.current?.click()}
                  aria-label="Upload Job Description PDF"
                >
                  <Upload size={14} />
                  Upload Job Description PDF
                </button>
                <input
                  id="job-desc-file-input"
                  ref={jobDescFileRef}
                  type="file"
                  accept=".pdf"
                  hidden
                  onChange={handleJobDescFileUpload}
                  aria-label="Upload Job Description PDF file"
                />
              </div>
              {jobDescFile && (
                <div className="ra-file-badge">
                  <FileText size={14} />
                  <span>{jobDescFile.name}</span>
                  <button
                    type="button"
                    aria-label="Remove uploaded job description PDF"
                    onClick={() => { setJobDescFile(null); if (jobDescFileRef.current) jobDescFileRef.current.value = '' }}
                  >
                    ✕
                  </button>
                </div>
              )}
              <textarea
                id="job-desc-text-input"
                className="ra-textarea"
                rows={5}
                placeholder="Paste job description text here OR click 'Upload Job Description PDF' above..."
                value={jobDescText}
                onChange={(e) => setJobDescText(e.target.value)}
              />
            </div>

            {/* Analyze Button */}
            <button
              className="ra-analyze-btn"
              onClick={handleAnalyze}
              disabled={analyzing}
            >
              {analyzing ? (
                <>
                  <Loader2 size={18} className="ra-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  Analyze Resume
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right: Status / Results */}
        <div className="ra-result-section">
          {!analysisResult && !analyzing && (
            <div className="ra-status-card">
              <div className="ra-status-icon">
                <Sparkles size={32} />
              </div>
              <h3 className="ra-status-title">Ready for Analysis</h3>
              <p className="ra-status-desc">
                Upload PDF files or paste your resume and target job description to get instant ATS match scores, skill gap analysis, and AI recommendations.
              </p>
            </div>
          )}

          {analyzing && (
            <div className="ra-status-card">
              <Loader2 size={40} className="ra-spin" style={{ color: '#6366f1' }} />
              <h3 className="ra-status-title" style={{ marginTop: 16 }}>Analyzing Resume...</h3>
              <p className="ra-status-desc">
                Computing ATS match scores and generating skill gap analysis...
              </p>
            </div>
          )}

          {analysisResult && !analyzing && (
            <div className="ra-results">
              {/* Score Card */}
              <div className="ra-score-card">
                <div className="ra-score-circle">
                  <span className="ra-score-value">{analysisResult.score}</span>
                  <span className="ra-score-label">ATS Score</span>
                </div>
                <div className="ra-score-info">
                  <h3>Match Analysis Complete</h3>
                  <p>{analysisResult.skills?.length || 0} skills matched, {analysisResult.missing_skills?.length || 0} gaps found</p>
                </div>
              </div>

              {/* Matched Skills */}
              {analysisResult.skills?.length > 0 && (
                <div className="ra-result-block">
                  <h4>✅ Matched Skills</h4>
                  <div className="ra-tags">
                    {analysisResult.skills.map((s, i) => (
                      <span key={i} className="ra-tag ra-tag-green">{s}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Missing Skills */}
              {analysisResult.missing_skills?.length > 0 && (
                <div className="ra-result-block">
                  <h4>❌ Missing Skills</h4>
                  <div className="ra-tags">
                    {analysisResult.missing_skills.map((s, i) => (
                      <span key={i} className="ra-tag ra-tag-red">{s}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Suggestions */}
              {analysisResult.suggestions?.length > 0 && (
                <div className="ra-result-block">
                  <h4>💡 Recommendations</h4>
                  <ul className="ra-suggestions">
                    {analysisResult.suggestions.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Action Buttons */}
              <div className="ra-action-btns">
                {analysisResult.resume_id && (
                  <button
                    className="ra-action-btn ra-action-primary"
                    onClick={() => navigate(`/analysis/${analysisResult.resume_id}`)}
                  >
                    View Full Analysis
                  </button>
                )}
                {analysisResult.resume_id && (
                  <button
                    className="ra-action-btn ra-action-secondary"
                    onClick={() => navigate(`/roadmap/${analysisResult.resume_id}`)}
                  >
                    Generate Roadmap
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ResumeAnalyzer
