import ProtectedRoute from "../components/ProtectedRoute";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <ProtectedRoute message="Log in to manage your properties.">{children}</ProtectedRoute>;
}
