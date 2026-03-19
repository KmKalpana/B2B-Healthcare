import { useAppSelector } from "../app/hooks";
import { Navigate, Outlet } from "react-router-dom";


type ProtectedRouteProps = {
  children?: React.ReactNode;
};

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const user = useAppSelector((s) => s.auth.user);

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // If children are passed, use them; otherwise use Outlet (nested routes)
  return children ? children : <Outlet />;
}
