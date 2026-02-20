import React, { useState } from "react";
import type { ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_WEBSITE_URL || "http://localhost:8000";

// 1. Define the shape of your Backend response
interface RegisterResponse {
  message: string;
}

const CreateAccount: React.FC = () => {
  const navigate = useNavigate();

  // 2. Explicitly type your State
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  // 3. Type-safe Event Handlers
  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value);
  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value);
  const handleConfirmChange = (e: ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value);

  const debug = async (): Promise<void> => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/account/debug`, 
        { method: "POST",
          headers: {"Content-Type": "application/json",},
          body: JSON.stringify({ email, password})        
        }
      );
      if (!response.ok) throw new Error("Server error");
      const data: RegisterResponse = await response.json();
      alert(data.message);
    } catch (error) {
      console.error("Debug Error:", error);
      alert("Failed to connect to the backend.");
    }
  };

  const handleSignUp = async (): Promise<void> => {
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/account/create_account`, 
        { method: "POST",
          headers: {"Content-Type": "application/json",},
          body: JSON.stringify({ email, password })        
        }
      );
      
      console.log("email:", email);

      if (!response.ok) throw new Error("Server error");

      const data: RegisterResponse = await response.json();
      alert(data.message);
      
      // Optionally navigate to a "Check your email" page
      // navigate("/check-email");
      
    } catch (error) {
      console.error("Signup Error:", error);
      alert("Failed to connect to the backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1>Create Account</h1>

      <button 
        style={styles.button} 
        onClick={debug} 
        disabled={loading}
      >
        Debug
      </button>

      <input
        style={styles.input}
        type="email"
        placeholder="Email"
        value={email}
        onChange={handleEmailChange}
      />

      <input
        style={styles.input}
        type="password"
        placeholder="Password"
        value={password}
        onChange={handlePasswordChange}
      />

      <input
        style={styles.input}
        type="password"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={handleConfirmChange}
      />

      <button 
        style={styles.button} 
        onClick={handleSignUp} 
        disabled={loading}
      >
        {loading ? "Processing..." : "Sign Up"}
      </button>
    </div>
  );
};

const styles = {
  container: {
    height: "100px",
    display: "flex",
    flexDirection: "column" as const,
    justifyContent: "center",
    alignItems: "center",
    gap: "20px",
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
};

export default CreateAccount;