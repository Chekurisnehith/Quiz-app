import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();
    setMsg("");
    setSuccess(false);
    try {
      const res = await fetch("http://localhost:4000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) return setMsg(data.error || "Registration failed");

      setSuccess(true); // show success card
      setName("");
      setEmail("");
      setPassword("");

      // Redirect after 2 seconds
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setMsg("Network error");
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Create Account ✨</h2>
        <p style={styles.subtitle}>Register to get started</p>

        <form onSubmit={submit} style={styles.form}>
          <input
            style={styles.input}
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

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
            Register
          </button>
        </form>

        {msg && <div style={styles.error}>{msg}</div>}

        {success && (
          <div style={styles.successBox}>
            ✅ Registered successfully! Redirecting to login...
          </div>
        )}

        <p style={styles.footerText}>
          Already have an account?{" "}
          <span style={styles.link} onClick={() => navigate("/login")}>
            Login here
          </span>
        </p>
      </div>
    </div>
  );
}

// Styles
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
    padding: "10px",
    borderRadius: 8,
    background: "#ffe6e6",
    color: "#d9534f",
    fontSize: 14,
    fontWeight: "bold",
  },
  successBox: {
    marginTop: 15,
    padding: "12px",
    borderRadius: 8,
    background: "#e6ffed",
    color: "#28a745",
    fontSize: 14,
    fontWeight: "bold",
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
