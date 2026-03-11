import React, { useState } from "react";
import type { ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth"

const CreateAccount: React.FC = () => {
  const navigate = useNavigate();
  const { register, loading, error } = useAuth()

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value);
  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value);
  const handleConfirmChange = (e: ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value);

  const handleSignUp = async (): Promise<void> => {
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const res = await register(email, password)
      // backend returns a message about verification email
      if (res && (res as any).message) alert((res as any).message)
      else alert('Account created — please check your email to verify your account.')
      // navigate to login so user can sign in after verification
      navigate('/login')
    } catch (err: any) {
      console.error('Signup Error:', err)
      alert(err?.message || 'Failed to connect to the backend.')
    }
  }

  return (
    <div style={styles.container}>
      <h1>Create Account</h1>

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

      {error ? <div style={{ color: '#b00020', marginTop: 8 }}>{error}</div> : null}
    </div>
  );
};

const styles = {
  container: {
    minHeight: "200px",
    display: "flex",
    flexDirection: "column" as const,
    justifyContent: "center",
    alignItems: "center",
    gap: "20px",
    paddingTop: 24,
  },
  input: {
    width: "250px",
    padding: "8px",
    fontSize: "16px",
  },
  button: {
    width: "250px",
    fontSize: "16px",
    cursor: "pointer",
  },
};

export default CreateAccount;