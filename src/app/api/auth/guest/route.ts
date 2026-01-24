import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { setGuestSession } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password } = body;

    if (!password || typeof password !== "string") {
      return NextResponse.json(
        { error: "La contraseña es requerida" },
        { status: 400 }
      );
    }

    // Get settings from database
    const settings = await prisma.siteSettings.findFirst();

    if (!settings) {
      return NextResponse.json(
        { error: "Configuración no encontrada" },
        { status: 500 }
      );
    }

    // Validate password
    if (password !== settings.guestPassword) {
      return NextResponse.json(
        { error: "Contraseña incorrecta" },
        { status: 401 }
      );
    }

    // Set guest session cookie
    await setGuestSession();

    return NextResponse.json(
      { success: true, message: "Acceso concedido" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Guest auth error:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
