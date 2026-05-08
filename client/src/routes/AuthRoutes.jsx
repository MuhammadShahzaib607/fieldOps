import { Navigate, Outlet } from "react-router-dom";

export const AuthRoutes = () => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  if (token) {
    // Role ke mutabiq direct dashboard pe bhej do
    if (role === 'admin') return <Navigate to="/all-jobs" replace />;
    if (role === 'worker') return <Navigate to="/my-tasks" replace />;
    if (role === 'client') return <Navigate to="/all-orders" replace />;
  }

  return <Outlet />;
};