import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, Heading, Text } from "../components/ui";
import { PageWrapper, Sidebar, MainContent } from "../components/layout";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear tokens/user data here later
    alert("Logged out!");
    navigate("/login");
  };

  return (
    <PageWrapper style={styles.dashboardContainer}>
      <div className="app-layout">
        <Sidebar>
          <Heading level={2} className="mb-3">App Name</Heading>
          <ul className="sidebar-nav" style={styles.navList as any}>
            <li style={styles.navItem as any}>Home</li>
            <li style={styles.navItem as any}>Profile</li>
            <li style={styles.navItem as any}>Settings</li>
          </ul>
          <Button style={styles.logoutBtn} onClick={handleLogout}>Logout</Button>
        </Sidebar>

        <MainContent>
          <header style={styles.header}>
            <Heading level={1}>Welcome Back!</Heading>
            <Text>Here is what's happening with your account today.</Text>
          </header>

          <section style={styles.statsGrid}>
            <Card style={styles.card}>
              <Heading level={3}>Total Activity</Heading>
              <Text as="p" style={styles.statNumber}>1,240</Text>
            </Card>
            <Card style={styles.card}>
              <Heading level={3}>Notifications</Heading>
              <Text as="p" style={styles.statNumber}>3 New</Text>
            </Card>
            <Card style={styles.card}>
              <Heading level={3}>Status</Heading>
              <Text as="p" style={styles.statusActive}>Verified</Text>
            </Card>
          </section>

          <section>
            <Card style={styles.recentActivity}>
              <Heading level={3}>Recent Updates</Heading>
              <div style={styles.tablePlaceholder}>
                <Text>You verified your email yesterday at 4:30 PM.</Text>
              </div>
            </Card>
          </section>
        </MainContent>
      </div>
    </PageWrapper>
  );
};

const styles = {
  dashboardContainer: {
    display: "flex",
    height: "100vh",
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f4f7f6",
  },
  sidebar: {
    width: "240px",
    backgroundColor: "#2c3e50",
    color: "white",
    display: "flex",
    flexDirection: "column" as const,
    padding: "20px",
  },
  logo: {
    marginBottom: "40px",
    fontSize: "24px",
    borderBottom: "1px solid #34495e",
    paddingBottom: "10px",
  },
  navList: {
    listStyle: "none",
    padding: 0,
    flexGrow: 1,
  },
  navItem: {
    padding: "15px 0",
    cursor: "pointer",
    borderBottom: "1px solid #34495e",
  },
  logoutBtn: {
    backgroundColor: "#e74c3c",
    color: "white",
    border: "none",
    padding: "10px",
    cursor: "pointer",
    borderRadius: "4px",
  },
  mainContent: {
    flexGrow: 1,
    padding: "40px",
    overflowY: "auto" as const,
  },
  header: {
    marginBottom: "30px",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "20px",
    marginBottom: "40px",
  },
  card: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    textAlign: "center" as const,
  },
  statNumber: {
    fontSize: "32px",
    fontWeight: "bold",
    color: "#2c3e50",
  },
  statusActive: {
    color: "#27ae60",
    fontWeight: "bold",
  },
  recentActivity: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  tablePlaceholder: {
    padding: "10px",
    backgroundColor: "#f9f9f9",
    borderRadius: "4px",
    marginTop: "10px",
  },
};

export default Dashboard;