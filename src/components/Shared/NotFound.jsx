// components/Shared/NotFound.jsx
import { Link } from "react-router-dom";

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "sans-serif",
    backgroundColor: "#f3f4f6",
    backgroundImage:
      "linear-gradient(180deg, transparent, rgba(37, 99, 235, 0.09) 40%, transparent)",
    textAlign: "center",
    padding: "20px",
  },
  code: {
    fontSize: "96px",
    fontWeight: "bold",
    color: "#2563eb",
    margin: "0",
    lineHeight: "1",
  },
  title: {
    fontSize: "28px",
    fontWeight: "600",
    color: "#111827",
    margin: "16px 0 8px",
  },
  message: {
    fontSize: "16px",
    color: "#6b7280",
    margin: "0 0 32px",
  },
  button: {
    display: "inline-block",
    padding: "12px 28px",
    backgroundColor: "#2563eb",
    color: "#ffffff",
    textDecoration: "none",
    borderRadius: "8px",
    fontSize: "15px",
    fontWeight: "500",
  },
};

export default function NotFound() {
  return (
    <div style={styles.container}>
      <h1 style={styles.code}>404</h1>
      <h2 style={styles.title}>Page Not Found</h2>
      <p style={styles.message}>
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link to="/" style={styles.button}>
        Go Home
      </Link>
    </div>
  );
}
