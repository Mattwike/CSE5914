import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

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
    <div style={styles.container}>
      <h1>Login</h1>

      <input
        style={styles.input}
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        style={styles.input}
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button 
        style={styles.button} 
        onClick={handleLogin}
        disabled={loading}
      >
        {loading ? "Logging in..." : "Log In"}
      </button>

      <div style={styles.footer}>
        <p>Don't have an account?</p>
        <button style={styles.button} onClick={() => navigate("/create-account")}>
          Create Account
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column" as const,
    justifyContent: "center",
    alignItems: "center",
    gap: "20px",
    marginTop: "50px"
  },
  input: {
    width: "250px",
    padding: "5px",
    fontSize: "20px",
  },
  button: {
    width: "250px",
    fontSize: "20px",
    cursor: "pointer",
  },
  footer: {
    textAlign: "center" as const,
    marginTop: "10px"
  }
};

export default Login;