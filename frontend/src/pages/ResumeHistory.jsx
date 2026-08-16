import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FileText, Upload, ArrowRight, Loader2, Inbox } from 'lucide-react'

function ResumeHistory() {
  const navigate = useNavigate()
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) return

    fetch('http://127.0.0.1:8000/resumes/latest/summary', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => (res.ok ? res.json() : { has_resume: false }))
      .then(setSummary)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 animate-fade-in">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
        <p className="text-sm font-medium text-slate-500">Loading resume history...</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded-full mb-3">
            Documents
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">My Resumes</h1>
          <p className="text-slate-500 mt-1 text-sm">View and manage your uploaded resume analyses.</p>
        </div>
        <button
          onClick={() => navigate('/dashboard')}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold px-5 py-2.5 rounded-xl text-sm shadow-lg shadow-indigo-500/25 transition-all"
        >
          <Upload className="w-4 h-4" />
          Upload New
        </button>
      </div>

      {!summary?.has_resume ? (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-2xl p-12 text-center shadow-sm"
        >
          <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-5">
            <Inbox className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">No resumes yet</h2>
          <p className="text-sm text-slate-500 mb-6 max-w-sm mx-auto">
            Upload your first resume to get an AI-powered gap analysis and personalized learning roadmap.
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-xl text-sm transition-all"
          >
            Go to Dashboard
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ y: -2 }}
          onClick={() => navigate(`/analysis/${summary.resume_id}`)}
          className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-indigo-500/30 transition-all duration-300 cursor-pointer group"
        >
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 group-hover:bg-gradient-to-br group-hover:from-indigo-500 group-hover:to-violet-600 group-hover:text-white transition-all duration-300">
              <FileText className="w-7 h-7" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-slate-900 truncate group-hover:text-indigo-600 transition-colors">
                {summary.filename}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Uploaded {summary.uploaded_at ? new Date(summary.uploaded_at).toLocaleDateString() : 'Recently'}
              </p>
            </div>
            <div className="text-right shrink-0">
              <div className="text-2xl font-black text-indigo-600">{summary.score}%</div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Match Score</div>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all shrink-0" />
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default ResumeHistory
