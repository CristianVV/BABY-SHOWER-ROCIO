import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { setAdminSession } from "@/lib/auth";

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
    if (password !== settings.adminPassword) {
      return NextResponse.json(
        { error: "Contraseña incorrecta" },
        { status: 401 }
      );
    }

    // Set admin session cookie
    await setAdminSession();

    return NextResponse.json(
      { success: true, message: "Acceso de administrador concedido" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Admin auth error:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
