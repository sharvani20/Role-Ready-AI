import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()

    const response = await fetch('http://127.0.0.1:8000/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    })

    const data = await response.json()

    if (!response.ok) {
      alert(data.detail)
      return
    }

    alert('Registration successful')
    navigate('/login')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 font-sans">
      <div className="bg-white p-8 md:p-10 rounded-2xl border border-slate-200 shadow-xl w-full max-w-md space-y-6 text-left">
        {/* Branding & Header */}
        <div className="text-center space-y-2 mb-2">
          <div className="flex items-center justify-center gap-2">
            <span className="text-3xl">🧠</span>
            <span className="font-extrabold text-2xl tracking-tight bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
              RoleReady AI
            </span>
          </div>
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
            AI Career Placement Coach
          </p>
        </div>

        <div className="space-y-1.5 text-center">
          <h2 className="text-xl font-bold text-slate-900">Create Account</h2>
          <p className="text-xs text-slate-500">Register to map and close your engineering skills gap</p>
        </div>

        {/* Register Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Username field */}
          <div className="space-y-1.5">
            <label htmlFor="username" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Username <span className="text-rose-500">*</span>
            </label>
            <input
              id="username"
              type="text"
              required
              placeholder="candidate123"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none bg-slate-50 text-slate-900 placeholder-slate-400 transition-all duration-200"
            />
          </div>

          {/* Email field */}
          <div className="space-y-1.5">
            <label htmlFor="email" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Email Address <span className="text-rose-500">*</span>
            </label>
            <input
              id="email"
              type="email"
              required
              placeholder="candidate@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none bg-slate-50 text-slate-900 placeholder-slate-400 transition-all duration-200"
            />
          </div>

          {/* Password field */}
          <div className="space-y-1.5">
            <label htmlFor="password" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Password <span className="text-rose-500">*</span>
            </label>
            <input
              id="password"
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none bg-slate-50 text-slate-900 placeholder-slate-400 transition-all duration-200"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm shadow-md shadow-indigo-600/10 hover:shadow-lg hover:shadow-indigo-600/20 transition-all duration-200 cursor-pointer text-center"
          >
            Create Account
          </button>
        </form>

        {/* Footer Navigation */}
        <p className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-600 hover:text-indigo-700 font-bold hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Register