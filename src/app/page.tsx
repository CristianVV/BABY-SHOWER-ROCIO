import { redirect } from "next/navigation";
import { getSession, setGuestSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import PasswordGate from "@/components/guest/PasswordGate";

async function validateGuestPassword(password: string): Promise<{ success: boolean; error?: string }> {
  "use server";

  try {
    const settings = await prisma.siteSettings.findFirst();
    const correctPassword = settings?.guestPassword || "Rocio2026";

    if (password === correctPassword) {
      await setGuestSession();
      return { success: true };
    }

    return { success: false, error: "Contraseña incorrecta" };
  } catch {
    return { success: false, error: "Error al verificar la contraseña" };
  }
}

export default async function HomePage() {
  const session = await getSession();

  // If already authenticated as guest, go to gallery
  if (session === "guest") {
    redirect("/gallery");
  }

  // If admin, go to admin dashboard
  if (session === "admin") {
    redirect("/admin");
  }

  // Otherwise, show password gate
  return <PasswordGate validatePassword={validateGuestPassword} />;
}
