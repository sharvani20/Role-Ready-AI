import { useState } from 'react'
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

  if (!isOpen) return null

  const handleClose = () => {
    if (!isLoading) {
      setFile(null)
      setJobDescription('')
      onClose()
    }
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
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="upload-modal-title"
        className="bg-white rounded-2xl w-full max-w-2xl p-6 sm:p-8 shadow-2xl relative border border-slate-100"
      >
        <div className="flex items-center justify-between pb-4 mb-2 border-b border-slate-100">
          <h2 id="upload-modal-title" className="text-2xl font-bold text-slate-900">
            Upload Resume
          </h2>
          <button
            type="button"
            onClick={handleClose}
            disabled={isLoading}
            aria-label="Close modal"
            className="rounded-lg p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 pt-2">
          {/* Resume Upload Field */}
          <div>
            <label htmlFor="resume-upload-input" className="mb-2 block text-sm font-semibold text-slate-900">
              Resume PDF
              <span className="ml-1 text-red-500" aria-hidden="true">*</span>
            </label>

            <div onDragOver={handleDragOver} onDrop={handleDrop}>
              <label
                htmlFor="resume-upload-input"
                className="flex h-48 w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 transition hover:border-indigo-500 hover:bg-indigo-50 focus-within:ring-2 focus-within:ring-indigo-500"
              >
                {file ? (
                  <>
                    <CheckCircle className="mb-2 h-10 w-10 text-green-600" />
                    <p className="text-base font-semibold text-slate-900">
                      {file.name}
                    </p>
                    <p className="mt-1 text-sm text-green-600 font-medium">
                      Ready to upload
                    </p>
                  </>
                ) : (
                  <>
                    <UploadCloud className="mb-2 h-10 w-10 text-slate-400" />
                    <p className="text-base font-semibold text-slate-800">
                      Drag & Drop Resume
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      or click to browse
                    </p>
                    <p className="mt-2 text-xs text-slate-400">
                      PDF only • Max 10 MB
                    </p>
                  </>
                )}

                <input
                  id="resume-upload-input"
                  type="file"
                  accept=".pdf"
                  className="sr-only"
                  disabled={isLoading}
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
              </label>
            </div>
          </div>

          {/* Job Description Field */}
          <div>
            <label htmlFor="job-description-input" className="mb-2 block text-sm font-semibold text-slate-900">
              Target Job Description
              <span className="ml-1 text-red-500" aria-hidden="true">*</span>
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
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3.5 text-base font-semibold text-white shadow-lg transition hover:bg-indigo-700 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
                Analyzing Resume...
              </>
            ) : (
              <>
                Start Gap Analysis
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

export default UploadResumeModal
