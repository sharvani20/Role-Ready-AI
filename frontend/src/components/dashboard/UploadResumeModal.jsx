import { useState, useEffect, useCallback } from 'react'
import {
  X,
  UploadCloud,
  Loader2,
  ArrowRight,
  CheckCircle
} from 'lucide-react'

function UploadResumeModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading
}) {
  const [file, setFile] = useState(null)
  const [jobDescription, setJobDescription] = useState('')

  const closeModal = useCallback(() => {
    if (!isLoading) {
      setFile(null)
      setJobDescription('')
      onClose()
    }
  }, [isLoading, onClose])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        closeModal()
      }
    }

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown)
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, closeModal])

  if (!isOpen) return null

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

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      closeModal()
    }
  }

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4 transition-opacity"
      onClick={handleBackdropClick}
    >
      <div
        className="relative bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="upload-modal-title"
      >
        <div className="flex items-center justify-between px-8 pt-6 pb-2">
          <h2 id="upload-modal-title" className="text-2xl font-bold text-slate-900">
            Upload Resume
          </h2>
          <button
            type="button"
            onClick={closeModal}
            disabled={isLoading}
            aria-label="Close modal"
            className="rounded-lg p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 p-8 pt-4">
          {/* Resume Upload */}
          <div>
            <label className="mb-3 block text-sm font-semibold text-slate-900">
              Resume PDF
              <span className="ml-1 text-red-500">*</span>
            </label>

            <div onDragOver={handleDragOver} onDrop={handleDrop}>
              <label className="flex h-48 w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 transition hover:border-indigo-500 hover:bg-indigo-50 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-200">
                {file ? (
                  <>
                    <CheckCircle className="mb-3 h-10 w-10 text-green-600" />
                    <p className="text-lg font-semibold text-slate-900">
                      {file.name}
                    </p>
                    <p className="mt-2 text-sm text-green-600">
                      Ready to upload
                    </p>
                  </>
                ) : (
                  <>
                    <UploadCloud className="mb-3 h-10 w-10 text-slate-400" />
                    <p className="text-lg font-semibold text-slate-800">
                      Drag & Drop Resume
                    </p>
                    <p className="mt-2 text-sm text-slate-500">
                      or click to browse
                    </p>
                    <p className="mt-3 text-xs text-slate-400">
                      PDF only • Max 10 MB
                    </p>
                  </>
                )}

                <input
                  type="file"
                  accept=".pdf"
                  hidden
                  disabled={isLoading}
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
              </label>
            </div>
          </div>

          {/* Job Description */}
          <div>
            <label htmlFor="job-description-textarea" className="mb-3 block text-sm font-semibold text-slate-900">
              Target Job Description
              <span className="ml-1 text-red-500">*</span>
            </label>

            <textarea
              id="job-description-textarea"
              rows={6}
              disabled={isLoading}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the complete job description from LinkedIn, Naukri, Indeed, or any company careers page..."
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 placeholder-slate-400 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            />

            <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
              <span>
                More detailed job descriptions produce better AI analysis.
              </span>
              <span>
                {jobDescription.length} characters
              </span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || !file || !jobDescription.trim()}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3.5 text-base font-semibold text-white shadow-lg transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
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
