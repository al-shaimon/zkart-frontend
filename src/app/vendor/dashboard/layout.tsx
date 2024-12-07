import ProtectedRoute from '@/components/auth/ProtectedRoute';

export default function VendorDashboardLayout({ children }: { children: React.ReactNode }) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}
