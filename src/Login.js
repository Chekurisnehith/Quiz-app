import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();
    setMsg("");
    try {
      const res = await fetch("http://localhost:4000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) return setMsg(data.error || "Login failed");
      onLogin(data.token, data.user);
    } catch (err) {
      setMsg("Network error");
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Welcome Back 👋</h2>
        <p style={styles.subtitle}>Login to continue</p>

        <form onSubmit={submit} style={styles.form}>
          <input
            style={styles.input}
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            style={styles.input}
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" style={styles.button}>
            Login
          </button>

          {msg && <div style={styles.error}>{msg}</div>}
        </form>

        <p style={styles.footerText}>
          Don’t have an account?{" "}
          <span
            style={styles.link}
            onClick={() => navigate("/register")}
          >
            Register here
          </span>
        </p>
      </div>
    </div>
  );
}

// Inline styles
const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    fontFamily: "Arial, sans-serif",
  },
  card: {
    width: 350,
    background: "#fff",
    padding: "30px 25px",
    borderRadius: 12,
    boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
    textAlign: "center",
  },
  title: {
    margin: "0 0 10px",
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  subtitle: {
    marginBottom: 20,
    fontSize: 14,
    color: "#777",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 15,
  },
  input: {
    padding: "12px 15px",
    fontSize: 14,
    border: "1px solid #ccc",
    borderRadius: 8,
    outline: "none",
    transition: "0.3s",
  },
  button: {
    padding: "12px",
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    transition: "0.3s",
  },
  error: {
    marginTop: 10,
    color: "red",
    fontSize: 14,
  },
  footerText: {
    marginTop: 15,
    fontSize: 14,
    color: "#555",
  },
  link: {
    color: "#667eea",
    fontWeight: "bold",
    cursor: "pointer",
  },
};
