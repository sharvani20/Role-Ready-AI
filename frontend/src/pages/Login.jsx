import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function Login() {
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()

    const formData = new FormData()
    formData.append('username', name)
    formData.append('password', password)

    const response = await fetch('http://127.0.0.1:8000/auth/login', {
      method: 'POST',
      body: formData,
    })

    const data = await response.json()

    if (!response.ok) {
      alert(data.detail)
      return
    }

    localStorage.setItem('token', data.access_token)
    navigate('/dashboard')
  }

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h1>Role Ready AI</h1>
        <h2>Login</h2>

        <input placeholder="Username" value={name} onChange={(e) => setName(e.target.value)} />

        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />

        <button type="submit">Login</button>

        <p>
          Don’t have an account? <Link to="/register">Register</Link>
        </p>
      </form>
    </div>
  )
}

export default Login