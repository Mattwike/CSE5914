import React from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { Button, Card, Heading, Text } from "../components/ui";
import { PageWrapper, MainContent } from "../components/layout";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    alert("Logged out!");
    navigate("/login");
  };

  return (
    <PageWrapper>
      <MainContent>
          <header className="mb-4">
            <Heading level={1}>Welcome Back!</Heading>
            <Text>Here is what's happening with your account today.</Text>
          </header>

          <section className="stats-grid">
            <Card className="card card--elevated">
              <Heading level={3}>Total Activity</Heading>
              <Text as="p" className="type-xl">1,240</Text>
            </Card>
            <Card className="card card--elevated">
              <Heading level={3}>Notifications</Heading>
              <Text as="p" className="type-xl">3 New</Text>
            </Card>
            <Card className="card card--elevated">
              <Heading level={3}>Status</Heading>
              <Text as="p" className="status-active">Verified</Text>
            </Card>
          </section>

          <section>
            <Card className="card">
              <Heading level={3}>Recent Updates</Heading>
              <div className="table-placeholder">
                <Text>You verified your email yesterday at 4:30 PM.</Text>
              </div>
            </Card>
          </section>
        </MainContent>
    </PageWrapper>
  );
};

export default Dashboard;