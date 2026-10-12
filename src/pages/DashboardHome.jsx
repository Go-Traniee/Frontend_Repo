import Dashboard from "./Dashboard";
import OrganizationDashboard from "./OrganizationDashboard";

function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem("auth_user"));
  } catch {
    return null;
  }
}

function DashboardHome() {
  const user = getCurrentUser();

  return user?.role === "organization" ? (
    <OrganizationDashboard />
  ) : (
    <Dashboard />
  );
}

export default DashboardHome;