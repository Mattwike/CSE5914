import { useNavigate } from "react-router-dom";
import { Button, Heading, Text, Container } from "../components/ui";

function Home() {
  const navigate = useNavigate();

  return (
    <Container>
      <div className="stack-vertical flex-center h-100">
        <Heading level={1}>Welcome</Heading>
        <Text>Please log in to continue</Text>

        <Button onClick={() => navigate("/login")}>Login</Button>
      </div>
    </Container>
  );
}

export default Home;
