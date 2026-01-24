import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import AdminSidebar from "./AdminSidebar";

interface AdminPageWrapperProps {
  children: React.ReactNode;
}

export default async function AdminPageWrapper({ children }: AdminPageWrapperProps) {
  const session = await getSession();

  if (session !== "admin") {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar />
      <main className="ml-64 p-8">{children}</main>
    </div>
  );
}
