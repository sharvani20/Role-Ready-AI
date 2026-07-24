import { motion } from 'framer-motion'
import { Sparkles, ArrowRight, TrendingUp } from 'lucide-react'

function HeroSection({ 
  isProgressView, 
  summary, 
  onUploadClick, 
  onViewHistoryClick,
  circumference,
  scoreVal,
  strokeDashoffset
}) {
  if (isProgressView) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white border border-slate-200 rounded-2xl p-8 lg:p-12 shadow-sm"
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start lg:items-center">
          <div className="lg:col-span-2 space-y-4">
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 border border-indigo-200 px-4 py-2 rounded-lg">
              📊 Progress Analytics
            </span>
            <h1 className="text-5xl font-bold text-slate-900 leading-tight">
              Placement Journey Metrics
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
              Monitor your ATS resume scoring benchmarks, active learning progress, mock session records, and automated career coach updates.
            </p>
          </div>

          {/* Score Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 flex flex-col items-center gap-4">
            <div className="relative flex items-center justify-center w-24 h-24">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  className="stroke-slate-200"
                  strokeWidth="6"
                  fill="transparent"
                />
                <motion.circle
                  cx="48"
                  cy="48"
                  r="40"
                  className="stroke-indigo-600"
                  strokeWidth="6"
                  fill="transparent"
                  strokeDasharray={2 * Math.PI * 40}
                  initial={{ strokeDashoffset: 2 * Math.PI * 40 }}
                  animate={{ strokeDashoffset: 2 * Math.PI * 40 - (scoreVal / 100) * (2 * Math.PI * 40) }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute text-center">
                <span className="text-2xl font-bold text-indigo-600">
                  {summary.has_resume ? `${summary.score}%` : 'N/A'}
                </span>
              </div>
            </div>
            <div className="text-center space-y-1">
              <h3 className="font-semibold text-slate-900">ATS Readiness</h3>
              <p className="text-sm text-slate-600">
                {summary.has_resume 
                  ? `Your ATS match is ${summary.score}%. Target: 85%`
                  : 'Run resume analysis to evaluate readiness.'}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 rounded-2xl p-8 lg:p-12 shadow-lg border border-indigo-800/50 overflow-hidden relative"
    >
      {/* Decorative gradients */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl -z-10 -translate-x-1/2 translate-y-1/2"></div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start lg:items-center relative z-10">
        {/* Left Content */}
        <div className="lg:col-span-2 space-y-6">
          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-300 bg-indigo-500/20 border border-indigo-500/40 px-4 py-2 rounded-lg">
            <Sparkles className="w-3.5 h-3.5" /> AI Career Coach
          </span>
          
          <div className="space-y-4">
            <h1 className="text-5xl font-bold text-white leading-tight">
              AI Placement Assistant
            </h1>
            <p className="text-lg text-indigo-100 leading-relaxed max-w-2xl">
              Upload your resume and target role description to generate keyword analysis, identify critical skill gaps, construct weekly learning roadmaps, and practice simulator reviews.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <button 
              onClick={onUploadClick}
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-6 py-3 rounded-lg shadow-lg shadow-indigo-600/40 hover:shadow-indigo-600/60 transition-all duration-300 hover:translate-y-[-2px] text-base"
            >
              <span>Start Placement Journey</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <button 
              onClick={onViewHistoryClick}
              className="inline-flex items-center gap-2 bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold px-6 py-3 rounded-lg transition-all duration-300 hover:translate-y-[-2px] text-base"
            >
              View Resume History
            </button>
          </div>
        </div>

        {/* Right Score Card */}
        <div className="bg-slate-900/60 backdrop-blur border border-slate-700/50 rounded-2xl p-6 flex flex-col gap-4">
          <div className="relative flex items-center justify-center w-20 h-20">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="40"
                cy="40"
                r="32"
                className="stroke-slate-700"
                strokeWidth="5"
                fill="transparent"
              />
              <motion.circle
                cx="40"
                cy="40"
                r="32"
                className="stroke-indigo-500"
                strokeWidth="5"
                fill="transparent"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute text-center">
              <span className="text-lg font-bold text-white">
                {summary.has_resume ? `${summary.score}%` : 'N/A'}
              </span>
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-400" /> Job Readiness
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              {summary.has_resume 
                ? `Your match score is ${summary.score}%. Benchmark target is 85% to apply.`
                : 'Submit your resume profile to calculate matching score.'}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default HeroSection
