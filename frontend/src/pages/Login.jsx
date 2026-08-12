import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData()
    // The backend expects the email address in the 'username' form field
    formData.append('username', email)
    formData.append('password', password)

    try {
      const response = await fetch('http://127.0.0.1:8000/auth/login', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.detail || 'Login failed. Please check your credentials.')
        return
      }

      localStorage.setItem('token', data.access_token)
      navigate('/dashboard')
    } catch (err) {
      console.error(err)
      setError('A network error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <form className="auth-form max-w-sm mx-auto my-8" onSubmit={handleSubmit}>
        <h1>Role Ready AI</h1>
        <h2>Login</h2>

        {error && (
          <div
            className="p-3 mb-4 text-sm text-red-700 bg-red-50 border border-red-100 rounded-lg"
            role="alert"
          >
            ⚠️ {error}
          </div>
        )}

        <div className="form-group">
          <label htmlFor="login-email" className="form-label">
            Email Address
          </label>
          <input
            id="login-email"
            type="email"
            className="form-input"
            placeholder="e.g., candidate@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </div>

        <div className="form-group">
          <label htmlFor="login-password" className="form-label">
            Password
          </label>
          <input
            id="login-password"
            type="password"
            className="form-input"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary btn-block disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <p className="mt-6 text-center">
          Don’t have an account? <Link to="/register">Register</Link>
        </p>
      </form>
    </div>
  )
}

export default Login
