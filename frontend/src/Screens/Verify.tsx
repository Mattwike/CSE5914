import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { verifyToken } from "../services/auth";
import { PageWrapper, MainContent } from "../components/layout"
import { Heading, Text } from "../components/ui"

const Verify: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<string>("Verifying your account...");
  const token = searchParams.get("token");
  const userEmail = searchParams.get("user_email");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token || !userEmail) {
      setStatus("No token found in the URL.");
      return;
    }

    const verify = async () => {
      try {
        const data = await verifyToken(token, userEmail);
        setStatus(data.message);
        if (data.message === "Account verified successfully!") {
          setTimeout(() => navigate("/login"), 3000);
        }
      } catch (error: any) {
        setStatus(error?.message || "Could not connect to the verification server.");
      }
    };

    verify();
  }, [token, userEmail, navigate]);

  return (
    <PageWrapper>
      <MainContent>
        <div className="text-center mt-2">
          <Heading level={1}>Verification Status</Heading>
          <Text as="p">{status}</Text>
        </div>
      </MainContent>
    </PageWrapper>
  );
};

export default Verify;
