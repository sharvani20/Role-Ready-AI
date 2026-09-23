import { useState, useEffect } from 'react'
import {
  X,
  UploadCloud,
  Loader2,
  ArrowRight,
  CheckCircle,
  Trash2
} from 'lucide-react'

function UploadResumeModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading
}) {
  const [file, setFile] = useState(null)
  const [jobDescription, setJobDescription] = useState('')

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen && !isLoading) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, isLoading, onClose])

  if (!isOpen) return null

  const closeModal = () => {
    if (!isLoading) {
      setFile(null)
      setJobDescription('')
      onClose()
    }
  }

  const handleRemoveFile = (e) => {
    e.stopPropagation()
    e.preventDefault()
    setFile(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!file) {
      alert('Please upload your resume.')
      return
    }

    if (file.type !== 'application/pdf') {
      alert('Only PDF resumes are allowed.')
      return
    }

    if (!jobDescription.trim()) {
      alert('Please paste the job description.')
      return
    }

    await onSubmit(file, jobDescription)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()

    const droppedFile = e.dataTransfer.files[0]

    if (!droppedFile) return

    if (droppedFile.type !== 'application/pdf') {
      alert('Only PDF resumes are allowed.')
      return
    }

    setFile(droppedFile)
  }

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="upload-modal-title"
    >
      <div className="bg-white rounded-2xl w-full max-w-2xl p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
          <h2 id="upload-modal-title" className="text-2xl font-bold text-slate-900">
            Upload Resume
          </h2>
          <button
            type="button"
            onClick={closeModal}
            disabled={isLoading}
            aria-label="Close modal"
            className="rounded-full p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Resume */}
          <div>
            <label htmlFor="resume-file-input" className="mb-2 block text-sm font-semibold text-slate-900">
              Resume PDF <span className="text-red-500">*</span>
            </label>

            <div onDragOver={handleDragOver} onDrop={handleDrop}>
              <label
                htmlFor="resume-file-input"
                className="flex h-48 w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 transition hover:border-indigo-500 hover:bg-indigo-50 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-200"
              >
                {file ? (
                  <div className="flex flex-col items-center text-center p-4">
                    <CheckCircle className="mb-2 h-9 w-9 text-green-600" />
                    <p className="text-base font-semibold text-slate-900 max-w-xs truncate">
                      {file.name}
                    </p>
                    <p className="mt-1 text-sm text-green-600">Ready to upload</p>
                    <button
                      type="button"
                      onClick={handleRemoveFile}
                      aria-label="Remove selected resume"
                      className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-full transition"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Remove PDF
                    </button>
                  </div>
                ) : (
                  <>
                    <UploadCloud className="mb-2 h-9 w-9 text-slate-400" />
                    <p className="text-base font-semibold text-slate-800">
                      Drag & Drop Resume
                    </p>
                    <p className="mt-1 text-sm text-slate-500">or click to browse</p>
                    <p className="mt-2 text-xs text-slate-400">PDF only • Max 10 MB</p>
                  </>
                )}

                <input
                  id="resume-file-input"
                  type="file"
                  accept=".pdf"
                  className="sr-only"
                  disabled={isLoading}
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
              </label>
            </div>
          </div>

          {/* Job Description */}
          <div>
            <label htmlFor="job-description-input" className="mb-2 block text-sm font-semibold text-slate-900">
              Target Job Description <span className="text-red-500">*</span>
            </label>

            <textarea
              id="job-description-input"
              rows={6}
              disabled={isLoading}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the complete job description from LinkedIn, Naukri, Indeed, or any company careers page..."
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 placeholder-slate-400 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            />

            <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
              <span>More detailed job descriptions produce better AI analysis.</span>
              <span>{jobDescription.length} characters</span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || !file || !jobDescription.trim()}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3.5 text-base font-semibold text-white shadow-lg transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Analyzing Resume...
              </>
            ) : (
              <>
                Start Gap Analysis
                <ArrowRight className="h-5 w-5" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

export default UploadResumeModal
