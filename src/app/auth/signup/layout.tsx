import AuthRoute from '@/components/auth/AuthRoute';

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthRoute>{children}</AuthRoute>;
} 