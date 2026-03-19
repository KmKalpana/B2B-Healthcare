import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { signupUser } from "../features/auth/authSlice";
import { Navigate, Link, useNavigate } from "react-router-dom";
import "../styles/signup.css";

export default function Signup() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { user, loading, error } = useAppSelector((s) => s.auth);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
  });

  if (user) {
    return <Navigate to="/dashboard" />;
  }

  const validate = () => {
    const newErrors = {
      name: "",
      email: "",
      password: "",
    };

    if (!name.trim()) newErrors.name = "Name is required";

    if (!email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email))
      newErrors.email = "Invalid email format";

    if (!password) newErrors.password = "Password is required";
    else if (password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    setErrors(newErrors);
    return Object.values(newErrors).some((err) => err);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const hasError = validate();
    if (hasError) return;

    try {
      await dispatch(
        signupUser({ name, email, password })
      ).unwrap();

      navigate("/dashboard");
    } catch (err: any) {
      console.error(err);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h2 className="signup-title">Signup</h2>
        <form onSubmit={handleSubmit} className="signup-form">
          <div>
            <input
              className="signup-input"
              placeholder="Name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setErrors((prev) => ({ ...prev, name: "" }));
              }}
            />
            {errors.name && (
              <p className="field-error">{errors.name}</p>
            )}
          </div>
          <div>
            <input
              className="signup-input"
              placeholder="Email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrors((prev) => ({ ...prev, email: "" }));
              }}
            />
            {errors.email && (
              <p className="field-error">{errors.email}</p>
            )}
          </div>
          <div>
            <input
              className="signup-input"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrors((prev) => ({ ...prev, password: "" }));
              }}
            />
            {errors.password && (
              <p className="field-error">{errors.password}</p>
            )}
          </div>

          <button
            className="signup-button"
            type="submit"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Signup"}
          </button>
        </form>

        <p className="signup-subtitle-small">
          Already have an account?{" "}
          <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
}