import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Register.css'

function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()

    if (password.length < 6) {
      alert('Password must be at least 6 characters long')
      return
    }

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
    <div className="login-page register-page">
      <div className="login-card">
        <div className="login-brand">
          <span className="login-brand-badge">🚀 Get Started</span>
          <h2>RoleReady AI</h2>
        </div>

        <div className="login-header">
          <h1>Create Account</h1>
          <p>Join thousands preparing for their dream role.</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              placeholder="Username"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="login-btn">
            Create Account
          </button>
        </form>

        <div className="divider">
          <span>OR</span>
        </div>

        <p className="register-text">Already have an account?</p>

        <Link to="/login" className="register-btn">
          Sign In
        </Link>
      </div>
    </div>
  )
}

export default Register
