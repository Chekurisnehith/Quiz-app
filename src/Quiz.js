import React, { useEffect, useState } from "react";

export default function Quiz({ token, user }) {
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [finished, setFinished] = useState(false);
  const [result, setResult] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    fetch("http://localhost:4000/quiz", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => setQuestions(data.questions || []))
      .catch(() => alert("Failed to load quiz"));
  }, [token]);

  function askCheck(questionId, selectedIndex) {
    fetch("http://localhost:4000/check-answer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ questionId, selectedIndex }),
    })
      .then((r) => r.json())
      .then((data) => {
        const correct = !!data.correct;
        setFeedback(correct ? "✅ Correct!" : "❌ Wrong!");
        setTimeout(() => setFeedback(null), 1500);

        const newAnswers = [...answers, { questionId, selectedIndex }];
        setAnswers(newAnswers);

        if (index + 1 < questions.length) {
          setIndex(index + 1);
        } else {
          submitFullQuiz(newAnswers);
        }
      })
      .catch(() => alert("Check failed"));
  }

  function submitFullQuiz(allAnswers) {
    fetch("http://localhost:4000/submit-quiz", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ answers: allAnswers }),
    })
      .then((r) => r.json())
      .then((data) => {
        setFinished(true);
        setResult(data);
        // Fetch leaderboard
        fetch("http://localhost:4000/leaderboard", {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then((r) => r.json())
          .then((data) => setLeaderboard(data.leaderboard || []));
      })
      .catch(() => alert("Submit failed"));
  }

  function downloadCertificate() {
    const query = new URLSearchParams({
      name: user.name,
      result: result.passed ? "pass" : "fail",
      score: `${result.correct}/${result.total}`,
    });
    const url = `http://localhost:4000/certificate?${query.toString()}`;
    fetch(url, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => res.blob())
      .then((blob) => {
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = `${user.name.replace(/\s+/g, "_")}_certificate.pdf`;
        link.click();
      })
      .catch(() => alert("Failed to download certificate"));
  }

  if (!questions.length && !finished) return <div>Loading quiz...</div>;

  if (finished) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <h2>🎉 Result</h2>
          <p>
            <strong>Score:</strong> {result.correct} / {result.total}
          </p>
          <p style={{ fontSize: 18, fontWeight: "bold" }}>
            {result.passed
              ? "✅ Congratulations! You passed."
              : "❌ Sorry, you failed."}
          </p>
          <button style={styles.primaryBtn} onClick={downloadCertificate}>
            📄 Download Certificate (PDF)
          </button>
        </div>

        {/* Leaderboard */}
        <div style={styles.card}>
          <h2>🏆 Leaderboard</h2>
          <table style={styles.table}>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Name</th>
                <th>Best Score</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((row, i) => (
                <tr key={i} style={{ background: row.name === user.name ? "#f0f8ff" : "white" }}>
                  <td>{i + 1}</td>
                  <td>{row.name}</td>
                  <td>{row.bestScore} / {row.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  const q = questions[index];
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>
          Question {index + 1} / {questions.length}
        </h2>
        <p style={{ fontSize: 18 }}>{q.q}</p>
        <div style={styles.options}>
          {q.options.map((opt, i) => (
            <button
              key={i}
              style={styles.optionBtn}
              onClick={() => askCheck(q.id, i)}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
      {feedback && <div style={styles.snackbar}>{feedback}</div>}
    </div>
  );
}

// 🎨 Styles
const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    minHeight: "100vh",
    padding: 20,
    background: "linear-gradient(135deg, #6dd5fa, #2980b9)",
    fontFamily: "Arial, sans-serif",
    color: "#333",
  },
  card: {
    background: "white",
    padding: 25,
    borderRadius: 12,
    boxShadow: "0 6px 16px rgba(0,0,0,0.2)",
    textAlign: "center",
    width: "100%",
    maxWidth: 600,
    marginBottom: 20,
  },
  options: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
    marginTop: 20,
  },
  optionBtn: {
    padding: "12px 18px",
    fontSize: 16,
    border: "1px solid #2980b9",
    borderRadius: 8,
    background: "#f0f8ff",
    cursor: "pointer",
  },
  primaryBtn: {
    marginTop: 20,
    padding: "12px 20px",
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    background: "#2980b9",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
  },
  snackbar: {
    position: "fixed",
    bottom: 20,
    background: "#333",
    color: "#fff",
    padding: "12px 20px",
    borderRadius: 8,
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    background: "#2980b9",
    color: "white",
    padding: 10,
  },
  td: {
    padding: 10,
    borderBottom: "1px solid #ccc",
  },
};
