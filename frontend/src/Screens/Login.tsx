import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input, Button, Heading, Text, Card } from "../components/ui";
import { PageWrapper, MainContent } from "../components/layout";
import useAuth from "../hooks/useAuth"

function Login() {
  const navigate = useNavigate();
  const { login, loading, error } = useAuth()

  // State for inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      await login(email, password)
      alert("Login Successful!")
      navigate("/dashboard")
    } catch (err: any) {
      console.error("Login Error:", err)
      alert(err?.message || 'Could not connect to the server.')
    }
  }

  return (
    <PageWrapper className="login-page">
      <MainContent>
        <Card className="login-card centered-card">
          <Heading level={1}>Login</Heading>

          <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }} className="form-stack">
            <Input label="Email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Input label="Password" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />

            <Button type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Log In"}
            </Button>
          </form>

          <div className="text-center mt-2">
            <Text as="p" className="mb-1">Don't have an account?</Text>
            <Button variant="ghost" onClick={() => navigate("/create-account")}>Create Account</Button>
          </div>

          {error ? <Text as="p" className="error-text">{error}</Text> : null}
        </Card>
      </MainContent>
    </PageWrapper>
  );
}

export default Login;