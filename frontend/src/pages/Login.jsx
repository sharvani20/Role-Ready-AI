import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    const formData = new FormData();
    formData.append("username", name);
    formData.append("password", password);

    const response = await fetch("http://127.0.0.1:8000/auth/login", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.detail);
      return;
    }

    localStorage.setItem("token", data.access_token);
    navigate("/resume-analyzer");
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-brand">
          <span className="login-brand-badge">✨ AI Placement Coach</span>
          <h2>RoleReady AI</h2>
        </div>

        <div className="login-header">
          <h1>Welcome Back</h1>
          <p>Sign in to continue your placement journey.</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <input
              type="text"
              placeholder="Username"
              value={name}
              onChange={(e) => setName(e.target.value)}
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
            Sign In
          </button>
        </form>

        <div className="divider">
          <span>OR</span>
        </div>

        <p className="register-text">Don&apos;t have an account?</p>

        <Link to="/register" className="register-btn">
          Create Account
        </Link>
      </div>
    </div>
  );
}

export default Login;
