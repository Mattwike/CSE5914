import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input, Button, Heading, Text, Card, LazyImage } from "../components/ui";
import { PageWrapper, MainContent } from "../components/layout";
import useAuth from "../hooks/useAuth"
import '../styles/home.css'

function Login() {
  const navigate = useNavigate();
  const { login, loading, error } = useAuth()

  // State for inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await login(email, password)
      localStorage.setItem('userId', res.id)
      localStorage.setItem('userEmail', res.email)
      alert("Login Successful!")
      navigate("/dashboard")
    } catch (err: any) {
      console.error("Login Error:", err)
      alert(err?.message || 'Could not connect to the server.')
    }
  }

  const img = '/ohio_outline.png'
  const imgSrcSet = `${img} 1120w, ${img} 560w`

  return (
    <PageWrapper>
      <MainContent>
        <div className="welcome-page">
          <div className="welcome-panel">
            <div className="welcome-left" aria-hidden="true">
              <LazyImage src={img} alt="Ohio outline" className="welcome-image" width={560} height={420} srcSet={imgSrcSet} sizes="(min-width:768px) 50vw, 100vw" />
            </div>

            <div className="welcome-right">
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
                  <Button onClick={() => navigate("/create-account")}>Create Account</Button>
                </div>

                {error ? <Text as="p" className="error-text">{error}</Text> : null}
                <div className="text-center mt-2">
                  <Button variant="ghost" onClick={() => navigate(-1)}>Back</Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </MainContent>
    </PageWrapper>
  );
}

export default Login;
