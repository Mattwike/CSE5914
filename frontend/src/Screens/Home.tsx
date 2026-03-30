import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <h1>Welcome</h1>
      <p>Please log in to continue</p>

      <button style={styles.button} onClick={() => navigate("/login")}>
        Login
      </button>
    </div>
  );
}

const styles = {
  container: {
    height: "100px",
    display: "flex",
    flexDirection: "column" as const,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    cursor: "pointer",
  },
};

export default Home;
