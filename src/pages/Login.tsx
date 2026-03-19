import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { loginUser, clearAuthError } from "../features/auth/authSlice";
import { Navigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import "../styles/login.css";

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const { user, loading, error } = useAppSelector((s) => s.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });


  if (user) {
    return <Navigate to="/dashboard" />;
  }

  const validate = () => {
    const newErrors = {
      email: "",
      password: "",
    };

    if (!email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email))
      newErrors.email = "Invalid email format";

    if (!password) newErrors.password = "Password is required";

    setErrors(newErrors);

    return Object.values(newErrors).some((err) => err);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const hasError = validate();
    if (hasError) return;

    try {
      await dispatch(loginUser({ email, password })).unwrap();
      toast.success("Login successful");
    } catch (err: any) {
      toast.error(err || "Invalid email or password");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Login</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <div>
            <input
              className="login-input"
              placeholder="Email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrors((prev) => ({ ...prev, email: "" }));
                dispatch(clearAuthError());
              }}
            />
            {errors.email && <p className="field-error">{errors.email}</p>}
          </div>

          <div>
            <input
              className="login-input"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrors((prev) => ({ ...prev, password: "" }));
                dispatch(clearAuthError());
              }}
            />
            {errors.password && (
              <p className="field-error">{errors.password}</p>
            )}
          </div>

          <button
            className="login-button"
            type="submit"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="login-subtitle-small">
          New user? <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  );
}