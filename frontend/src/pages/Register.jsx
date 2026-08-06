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
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h1>PlaceMentor AI</h1>
        <h2>Register</h2>

        <label htmlFor="register-username" className="sr-only">Username</label>
        <input id="register-username" placeholder="Username" value={name} onChange={(e) => setName(e.target.value)} />

        <label htmlFor="register-email" className="sr-only">Email</label>
        <input id="register-email" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />

        <label htmlFor="register-password" className="sr-only">Password</label>
        <input id="register-password" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />

        <button type="submit">Register</button>

        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  )
}

export default Register