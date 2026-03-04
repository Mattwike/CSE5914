import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

// Grab your API URL from environment variables
const API_BASE_URL = import.meta.env.VITE_WEBSITE_URL || "http://localhost:8000";

function Login() {
  const navigate = useNavigate();

  // State for inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      // --- BACKEND CONNECTION SPOT ---
      const response = await fetch(`${API_BASE_URL}/account/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Login Successful!");
        navigate("/dashboard");
      } else {
        alert(data.message || "Invalid credentials");
      }
      // -------------------------------
    } catch (error) {
      console.error("Login Error:", error);
      alert("Could not connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper login-page">
      <div className="container">
        <div className="card login-card" style={{ maxWidth: 420, margin: "48px auto", display: "flex", gap: 16, flexDirection: "column" }}>
          <h1>Login</h1>

          <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }} style={{ display: "flex", gap: 12, flexDirection: "column" }}>
            <Input label="Email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Input label="Password" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />

            <Button type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Log In"}
            </Button>
          </form>

          <div style={{ textAlign: "center", marginTop: 8 }}>
            <p style={{ margin: '8px 0' }}>Don't have an account?</p>
            <Button variant="ghost" onClick={() => navigate("/create-account")}>Create Account</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;