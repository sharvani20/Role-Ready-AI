import { motion } from 'framer-motion'
import { Sparkles, ArrowRight, TrendingUp, CheckCircle2 } from 'lucide-react'
import './HeroSection.css'

function HeroSection({ 
  isProgressView, 
  summary, 
  onUploadClick, 
  onViewHistoryClick,
  circumference,
  scoreVal,
  strokeDashoffset
}) {
  const getStatusBadge = (score) => {
    if (!summary.has_resume) return { text: 'Not Started', class: 'badge-slate' }
    if (score >= 85) return { text: 'Excellent', class: 'badge-emerald' }
    if (score >= 60) return { text: 'Good', class: 'badge-amber' }
    return { text: 'Needs Improvement', class: 'badge-rose' }
  }

  const status = getStatusBadge(scoreVal)

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="custom-hero-banner"
    >
      <div className="hero-glow-1"></div>
      <div className="hero-glow-2"></div>

      <div className="hero-grid-layout">
        <div className="hero-left-content">
          <span className="hero-top-badge">
            <Sparkles className="icon-xs" /> AI Career Coach
          </span>
          
          <div className="hero-text-group">
            <h1 className="hero-main-title">
              AI Placement Assistant
            </h1>
            <p className="hero-subtitle">
              Analyze resumes, detect missing skills, generate personalized roadmaps and practice AI mock interviews.
            </p>
          </div>

          <div className="hero-action-buttons">
            <motion.button 
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              onClick={onUploadClick}
              className="hero-primary-btn"
            >
              <span>Upload Resume</span>
              <ArrowRight className="icon-sm" />
            </motion.button>
            
            <motion.button 
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              onClick={onViewHistoryClick}
              className="hero-secondary-btn"
            >
              Resume History
            </motion.button>
          </div>

          <div className="hero-features-list">
            <div className="feature-item"><CheckCircle2 className="icon-sm text-indigo" /><span>ATS Analysis</span></div>
            <div className="feature-item"><CheckCircle2 className="icon-sm text-indigo" /><span>Skill Gap Detection</span></div>
            <div className="feature-item"><CheckCircle2 className="icon-sm text-indigo" /><span>AI Mock Interviews</span></div>
          </div>
        </div>

        <motion.div 
          whileHover={{ y: -4 }}
          transition={{ duration: 0.2 }}
          className="hero-score-card"
        >
          <div className="hero-card-header">
            <h3 className="hero-card-title"><TrendingUp className="icon-sm text-indigo" /> Job Readiness</h3>
            <span className={`hero-status-pill ${status.class}`}>{status.text}</span>
          </div>

          <div className="hero-gauge-row">
            <div className="circular-gauge-wrapper">
              <svg className="gauge-svg">
                <circle cx="40" cy="40" r="32" className="gauge-bg-circle" strokeWidth="5" fill="transparent" />
                <motion.circle
                  cx="40" cy="40" r="32"
                  className="gauge-progress-circle"
                  strokeWidth="5"
                  fill="transparent"
                  strokeDasharray={circumference}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  strokeLinecap="round"
                />
              </svg>
              <div className="gauge-inner-text">
                <span className="gauge-value">{summary.has_resume ? `${summary.score}%` : 'N/A'}</span>
              </div>
            </div>

            <div className="gauge-bar-col">
              <div className="gauge-bar-labels">
                <span className="label-sub">Current ATS Score</span>
                <span className="label-target">Target: 85%</span>
              </div>
              <div className="gauge-track">
                <motion.div 
                  className="gauge-fill"
                  initial={{ width: 0 }}
                  animate={{ width: `${summary.has_resume ? summary.score : 0}%` }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                />
              </div>
            </div>
          </div>

          <div className="hero-card-footer">
            <p className="footer-desc">
              {summary.has_resume 
                ? `Your match score is ${summary.score}%. Benchmark target is 85% to apply effectively.`
                : 'Submit your resume profile to calculate matching score and unlock AI insights.'}
            </p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default HeroSection