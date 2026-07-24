import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { FileText, Calendar, Award, Clock } from 'lucide-react'
import HeroSection from '../components/dashboard/HeroSection'
import ProgressCard from '../components/dashboard/ProgressCard'
import StatsCard from '../components/dashboard/StatsCard'
import GoalsCard from '../components/dashboard/GoalsCard'
import ActionCard from '../components/dashboard/ActionCard'
import ActivityCard from '../components/dashboard/ActivityCard'
import UploadResumeModal from '../components/dashboard/UploadResumeModal'


function Dashboard() {
  const navigate = useNavigate()
  const location = useLocation()
  const isProgressView = new URLSearchParams(location.search).get('view') === 'progress'

  // State Management
  const [summary, setSummary] = useState({ has_resume: false })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [roadmapProgress, setRoadmapProgress] = useState({ percent: 0, completedCount: 0, text: '0/4 weeks' })
  const [mockInterviewStats, setMockInterviewStats] = useState({ count: 0, avgScore: 'N/A' })
  const [recentInterviews, setRecentInterviews] = useState([])

  // Fetch Dashboard Summary
  const fetchSummary = async () => {
    setLoading(true)
    setError(null)
    const token = localStorage.getItem('token')

    try {
      const response = await fetch('http://127.0.0.1:8000/resumes/latest/summary', {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch summary data from dashboard api.')
      }

      const data = await response.json()
      setSummary(data)

      // Calculate roadmap progress
      if (data.has_resume && data.resume_id) {
        const completedKey = `role_ready_roadmap_${data.resume_id}_completed`
        const completedStr = localStorage.getItem(completedKey)
        const completedList = completedStr ? JSON.parse(completedStr) : []
        const percent = Math.round((completedList.length / 4) * 100)
        setRoadmapProgress({
          percent: percent,
          completedCount: completedList.length,
          text: `${completedList.length}/4 weeks completed`
        })
      } else {
        setRoadmapProgress({ percent: 0, completedCount: 0, text: 'No active roadmap' })
      }
    } catch (err) {
      console.error(err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Load all data
  useEffect(() => {
    fetchSummary()

    // Load mock interview stats
    const interviewsStr = localStorage.getItem('role_ready_completed_interviews')
    if (interviewsStr) {
      const interviews = JSON.parse(interviewsStr)
      setRecentInterviews(interviews.slice(-3).reverse())
      if (interviews.length > 0) {
        const totalScore = interviews.reduce((sum, item) => sum + item.score, 0)
        const avg = Math.round(totalScore / interviews.length)
        setMockInterviewStats({
          count: interviews.length,
          avgScore: `${avg}/100`
        })
      }
    }
  }, [])

  // Handle Resume Upload
  const handleUploadSubmit = async (file, jobDescription) => {
    const token = localStorage.getItem('token')
    if (!token) {
      alert('Please login again')
      return
    }

    setUploading(true)
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

      setModalOpen(false)
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
      setUploading(false)
    }
  }

  // Get dynamic AI recommendation
  const getAIRecommendation = () => {
    if (!summary.has_resume) {
      return {
        title: 'Run Gap Analysis',
        detail: 'Upload your resume and target role description to generate key skill alignments.'
      }
    }
    if (roadmapProgress.completedCount === 0) {
      return {
        title: 'Start Week 1 Foundations',
        detail: 'Initiate Week 1 study topics in your custom roadmap to address core engineering gaps.'
      }
    }
    if (mockInterviewStats.count === 0) {
      return {
        title: 'Conduct First AI Interview',
        detail: 'Practice with a Software Engineering mock session to review communication scores.'
      }
    }
    if (summary.score < 85) {
      return {
        title: 'Continue Learning Timeline',
        detail: 'Complete Week 2 and review missing layout properties in your resume gaps.'
      }
    }
    return {
      title: 'Practice Advanced Simulation',
      detail: 'Take a Backend/System Design mock interview to test transaction integrity models.'
    }
  }

  // Generate activities list
  const getActivities = () => {
    const list = []

    if (summary.has_resume) {
      list.push({
        id: 'resume',
        icon: '📄',
        text: `Analyzed resume for target role matching (${summary.filename})`,
        time: summary.uploaded_at ? new Date(summary.uploaded_at).toLocaleDateString() : 'Recently'
      })
    }

    if (roadmapProgress.completedCount > 0) {
      list.push({
        id: 'roadmap',
        icon: '📅',
        text: `Completed ${roadmapProgress.completedCount} week checklist items on custom roadmap`,
        time: 'Active'
      })
    }

    recentInterviews.forEach((item) => {
      list.push({
        id: `interview-${item.id}`,
        icon: '🎙️',
        text: `Completed ${item.categoryName || 'Practice'} Mock Interview — Scored ${item.score}/100`,
        time: item.date
      })
    })

    if (list.length === 0) {
      list.push({
        id: 'welcome',
        icon: '✨',
        text: 'Registered account and initialized Placement Preparation Hub',
        time: 'Just now'
      })
    }

    return list
  }

  // Tasks for daily goals
  const tasks = [
    { id: 1, label: 'Run Resume Analysis & keyword mismatch checks', done: !!summary.has_resume },
    { id: 2, label: 'Complete Week 1 topics on custom Learning Roadmap', done: roadmapProgress.completedCount > 0 },
    { id: 3, label: 'Conduct one Mock Interview to evaluate readiness score', done: mockInterviewStats.count > 0 }
  ]

  const completedTasksCount = tasks.filter(t => t.done).length
  const checklistPercent = Math.round((completedTasksCount / tasks.length) * 100)

  // Calculations for circular progress
  const radius = 32
  const circumference = 2 * Math.PI * radius
  const scoreVal = summary.has_resume ? summary.score : 0
  const strokeDashoffset = circumference - (scoreVal / 100) * circumference

  const recAction = getAIRecommendation()
  const activities = getActivities()

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-slate-50">
      {/* Main Content */}
      <main className="flex-1 p-8 lg:p-12 max-w-[1600px] w-full mx-auto">
        <div className="space-y-8">
          {/* Hero Section */}
          <HeroSection
            isProgressView={isProgressView}
            summary={summary}
            onUploadClick={() => setModalOpen(true)}
            onViewHistoryClick={() => navigate('/resumes')}
            circumference={circumference}
            scoreVal={scoreVal}
            strokeDashoffset={strokeDashoffset}
          />

          {/* Dashboard Grid */}
          <div className="space-y-8">
            {/* Row 1: AI Recommendation + Roadmap Progress */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm hover:shadow-md transition-all duration-300 h-full">
                  <div className="space-y-4 mb-8">
                    <h2 className="text-2xl font-bold text-slate-900">
                      {recAction.title}
                    </h2>
                    <p className="text-base text-slate-600 leading-relaxed">
                      {recAction.detail}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      if (!summary.has_resume) {
                        setModalOpen(true)
                      } else if (roadmapProgress.completedCount === 0 || summary.score < 85) {
                        navigate(`/roadmap/${summary.resume_id}`)
                      } else {
                        navigate('/mock-interview')
                      }
                    }}
                    className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-200 hover:shadow-lg"
                  >
                    <span>
                      {!summary.has_resume
                        ? 'Upload Resume'
                        : roadmapProgress.completedCount === 0 || summary.score < 85
                        ? 'View Roadmap'
                        : 'Start Interview'}
                    </span>
                  </button>
                </div>
              </div>

              <ProgressCard
                icon="📅"
                label="Roadmap Progress"
                percentage={roadmapProgress.percent}
                description={roadmapProgress.text}
                buttonText={summary.has_resume ? 'Open Study Roadmap' : 'Configure Roadmap'}
                onButtonClick={() => {
                  if (summary.has_resume && summary.resume_id) {
                    navigate(`/roadmap/${summary.resume_id}`)
                  } else {
                    setModalOpen(true)
                  }
                }}
              />
            </div>

            {/* Row 2: Mock Sessions + Daily Goals */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <StatsCard
                icon="🎙️"
                label="Mock Assessment"
                mainValue={mockInterviewStats.count}
                secondaryLabel="sessions taken"
                progressValue={Math.min((mockInterviewStats.count / 5) * 100, 100)}
                secondaryValue={mockInterviewStats.avgScore}
                buttonText="Start Practice Session"
                onButtonClick={() => navigate('/mock-interview')}
              />

              <div className="lg:col-span-2">
                <GoalsCard
                  tasks={tasks}
                  completedCount={completedTasksCount}
                  checklistPercent={checklistPercent}
                />
              </div>
            </div>

            {/* Row 3: Action Cards */}
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-6">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <ActionCard
                  icon={FileText}
                  title="Analyze Resume"
                  description="Diagnose keyword mismatches and compute score comparisons."
                  onAction={() => setModalOpen(true)}
                />
                <ActionCard
                  icon={Calendar}
                  title="Continue Roadmap"
                  description="Follow target skill checklists and study references."
                  onAction={() => {
                    if (summary.has_resume && summary.resume_id) {
                      navigate(`/roadmap/${summary.resume_id}`)
                    } else {
                      setModalOpen(true)
                    }
                  }}
                />
                <ActionCard
                  icon={Award}
                  title="Mock Interview"
                  description="Run simulation dialogs and examine report outputs."
                  onAction={() => navigate('/mock-interview')}
                />
              </div>
            </div>

            {/* Row 4: Recent Activity */}
            <div>
              <ActivityCard activities={activities} />
            </div>
          </div>
        </div>
      </main>

      {/* Upload Modal */}
      <UploadResumeModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleUploadSubmit}
        isLoading={uploading}
      />
    </div>
  )
}

export default Dashboard
