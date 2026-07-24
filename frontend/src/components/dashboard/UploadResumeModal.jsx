import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FileText, X, UploadCloud, Loader2, ArrowRight } from 'lucide-react'

function UploadResumeModal({ isOpen, onClose, onSubmit, isLoading }) {
  const [file, setFile] = useState(null)
  const [jobDescription, setJobDescription] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file) {
      alert('Please choose a PDF resume first')
      return
    }
    await onSubmit(file, jobDescription)
    setFile(null)
    setJobDescription('')
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    const droppedFiles = e.dataTransfer.files
    if (droppedFiles.length > 0) {
      setFile(droppedFiles[0])
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !isLoading && onClose()}
            className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
          />
          
          {/* Modal */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.4 }}
            className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl border border-slate-200 z-10 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-8 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">New Gap Analysis</h2>
                  <p className="text-sm text-slate-600">Upload your resume and target role</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                disabled={isLoading}
                className="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              {/* File Upload */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-3">
                  Upload Resume (PDF)
                </label>
                
                <div
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  className="relative"
                >
                  <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-slate-300 hover:border-indigo-500 rounded-2xl bg-slate-50 hover:bg-indigo-50/50 cursor-pointer transition-all duration-200"
                  >
                    <div className="flex flex-col items-center justify-center py-8 text-center px-4">
                      <UploadCloud className="w-10 h-10 text-slate-400 mb-3" />
                      <span className="text-base font-semibold text-slate-700">
                        {file ? file.name : "Drag & drop or click to select"}
                      </span>
                      <span className="text-sm text-slate-500 mt-1">PDF file (Max 10MB)</span>
                    </div>
                    <input 
                      type="file" 
                      accept=".pdf" 
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                      disabled={isLoading}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Job Description */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-3">
                  Target Job Description
                </label>
                <textarea
                  placeholder="Paste the target job description or requirements here..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  disabled={isLoading}
                  rows={6}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg text-base focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none bg-slate-50 text-slate-900 placeholder-slate-500 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              {/* Submit Button */}
              <button 
                type="submit" 
                disabled={isLoading || !file}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-semibold rounded-lg text-base shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/40 transition-all duration-200 disabled:shadow-none flex items-center justify-center gap-2 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Analyzing Resume...</span>
                  </>
                ) : (
                  <>
                    <span>Start Gap Analysis</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default UploadResumeModal
