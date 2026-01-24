import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { CartProvider } from "@/hooks/useCart";

export default async function GuestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  // Require guest or admin session
  if (!session) {
    redirect("/");
  }

  return <CartProvider>{children}</CartProvider>;
}
