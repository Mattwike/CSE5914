import { useNavigate } from "react-router-dom";

function CreateAccount() {
  const navigate = useNavigate();

return (
      <div style={styles.container}>
        <h1>Create Account</h1>

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

        <input
          style={styles.input}
          type="password"
          placeholder="Confirm Password"
        />
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

export default CreateAccount;