import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  return (
      <div style={styles.container}>
        <h1>Login</h1>

        <input
          style={styles.input}
          type="email"
          placeholder="Email"
        />

        <input
          style={styles.input}
          type="password"
          placeholder="Password"
        />

        <button style={styles.button}>Log In</button>

        <div>
          <p>Don't have an account?</p>
          <button style={styles.button} onClick={() => navigate("/create-account")}>
            Create Account
          </button>
        </div>
      
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
    gap: "20px",
  },
  input: {
    width: "250px",
    padding: "5px",
    fontSize: "20px",
  },
  button: {
    width: "250px",
    fontSize: "20px",
    cursor: "pointer",
  },
};

export default Login;
