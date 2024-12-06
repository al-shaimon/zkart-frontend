import AuthRoute from '@/components/auth/AuthRoute';

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthRoute>{children}</AuthRoute>;
} 