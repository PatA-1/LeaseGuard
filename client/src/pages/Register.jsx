import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

function Register() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/auth/register", form);
      alert("Registration successful");
      navigate("/login");
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="auth-shell">
      <div className="card auth-card">
        <h1 className="auth-title">Create account</h1>
        <p className="auth-subtitle">
          Set up your LeaseGuard account to record and protect inspection evidence.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="label">Email address</label>
            <input
              className="input"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="label">Password</label>
            <input
              className="input"
              name="password"
              type="password"
              placeholder="Create a password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <button className="btn btn-primary" type="submit" style={{ width: "100%" }}>
            Create Account
          </button>
        </form>

        <p style={{ marginTop: "18px" }} className="muted">
          Already have an account?{" "}
          <Link to="/login" className="nav-link">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;