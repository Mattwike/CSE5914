import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

// Define an interface for your backend response
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
        const response = await fetch(`http://localhost:8000/verify?token=${token}`);
        const data: VerifyResponse = await response.json();
        
        setStatus(data.message);
        
        // Optional: Redirect to login after 3 seconds on success
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
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Verification Status</h1>
      <p>{status}</p>
    </div>
  );
};

export default Verify;