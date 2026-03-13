import { useNavigate } from "react-router-dom";
import { Button, Heading, Text } from "../components/ui";
import { PageWrapper, MainContent } from "../components/layout";

function Home() {
  const navigate = useNavigate();

  return (
    <PageWrapper>
      <MainContent>
        <div className="stack-vertical flex-center h-100">
          <Heading level={1}>Welcome</Heading>
          <Text>Please log in to continue</Text>

          <Button onClick={() => navigate("/login")}>Login</Button>
        </div>
      </MainContent>
    </PageWrapper>
  )
}

export default Home;
