import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

// GET: Return public settings (exclude passwords)
export async function GET() {
  try {
    const settings = await prisma.siteSettings.findFirst();

    if (!settings) {
      // Return default settings if none exist
      return NextResponse.json(
        {
          eventTitle: "Baby Shower de Rocio",
          eventDate: "15 de febrero de 2026",
          eventTime: "13:00h",
          eventLocation: "Calle de la Azalea, Alcobendas, Madrid",
          heroMessage:
            "Gracias por acompanarnos en esta celebracion tan especial. Tu carino y generosidad significan el mundo para nosotros.",
          whatsappNumber: "+34649225590",
        },
        { status: 200 }
      );
    }

    // Check if admin to include passwords
    const session = await getSession();

    if (session === "admin") {
      // Return full settings for admin
      return NextResponse.json(settings, { status: 200 });
    }

    // Return public settings only (exclude passwords)
    const publicSettings = {
      id: settings.id,
      eventTitle: settings.eventTitle,
      eventDate: settings.eventDate,
      eventTime: settings.eventTime,
      eventLocation: settings.eventLocation,
      heroMessage: settings.heroMessage,
      whatsappNumber: settings.whatsappNumber,
    };

    return NextResponse.json(publicSettings, { status: 200 });
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json(
      { error: "Error al obtener configuracion" },
      { status: 500 }
    );
  }
}

// PUT: Update settings (admin only)
export async function PUT(request: NextRequest) {
  try {
    const session = await getSession();

    if (session !== "admin") {
      return NextResponse.json(
        { error: "Acceso no autorizado" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      guestPassword,
      adminPassword,
      eventTitle,
      eventDate,
      eventTime,
      eventLocation,
      heroMessage,
      whatsappNumber,
    } = body;

    // Get or create settings
    let settings = await prisma.siteSettings.findFirst();

    if (!settings) {
      // Create default settings first
      settings = await prisma.siteSettings.create({
        data: {
          id: "settings",
        },
      });
    }

    // Build update data
    const updateData: {
      guestPassword?: string;
      adminPassword?: string;
      eventTitle?: string;
      eventDate?: string;
      eventTime?: string;
      eventLocation?: string;
      heroMessage?: string;
      whatsappNumber?: string;
    } = {};

    // Validate password changes
    if (guestPassword !== undefined) {
      if (typeof guestPassword !== "string" || guestPassword.length < 4) {
        return NextResponse.json(
          { error: "La contrasena de invitado debe tener al menos 4 caracteres" },
          { status: 400 }
        );
      }
      updateData.guestPassword = guestPassword;
    }

    if (adminPassword !== undefined) {
      if (typeof adminPassword !== "string" || adminPassword.length < 8) {
        return NextResponse.json(
          { error: "La contrasena de administrador debe tener al menos 8 caracteres" },
          { status: 400 }
        );
      }
      updateData.adminPassword = adminPassword;
    }

    if (eventTitle !== undefined) updateData.eventTitle = eventTitle;
    if (eventDate !== undefined) updateData.eventDate = eventDate;
    if (eventTime !== undefined) updateData.eventTime = eventTime;
    if (eventLocation !== undefined) updateData.eventLocation = eventLocation;
    if (heroMessage !== undefined) updateData.heroMessage = heroMessage;
    if (whatsappNumber !== undefined) updateData.whatsappNumber = whatsappNumber;

    const updatedSettings = await prisma.siteSettings.update({
      where: { id: settings.id },
      data: updateData,
    });

    return NextResponse.json(updatedSettings, { status: 200 });
  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json(
      { error: "Error al actualizar configuracion" },
      { status: 500 }
    );
  }
}
