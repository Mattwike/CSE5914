import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, Heading, Text } from "../components/ui";
import { EventCard } from '../components/events'
import { GroupCard } from '../components/groups'
import '../styles/dashboard.css'
import { PageWrapper, MainContent } from "../components/layout";

const sampleEvents = [
  { id: 'e1', title: 'Campus Study Group', date: new Date().toISOString(), location: 'The Union', description: 'Quick study meet to prep for exams.', thumbnail: '/block.jpg' },
  { id: 'e2', title: 'Hackathon Info Session', date: new Date().toISOString(), location: 'STEM Hall', description: 'Intro to the upcoming hackathon.', thumbnail: '/block.jpg' }
]

const sampleGroups = [
  { id: 'g1', name: 'Robotics Club', members: 42, location: 'Engineering', description: 'Building robots and competing in challenges.', thumbnail: '/block.jpg' },
  { id: 'g2', name: 'Art Society', members: 18, location: 'Fine Arts', description: 'Weekly sketching sessions and workshops.', thumbnail: '/block.jpg' }
]

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    alert("Logged out!");
    navigate("/login");
  };

  return (
    <PageWrapper>
      <MainContent>
          {/* Hero Section */}
          <section className="dashboard-hero">
            <div className="hero-left">
              <Heading level={1}>Welcome to Campus Events</Heading>
              <Text>Connect with student groups, discover campus activities, and stay involved.</Text>

              <div className="hero-stats" style={{ marginTop: 'var(--space-md)' }}>
                <div className="stats-grid">
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
                </div>
              </div>
            </div>

            <div className="hero-right">
              <img src="/brutus_friend.jpg" alt="Brutus and friend" style={{ width: '100%', borderRadius: 'var(--radius-md)' }} />
            </div>
          </section>

          {/* Featured Section */}
          <section className="dashboard-feature-grid">
            <Card className="card section-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Heading level={3}>Featured Events</Heading>
                <Button onClick={() => navigate('/events')}>View All</Button>
              </div>
              <div style={{ marginTop: 'var(--space-md)' }} className="dashboard-preview">
                <EventCard event={sampleEvents[0]} onView={(id: string) => navigate(`/events/${id}`)} />
              </div>
            </Card>

            <Card className="card section-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Heading level={3}>Featured Groups</Heading>
                <Button onClick={() => navigate('/groups')}>View All</Button>
              </div>
              <div style={{ marginTop: 'var(--space-md)' }} className="dashboard-preview">
                <GroupCard group={sampleGroups[0]} onView={(id: string) => navigate(`/groups/${id}`)} />
              </div>
            </Card>
          </section>
        </MainContent>
    </PageWrapper>
  );
};

export default Dashboard;