import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { PageWrapper, MainContent } from "../components/layout"
import { Heading, Text } from "../components/ui"

const API_BASE_URL = import.meta.env.VITE_WEBSITE_URL || "http://localhost:8000";

interface VerifyResponse {
  message: string;
}

const Verify: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<string>("Verifying your account...");
  const token = searchParams.get("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      setStatus("No token found in the URL.");
      return;
    }

    const verifyToken = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/verify?token=${token}`);
        const data: VerifyResponse = await response.json();
        setStatus(data.message);
        if (response.ok) {
          setTimeout(() => navigate("/login"), 3000);
        }
      } catch (error) {
        setStatus("Could not connect to the verification server.");
      }
    };

    verifyToken();
  }, [token, navigate]);

  return (
    <PageWrapper>
      <MainContent>
        <div style={{ textAlign: 'center', marginTop: 40 }}>
          <Heading level={1}>Verification Status</Heading>
          <Text as="p">{status}</Text>
        </div>
      </MainContent>
    </PageWrapper>
  );
};

export default Verify;