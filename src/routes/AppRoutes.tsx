import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import SignUp from "../pages/Signup";
import Dashboard from "../pages/Dashboard";
import Patients from "../pages/Patients";
import Analytics from "../pages/Analytics";
import ProtectedRoute from "./ProtectedRoute";
import PatientDetail from "../pages/PatientDetails";

export default function AppRoutes() {
  return (
    <BrowserRouter>
    <div className="app-container">
      <Routes>
        {/* Public */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Protected */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/patients"
          element={
            <ProtectedRoute>
              <Patients />
            </ProtectedRoute>
          }
        />

        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <Analytics />
            </ProtectedRoute>
          }
        />
        <Route
  path="/patients/:id"
  element={
    <ProtectedRoute>
      <PatientDetail />
    </ProtectedRoute>
  }
/>
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
      </div>
    </BrowserRouter>
  );
}