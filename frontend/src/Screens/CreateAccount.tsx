import React, { useState } from "react";
import type { ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth"
import { PageWrapper, MainContent } from "../components/layout"
import { Card, Heading, Input, Button, Text, LazyImage } from "../components/ui"
import '../styles/home.css'

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
      if (res && (res as any).message) alert((res as any).message)
      else alert('Account created — please check your email to verify your account.')
      navigate('/login')
    } catch (err: any) {
      console.error('Signup Error:', err)
      alert(err?.message || 'Failed to connect to the backend.')
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
                <Heading level={1}>Create Account</Heading>

                <Input label="Email" type="email" placeholder="you@example.com" value={email} onChange={handleEmailChange} />
                <Input label="Password" type="password" placeholder="Password" value={password} onChange={handlePasswordChange} />
                <Input label="Confirm Password" type="password" placeholder="Confirm Password" value={confirmPassword} onChange={handleConfirmChange} />

                <Button onClick={handleSignUp} disabled={loading}>{loading ? 'Processing...' : 'Sign Up'}</Button>

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
};

export default CreateAccount;