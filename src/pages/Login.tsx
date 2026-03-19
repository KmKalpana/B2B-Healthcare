import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { loginUser, clearAuthError } from "../features/auth/authSlice";
import { Navigate, Link } from "react-router-dom";
import "../styles/login.css";


export default function LoginPage() {
  const dispatch = useAppDispatch();
  const { user, loading, error } = useAppSelector((s) => s.auth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (error) {
      dispatch(clearAuthError());
    }
  }, [dispatch, error]);

  if (user) {
    return <Navigate to="/dashboard" />;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Login</h2>

        <form onSubmit={handleSubmit} className="login-form">
          <input
            className="login-input"
            placeholder="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="login-input"
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="login-button" type="submit" disabled={loading}>
            {loading ? "Loading..." : "Login"}
          </button>

          {error && <p className="login-error">{error}</p>}
        </form>

        <p className="login-subtitle-small">
          New user? <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
