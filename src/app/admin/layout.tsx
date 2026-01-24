export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Pass-through layout - auth is handled in individual page components or route groups
  return <>{children}</>;
}
