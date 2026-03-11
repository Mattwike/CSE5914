import React from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { Button, Card, Heading, Text } from "../components/ui";
import { PageWrapper, Sidebar, MainContent } from "../components/layout";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    alert("Logged out!");
    navigate("/login");
  };

  return (
    <PageWrapper>
      <div className="app-layout">
        <Sidebar>
          <Heading level={2} className="mb-3">App Name</Heading>
          <ul className="sidebar-nav">
            <li><NavLink to="/dashboard" className={({isActive}) => isActive ? 'active' : ''}>Home</NavLink></li>
            <li><NavLink to="/events" className={({isActive}) => isActive ? 'active' : ''}>Events</NavLink></li>
            <li><NavLink to="/profile" className={({isActive}) => isActive ? 'active' : ''}>Profile</NavLink></li>
            <li><NavLink to="/settings" className={({isActive}) => isActive ? 'active' : ''}>Settings</NavLink></li>
          </ul>
          <Button variant="ghost" onClick={handleLogout}>Logout</Button>
        </Sidebar>

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
      </div>
    </PageWrapper>
  );
};

export default Dashboard;