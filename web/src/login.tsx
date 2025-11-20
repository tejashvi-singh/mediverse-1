import { signInAnonymously } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { auth } from "./firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import "./Login.css"; // Import the CSS file

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      if (mode === "signup") {
        await createUserWithEmailAndPassword(auth, email, password);
        alert("Signup successful!");
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        alert("Login successful!");
      }
      navigate("/dashboard");
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  }

  return (
    <div className="login-container">
      <h2 className="login-title">
        {mode === "signup" ? "Create Account" : "Welcome Back"}
      </h2>
      <form onSubmit={handleSubmit} className="login-form">
        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="form-input"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="form-input"
          required
        />
        <div className="button-group">
          <button type="submit" className="primary-button">
            {mode === "signup" ? "Create Account" : "Sign In"}
          </button>
          <button 
            type="button" 
            onClick={() => setMode(mode === "login" ? "signup" : "login")}
            className="secondary-button"
          >
            {mode === "login" ? "Sign Up" : "Sign In"}
          </button>
        </div>
      </form>
      <button
        type="button"
        onClick={() => {
          signInAnonymously(auth)
            .then(() => {
              alert("Signed in as Guest");
              navigate("/dashboard");
            })
            .catch((err) => alert("Error: " + err.message));
        }}
        className="guest-button"
      >
        Continue as Guest
      </button>
    </div>
  );
}