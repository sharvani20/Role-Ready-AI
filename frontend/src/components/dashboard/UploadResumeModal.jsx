
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FileText,
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
 
  console.log("UploadResumeModal rendered");
console.log("isOpen =", isOpen);
  const [file, setFile] = useState(null)
  const [jobDescription, setJobDescription] = useState('')

  useEffect(() => {
    if (!isOpen) {
      setFile(null)
      setJobDescription('')
    }
  }, [isOpen])

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

  const closeModal = () => {
    if (!isLoading) {
      onClose()
    }
  }
  if (!isOpen) return null;

return (
  <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50">
    <div className="bg-white rounded-2xl w-full max-w-2xl p-8 shadow-2xl">
      <h2 className="text-2xl font-bold mb-4">
        Upload Resume
      </h2>

      {/* Your form here */}
      <form
              onSubmit={handleSubmit}
              className="space-y-7 p-8"
            >

              {/* Resume */}

              <div>

                <label className="mb-3 block text-sm font-semibold text-slate-900">
                  Resume PDF
                  <span className="ml-1 text-red-500">*</span>
                </label>

                <div
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >

                  <label
                    className="flex h-52 w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 transition hover:border-indigo-500 hover:bg-indigo-50"
                  >

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
                      onChange={(e) =>
                        setFile(e.target.files?.[0] || null)
                      }
                    />

                  </label>

                </div>

              </div>

              {/* Job Description */}

              <div>

                <label className="mb-3 block text-sm font-semibold text-slate-900">
                  Target Job Description
                  <span className="ml-1 text-red-500">*</span>
                </label>

                <textarea
                  rows={8}
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

              {/* Button */}

              <button
                type="submit"
                disabled={
                  isLoading ||
                  !file ||
                  !jobDescription.trim()
                }
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-4 text-base font-semibold text-white shadow-lg transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300"
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
  }  export default UploadResumeModal