export default function AdminLoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // The login page has its own layout without auth check
  return <>{children}</>;
}
