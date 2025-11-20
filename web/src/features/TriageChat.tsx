// web/src/features/TriageChat.tsx
import React, { useState } from "react";

export default function TriageChat() {
  const [symptoms, setSymptoms] = useState("");
  const [age, setAge] = useState(25);
  const [sex, setSex] = useState("unknown");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleAnalyze() {
    if (!symptoms.trim()) {
      alert("Please describe the symptoms.");
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const base =
        import.meta.env.VITE_FUNCTIONS_BASE || "http://localhost:5001";
      const res = await fetch(`${base}/api/triage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symptoms, age, sex }),
      });
      const data = await res.json();
      if (!data.ok) {
        throw new Error(data.error || "triage_failed");
      }
      setResult(data.result);
    } catch (e: any) {
      console.error(e);
      setError(e.message || "Failed to analyze");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h3>AI Symptom Chatbot</h3>
      <p style={{ fontSize: 14, color: "#555" }}>
        This assistant gives a preliminary triage. It does not replace a real
        doctor.
      </p>

      <div style={{ marginBottom: 8 }}>
        <label style={{ marginRight: 8 }}>Age: </label>
        <input
          type="number"
          value={age}
          onChange={(e) => setAge(parseInt(e.target.value || "0"))}
          style={{ width: 80, marginRight: 12 }}
        />
        <label style={{ marginRight: 8 }}>Sex: </label>
        <select
          value={sex}
          onChange={(e) => setSex(e.target.value)}
          style={{ padding: 4 }}
        >
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="unknown">Prefer not to say</option>
        </select>
      </div>

      <textarea
        rows={5}
        style={{ width: "100%", padding: 8 }}
        placeholder="Describe the symptoms, duration, and any important history..."
        value={symptoms}
        onChange={(e) => setSymptoms(e.target.value)}
      />

      <div style={{ marginTop: 8 }}>
        <button onClick={handleAnalyze} disabled={loading}>
          {loading ? "Analyzing..." : "Analyze Symptoms"}
        </button>
      </div>

      {error && (
        <p style={{ color: "red", marginTop: 8 }}>Error: {error}</p>
      )}

      {result && (
        <div
          style={{
            marginTop: 12,
            padding: 10,
            borderRadius: 8,
            border: "1px solid #ddd",
            background: "#f9fafb",
          }}
        >
          <h4>Result</h4>
          <p>
            <b>Severity:</b> {result.severity}/10
          </p>
          <p>
            <b>Summary:</b> {result.summary}
          </p>
          <p>
            <b>Recommended Specialty:</b> {result.recommendedSpecialty}
          </p>
          {result.redFlags && result.redFlags.length > 0 && (
            <>
              <b>Red flags:</b>
              <ul>
                {result.redFlags.map((r: string, i: number) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </>
          )}
          {result.advice && result.advice.length > 0 && (
            <>
              <b>Advice:</b>
              <ul>
                {result.advice.map((a: string, i: number) => (
                  <li key={i}>{a}</li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  );
}