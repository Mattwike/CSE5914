import { useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="stack-vertical flex-center h-100">
      <h1>Welcome</h1>
      <p>Please log in to continue</p>

      <Button onClick={() => navigate("/login")}>Login</Button>
    </div>
  );
}
export default Home;
